import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Save, AlertTriangle } from 'lucide-react';
import { useForm } from '@/context/FormContext';
import { saveFormToStorage } from '@/lib/persistence';

export default function EmergencyFloatingButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { formData } = useForm();

  const handleSave = () => {
    saveFormToStorage(formData);
    alert('Formulario guardado localmente');
    setIsExpanded(false);
  };

  const handleEmergency = () => {
    window.location.href = 'tel:123';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <Card className="mb-4 bg-white/95 backdrop-blur-sm border-destructive/20 shadow-xl animate-in slide-in-from-bottom-2">
          <CardContent className="p-4 space-y-3">
            <Button
              onClick={handleEmergency}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Emergencia 123
            </Button>
            <Button
              onClick={handleSave}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Progreso
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        size="lg"
        className={`
          w-14 h-14 rounded-full shadow-lg transition-all duration-200
          ${isExpanded 
            ? 'bg-muted hover:bg-muted/80 text-foreground rotate-45' 
            : 'bg-destructive hover:bg-destructive/90 text-white animate-pulse'
          }
        `}
      >
        {isExpanded ? (
          <span className="text-2xl">×</span>
        ) : (
          <AlertTriangle className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
