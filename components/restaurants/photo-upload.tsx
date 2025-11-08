'use client';

/**
 * @file photo-upload.tsx
 * @description Photo upload component for restaurants
 *
 * Handles uploading photos to Supabase Storage for restaurants and side dishes.
 */

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import type { Language } from '@/lib/i18n';

interface PhotoUploadProps {
  restaurantId: string;
  photoType?: 'restaurant' | 'side_dish';
  onUploadComplete?: (url: string) => void;
  language: Language;
}

export function PhotoUpload({
  restaurantId,
  photoType = 'restaurant',
  onUploadComplete,
  language,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const supabase = useClerkSupabaseClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(language === 'ko' ? '이미지 파일만 업로드 가능합니다.' : 'Only image files are allowed.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'ko' ? '파일 크기는 5MB 이하여야 합니다.' : 'File size must be less than 5MB.');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !supabase) return;

    try {
      setUploading(true);

      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${restaurantId}/${Date.now()}.${fileExt}`;
      const filePath = photoType === 'side_dish' 
        ? `restaurants/${restaurantId}/side-dishes/${Date.now()}.${fileExt}`
        : `restaurants/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('restaurant-photos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('restaurant-photos')
        .getPublicUrl(filePath);

      if (onUploadComplete) {
        onUploadComplete(data.publicUrl);
      }

      // Reset form
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert(language === 'ko' ? '사진 업로드 실패' : 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {language === 'ko' ? '사진 업로드' : 'Upload Photo'}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <label className="cursor-pointer">
                <span className="text-sm text-gray-600">
                  {language === 'ko' ? '클릭하여 사진 선택' : 'Click to select photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {selectedFile && (
        <Button onClick={handleUpload} disabled={uploading} className="w-full">
          {uploading
            ? language === 'ko'
              ? '업로드 중...'
              : 'Uploading...'
            : language === 'ko'
              ? '업로드'
              : 'Upload'}
        </Button>
      )}
    </div>
  );
}

