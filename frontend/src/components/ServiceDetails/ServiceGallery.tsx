import React, { useState } from 'react';
import { Image, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ServiceGalleryProps {
  images: string[];
  title: string;
}

const ServiceGallery: React.FC<ServiceGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Safe property access
  const safeImages = images || [];
  const safeTitle = title || 'صورة';

  if (!safeImages || safeImages.length === 0) {
    return (
      <div className="mb-6 bg-white rounded-lg shadow-lg p-6 text-center border border-deep-teal/10">
        <Image className="h-12 w-12 text-deep-teal/30 mx-auto mb-3" />
        <p className="text-deep-teal/50">لا توجد صور متاحة</p>
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % safeImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? safeImages.length - 1 : selectedImage - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  };

  return (
    <>
      <div className="mb-6 bg-white rounded-lg shadow-lg p-6 border border-deep-teal/10">
        <div className="flex items-center gap-3 mb-4">
          <Image className="h-6 w-6 text-deep-teal" />
          <h2 className="text-xl font-bold text-deep-teal">معرض الصور</h2>
          <span className="text-sm text-deep-teal/70">({safeImages.length} صورة)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeImages.map((img, idx) => (
            <div
            key={idx}
              className="group relative cursor-pointer overflow-hidden rounded-lg border border-deep-teal/20 hover:border-deep-teal/40 transition-all duration-300"
              onClick={() => handleImageClick(idx)}
            >
              <img
            src={img}
                alt={`${safeTitle} - صورة ${idx + 1}`}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 text-deep-teal px-3 py-1 rounded-full text-sm font-medium">
                    انقر للتكبير
                  </div>
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              title="إغلاق"
              aria-label="إغلاق الصورة"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {safeImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                  title="الصورة السابقة"
                  aria-label="الصورة السابقة"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                  title="الصورة التالية"
                  aria-label="الصورة التالية"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={safeImages[selectedImage]}
              alt={`${safeTitle} - صورة ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            {safeImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedImage + 1} من {safeImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceGallery; 