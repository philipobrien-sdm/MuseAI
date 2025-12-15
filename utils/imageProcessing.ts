import { ImageFile } from '../types';

const MAX_DIMENSION = 1024; // 1024px is optimal for Gemini vision tasks
const JPEG_QUALITY = 0.8;   // Good balance between quality and size

/**
 * Resizes and compresses an image file.
 * Returns a promise that resolves to an ImageFile object.
 */
export const processImage = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        // Draw to canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Use distinct smoothing for better downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG base64 string
        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        
        // Extract base64 data (remove "data:image/jpeg;base64," prefix)
        const base64 = dataUrl.split(',')[1];

        resolve({
          base64,
          mimeType: 'image/jpeg',
          preview: dataUrl,
        });
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};