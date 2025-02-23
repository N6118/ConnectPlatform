import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import html2canvas from 'html2canvas';

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  filename: string;
}

const exportToImage = (elementRef: React.RefObject<HTMLDivElement>, filename: string) => {
  if (elementRef.current) {
    html2canvas(elementRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
};

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  filename
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
            {/* Remove the extra } that was here */}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToImage(chartRef, filename)}
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent ref={chartRef} className="p-4">
        {children}
      </CardContent>
    </Card>
  );
};