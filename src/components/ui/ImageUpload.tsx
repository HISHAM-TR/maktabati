
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, User } from "lucide-react";

interface ImageUploadProps {
  initialImage?: string;
  onImageChange: (imageBase64: string) => void;
  className?: string;
}

const ImageUpload = ({ initialImage, onImageChange, className }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(initialImage);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة كبير جدًا. الحد الأقصى هو 5 ميجابايت");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("يرجى اختيار ملف صورة صالح");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(undefined);
    onImageChange("");
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="mb-3 relative">
        <Avatar className="h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity">
          {preview ? (
            <AvatarImage src={preview} alt="صورة الملف الشخصي" />
          ) : (
            <AvatarFallback className="bg-primary/10">
              <User className="h-12 w-12 text-primary" />
            </AvatarFallback>
          )}
        </Avatar>
        
        {preview && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -left-2 h-6 w-6 rounded-full"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-reverse space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => document.getElementById("profileImage")?.click()}
        >
          <Upload className="ml-2 h-3 w-3" />
          {preview ? "تغيير الصورة" : "إضافة صورة"}
        </Button>
      </div>
      
      <input
        id="profileImage"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
