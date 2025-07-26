'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { X, Maximize2, Trash2, Download, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageItem {
  id: string;
  url: string;
  name?: string;
  uploadedAt?: string;
  size?: number;
}

interface ImageGalleryProps {
  images: ImageItem[];
  onImageDelete?: (imageId: string, imageUrl: string) => void;
  onImageClick?: (image: ImageItem) => void;
  className?: string;
  allowDelete?: boolean;
  showDownload?: boolean;
  maxColumns?: number;
}

interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
}

export function ImageGallery({
  images,
  onImageDelete,
  onImageClick,
  className = '',
  allowDelete = true,
  showDownload = true,
  maxColumns = 4,
}: ImageGalleryProps) {
  const { user } = useAuth();
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    currentIndex: 0,
  });
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());
  const supabase = createClient();

  const openLightbox = useCallback((index: number) => {
    setLightbox({ isOpen: true, currentIndex: index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ isOpen: false, currentIndex: 0 });
  }, []);

  const navigateLightbox = useCallback(
    (direction: 'prev' | 'next') => {
      setLightbox((prev) => {
        const newIndex =
          direction === 'next'
            ? (prev.currentIndex + 1) % images.length
            : (prev.currentIndex - 1 + images.length) % images.length;
        return { ...prev, currentIndex: newIndex };
      });
    },
    [images.length]
  );

  const handleImageClick = useCallback(
    (image: ImageItem, index: number) => {
      if (onImageClick) {
        onImageClick(image);
      } else {
        openLightbox(index);
      }
    },
    [onImageClick, openLightbox]
  );

  const handleDeleteImage = useCallback(
    async (imageId: string, imageUrl: string) => {
      if (!user || !allowDelete) return;

      if (!confirm('이 이미지를 삭제하시겠습니까?')) return;

      setDeletingImages((prev) => new Set(prev).add(imageId));

      try {
        // Extract file path from URL for Supabase Storage deletion
        const urlParts = imageUrl.split('/');
        const bucket = 'travel-images'; // Default bucket name
        const filePath = urlParts.slice(urlParts.indexOf(bucket) + 1).join('/');

        if (filePath) {
          const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

          if (error) {
            console.error('Storage deletion error:', error);
          }
        }

        onImageDelete?.(imageId, imageUrl);
      } catch (error) {
        console.error('Delete image error:', error);
        alert('이미지 삭제 중 오류가 발생했습니다.');
      } finally {
        setDeletingImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      }
    },
    [user, allowDelete, supabase, onImageDelete]
  );

  const handleDownloadImage = useCallback(
    async (imageUrl: string, imageName?: string) => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = imageName || `image-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download error:', error);
        alert('이미지 다운로드 중 오류가 발생했습니다.');
      }
    },
    []
  );

  if (images.length === 0) {
    return (
      <div className={`py-12 text-center text-gray-500 ${className}`}>
        <div className="mb-2 text-gray-400">📷</div>
        <div className="tracking-korean-normal">
          아직 업로드된 이미지가 없습니다
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${className}`}>
        <div
          className={`grid gap-4 ${maxColumns === 1 ? 'grid-cols-1' : maxColumns === 2 ? 'grid-cols-1 sm:grid-cols-2' : maxColumns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}
        >
          {images.map((image, index) => (
            <div key={image.id} className="group relative">
              <div className="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={image.url}
                  alt={image.name || `이미지 ${index + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  onClick={() => handleImageClick(image, index)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />

                {/* Overlay with actions */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-200 group-hover:bg-opacity-50">
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      onClick={() => openLightbox(index)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>

                    {showDownload && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                        onClick={() =>
                          handleDownloadImage(image.url, image.name)
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}

                    {allowDelete && user && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 bg-red-500 bg-opacity-90 text-white hover:bg-opacity-100"
                        onClick={() => handleDeleteImage(image.id, image.url)}
                        disabled={deletingImages.has(image.id)}
                      >
                        {deletingImages.has(image.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {image.name && (
                <div className="mt-2 truncate text-sm text-gray-600 tracking-korean-normal">
                  {image.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative flex h-full max-h-full w-full max-w-7xl items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white transition-colors hover:bg-opacity-70"
              aria-label="라이트박스 닫기"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-4 z-10 rounded-full bg-black bg-opacity-50 p-3 text-white transition-colors hover:bg-opacity-70"
                  aria-label="이전 이미지"
                >
                  ←
                </button>
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-4 z-10 rounded-full bg-black bg-opacity-50 p-3 text-white transition-colors hover:bg-opacity-70"
                  aria-label="다음 이미지"
                >
                  →
                </button>
              </>
            )}

            {/* Main image */}
            <div className="relative flex h-full w-full items-center justify-center">
              <Image
                src={images[lightbox.currentIndex]?.url || ''}
                alt={images[lightbox.currentIndex]?.name || '이미지'}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Image info */}
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-black bg-opacity-50 p-4 text-center text-white">
              <div className="text-lg font-medium tracking-korean-normal">
                {images[lightbox.currentIndex]?.name ||
                  `이미지 ${lightbox.currentIndex + 1}`}
              </div>
              <div className="mt-1 text-sm text-gray-300">
                {lightbox.currentIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
