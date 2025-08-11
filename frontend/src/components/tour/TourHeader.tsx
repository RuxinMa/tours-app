import type { Tour } from '../../types/tour.types';
import { FiClock, FiMapPin, FiArrowDown } from 'react-icons/fi';

interface TourHeaderProps {
  tour: Tour;
}

const TourHeader = ({ tour }: TourHeaderProps) => {
  return (
    <section className="relative h-80 md:h-[570px] overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={tour.imageCover}
          alt={`${tour.name} tour`}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/45"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 pb-12 mt-10 md:mt-24">

            {/* Tour Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-8">
              <span className="main-color bg-clip-text text-transparent">
                {tour.name} Tour
              </span>
            </h1>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-3 md:gap-8 items-center text-white/90">
              {/* ⏰ Duration */}
              <div className="tour-facts">
                <FiClock />
                <span className="font-medium">{tour.duration} days</span>
              </div>

              {/* 📍 Location */}
              <div className="tour-facts">
                <FiMapPin />
                <span className="font-medium">{tour.startLocation.description}</span>
              </div>

              {/* ⭐ Rating */}
              {tour.ratingsAverage && (
                <div className="tour-facts">
                  <span className="text-amber-500">★</span>
                  <span className="font-medium">{tour.ratingsAverage.toFixed(1)}</span>
                  {tour.ratingsQuantity && (
                    <span className="text-white/80">({tour.ratingsQuantity})</span>
                  )}
                </div>
              )}
            </div>

            {/* 💰 Price */}
            <div className="mt-6 md:mt-12">
              <div className="tour-price">
                <span className="text-lg md:text-2xl lg:text-3xl font-bold text-emerald-300">
                  ${tour.price}
                </span>
                <span className="text-white/85 text-sm md:text-lg">per person</span>
              </div>
            </div>
          </div>
        </div>

      {/* 🔽 Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce text-white/80 text-2xl">
          <FiArrowDown />
        </div>
      </div>
    </section>
  );
};

export default TourHeader;