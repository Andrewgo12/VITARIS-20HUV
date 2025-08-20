import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  X,
  FileText,
  Image,
  Eye,
  Share,
  Printer,
} from "lucide-react";

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  } | null;
}

export default function FileViewerModal({ isOpen, onClose, file }: FileViewerModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!file) return null;

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: file.name,
        text: `Archivo médico: ${file.name}`,
        url: file.url,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(file.url);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-600" />;
      case 'imagen':
      case 'image':
        return <Image className="w-6 h-6 text-blue-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const renderFileContent = () => {
    if (file.type.toLowerCase() === 'pdf') {
      return (
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Documento PDF</h3>
            <p className="text-gray-600 mb-4">{file.name}</p>
            <p className="text-sm text-gray-500 mb-4">
              Vista previa no disponible. Descargue el archivo para verlo completo.
            </p>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      );
    }

    if (file.type.toLowerCase() === 'imagen' || file.type.toLowerCase() === 'image') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          <div
            className="transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                // Fallback for broken images
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          {getFileIcon(file.type)}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">Archivo no compatible</h3>
          <p className="text-gray-600 mb-4">{file.name}</p>
          <p className="text-sm text-gray-500 mb-4">
            Este tipo de archivo no se puede previsualizar en el navegador.
          </p>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Descargar archivo
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-4xl max-h-[90vh]'} overflow-hidden`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(file.type)}
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  {file.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{file.type}</Badge>
                  <span className="text-sm text-gray-600">{file.size}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            {(file.type.toLowerCase() === 'imagen' || file.type.toLowerCase() === 'image') && (
              <>
                <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 25}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {zoom}%
                </span>
                <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 300}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleRotate}>
                  <RotateCw className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </div>
        </div>

        {/* File Content */}
        <div className={`${isFullscreen ? 'h-[calc(95vh-200px)]' : 'h-[500px]'} w-full`}>
          {renderFileContent()}
        </div>

        {/* File Information */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Nombre:</span>
              <p className="text-gray-600 truncate">{file.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tipo:</span>
              <p className="text-gray-600">{file.type}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tamaño:</span>
              <p className="text-gray-600">{file.size}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Estado:</span>
              <p className="text-green-600">✓ Disponible</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium">Información confidencial</p>
              <p className="text-blue-700">
                Este archivo contiene información médica confidencial. Su acceso y uso están regulados por las leyes de protección de datos.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
