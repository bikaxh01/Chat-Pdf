"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

const PdfViewer = ({ PDF_URL }: { PDF_URL: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="loader">
            <Loader2 className=" h-10 w-10 text-blue-500 animate-spin" />
          </div>
        </div>
      )}
      <iframe
        src={`https://docs.google.com/gview?url=${PDF_URL}&embedded=true`}
        className="w-full h-full"
        style={{ border: 'none', margin: '0', padding: '0' }}
        onLoad={handleLoad}
        
      />
    </div>
  );
};

export default PdfViewer;
