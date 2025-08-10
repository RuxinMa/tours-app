import type { Tour } from '../../types/tour.types';

interface TourHeaderProps {
  tour: Tour;
}

// 🎯 Tour Header Component - Hero section with background image and title
const TourHeader = ({ tour }: TourHeaderProps) => {
  return (
    <section className="relative h-screen min-h-96 max-h-[600px] overflow-hidden">
      {/* 🖼️ Background Image */}
      <div className="absolute inset-0">
        <img
          src={tour.imageCover}
          alt={`${tour.name} tour`}
          className="w-full h-full object-cover"
        />
        {/* 🌫️ Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/70"></div>
      </div>

      {/* 📝 Content Overlay */}
      <div className="relative z-10 h-full flex items-end">
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl">
            {/* 🏷️ Tour Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {tour.name} Tour
              </span>
            </h1>

            {/* 📊 Quick Info */}
            <div className="flex flex-wrap gap-6 items-center text-white/90">
              {/* ⏰ Duration */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{tour.duration} days</span>
              </div>

              {/* 📍 Location */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{tour.startLocation.description}</span>
              </div>

              {/* 🎯 Difficulty */}
              <div className={`flex items-center space-x-2 rounded-full px-4 py-2 font-medium ${
                tour.difficulty === 'easy' 
                  ? 'bg-green-500/20 text-green-200 border border-green-400/30'
                  : tour.difficulty === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                  : 'bg-red-500/20 text-red-200 border border-red-400/30'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="capitalize">{tour.difficulty}</span>
              </div>

              {/* ⭐ Rating (if available) */}
              {tour.ratingsAverage && (
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">{tour.ratingsAverage.toFixed(1)}</span>
                  {tour.ratingsQuantity && (
                    <span className="text-white/70">({tour.ratingsQuantity})</span>
                  )}
                </div>
              )}
            </div>

            {/* 💰 Price */}
            <div className="mt-6">
              <div className="inline-flex items-baseline space-x-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl px-6 py-3">
                <span className="text-3xl md:text-4xl font-bold text-emerald-300">
                  ${tour.price}
                </span>
                <span className="text-white/80 text-lg">per person</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔽 Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default TourHeader;