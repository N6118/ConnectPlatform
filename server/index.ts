import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors';
import dotenv from 'dotenv';
import profileRoutes from './routes/profileRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Routes
app.use('/api', profileRoutes);

(async () => {
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Modified server startup logic
  const findAvailablePort = async (startPort: number, maxAttempts: number = 10): Promise<number> => {
    const { Server } = await import('net');
    
    for (let port = startPort; port < startPort + maxAttempts; port++) {
      try {
        await new Promise((resolve, reject) => {
          const testServer = new Server();
          testServer.once('error', reject);
          testServer.once('listening', () => {
            testServer.close();
            resolve(port);
          });
          testServer.listen(port);
        });
        return port;
      } catch (err: any) {
        if (err.code !== 'EADDRINUSE') throw err;
      }
    }
    throw new Error(`No available ports found between ${startPort} and ${startPort + maxAttempts - 1}`);
  };

  const startServer = async (desiredPort: number) => {
    try {
      const port = await findAvailablePort(desiredPort);
      server.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    } catch (error: any) {
      console.error('Failed to start server:', error.message);
      process.exit(1);
    }
  };

  startServer(3000);
})();
