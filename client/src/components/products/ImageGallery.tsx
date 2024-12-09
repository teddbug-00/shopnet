import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [initialTouchX, setInitialTouchX] = useState<number | null>(null);

  if (!images.length) {
    return (
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setInitialTouchX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (initialTouchX === null) return;

    const currentX = e.touches[0].clientX;
    const diff = initialTouchX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setInitialTouchX(null);
    }
  };

  const handleTouchEnd = () => {
    setInitialTouchX(null);
  };

  return (
    <>
      {/* Main Gallery View */}
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsFullscreen(true)}
          />

          {/* Navigation Arrows - Hidden on Mobile (use swipe instead) */}
          {images.length > 1 && (
            <div className="hidden sm:block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white
                         hover:bg-black/40 transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white
                         hover:bg-black/40 transition-colors"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white
                          text-sm px-3 py-1 rounded-full"
            >
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails - Hidden on Mobile */}
        {images.length > 1 && (
          <div className="hidden sm:grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={image}
                onClick={() => setCurrentIndex(index)}
                className={`
                  aspect-square rounded-lg overflow-hidden
                  ${currentIndex === index ? "ring-2 ring-primary" : ""}
                `}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen View */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 z-50"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>

            <div
              className="h-full p-4 flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.img
                key={`fullscreen-${currentIndex}`}
                src={images[currentIndex]}
                alt={`Product image ${currentIndex + 1}`}
                className="max-h-full max-w-full object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Fullscreen Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ChevronLeftIcon className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ChevronRightIcon className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
