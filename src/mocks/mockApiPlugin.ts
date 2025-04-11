import { Plugin } from 'vite';
import { handlers } from './handlers';

// This plugin adds middleware to handle API requests during development
export function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        // Parse the URL to get the endpoint
        const url = req.url || '';
        
        // Handle profile endpoints
        if (url.startsWith('/profile/')) {
          const userId = url.split('/profile/')[1];
          
          if (req.method === 'GET') {
            const response = handlers.getProfile(userId);
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response.body));
            return;
          }
          
          if (req.method === 'PUT') {
            // Parse request body
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                const response = handlers.updateProfile(userId, data);
                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(response.body));
              } catch (error) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid request body' }));
              }
            });
            return;
          }
        }
        
        // If no handler matches, pass to the next middleware
        next();
      });
    }
  };
}
