
import { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  onImageSelect: (imageBase64: string) => void;
  label?: string;
  initialImage?: string;
}

const ImageUpload = ({ onImageSelect, label = "Subir Imagen", initialImage }: ImageUploadProps) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        variant: "destructive",
        title: "Imagen demasiado grande",
        description: "La imagen debe ser menor a 5MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImage(result);
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        className="border rounded-lg overflow-hidden bg-card cursor-pointer"
        onClick={handleButtonClick}
      >
        {image ? (
          <div className="relative">
            <img 
              src={image} 
              alt="Imagen seleccionada" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 bg-background/80 rounded-full p-1">
              <Camera className="h-5 w-5 text-primary" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 bg-muted">
            <Camera className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Haz clic para seleccionar imagen</p>
          </div>
        )}
      </div>

      <Button 
        onClick={handleButtonClick} 
        variant="outline" 
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        {label}
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
