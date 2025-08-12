import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import type { Tour } from '../../types/tour.types';

interface TourGalleryProps {
  tour: Tour;
}

const TourGallery = ({ tour }: TourGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const renderModal = () => {
    return (
      <div 
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={handleCloseModal}
      >
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-60 bg-black/50 rounded-full p-2"
        >
          <FiX size={24} />
        </button>

        {/* Enlarged Image */}
        <div
          className="max-w-4xl max-h-full"
          onClick={(e) => e.stopPropagation()}  // Prevent closing modal when clicking on image
        >
          <img
            src={`/img/tours/${selectedImage}`}
            alt={`${tour.name} - Gallery Image`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <section className="relative -skew-y-3 overflow-hidden md:mt-8 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Gallery Images */}
        {tour.images?.slice(0, 3).map((image, index) => (
          <div
            key={index}
            className="gallery group"
            onClick={() => handleImageClick(image)}
          >
            <img
              src={`/img/tours/${image}`}
              alt={`${tour.name} - Image ${index + 1}`}
              className="gallery-image"
            />
            {/* Overlay with text */}
            <div className="gallery-overlay">
              <span className="text-white text-lg font-semibold skew-y-3">
                View Image
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for enlarged image */}
      {selectedImage && createPortal(renderModal(), document.body)}
    </section>
  );
};

export default TourGallery;