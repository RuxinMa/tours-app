import type { Tour } from '../../types/tour.types';
import { FiClock, FiMapPin, FiUsers, FiStar } from 'react-icons/fi';
import { QuickFact, BackgroundPattern, DecorativeElement } from '../layout/TourUI';

interface TourOverviewProps {
  tour: Tour;
}
  
const TourOverview = ({ tour }: TourOverviewProps) => {
  // Function to get the next available date for the tour
  const getNextDate = () => {
    if (!tour.startDates || tour.startDates.length === 0) {
      return 'No upcoming dates';
    }
    
    const now = new Date();
    const upcomingDates = tour.startDates
      .map(dateStr => new Date(dateStr))
      .filter(date => date > now)
      .sort((a, b) => a.getTime() - b.getTime());
    
    return upcomingDates.length > 0 
      ? upcomingDates[0].toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'No upcoming dates';
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8'> 
        {/* 🌠 LEFT SECTION */}
        <div className="bg-slate-50 p-6">
          {/* Tour Facts */}
          <div className="lg:ml-24 ml-6 mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Quick Facts</h2>
            <QuickFact 
              icon={<FiClock className='icon-color' />} 
              label="next date" 
              value={getNextDate()}
            />
            <QuickFact 
              icon={<FiMapPin className='icon-color' />} 
              label="difficulty" 
              value={tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)} 
            />
            <QuickFact 
              icon={<FiUsers className='icon-color' />} 
              label="participants" 
              value={`${tour.maxGroupSize} people`}
            />
            {tour.ratingsAverage && (
              <QuickFact 
                icon={<FiStar className='icon-color' />} 
                label="rating" 
                value={`${tour.ratingsAverage.toFixed(1)} (${tour.ratingsQuantity || 0})`} 
              />
            )}
          </div>
          {/* Tour Guides */}
          <div className="lg:ml-24 ml-6 mb-4">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Your Tour Guides</h2>
            <div className="space-y-4">
              {tour.guides?.map((guide) => (
                <div key={guide.id} className="flex items-center gap-4 text-sm md:text-base">
                  <img 
                    src={guide.photo} 
                    alt={guide.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="font-medium text-gray-700 uppercase mr-2">
                    {guide.role === 'lead-guide'
                      ? guide.role.split('-').join(' ') // Convert 'lead-guide' to 'Lead Guide'
                      : guide.role}
                  </p>
                  <p className="font-light text-gray-500">{guide.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🌠 RIGHT SECTION */}
        <div className="tour-description">
          <BackgroundPattern />
          {/* Tour Header */}
          <div className='relative z-10 flex flex-col gap-6 md:gap-8'>
            <div className="flex items-center gap-5">
              <div className="w-1 h-8 bg-white rounded-full"></div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wide">
                About {tour.name}
              </h2>
            </div>
            {/* Tour Description */}
            <div className='text-base lg:text-lg leading-relaxed'>
              {tour.description ? (
                tour.description.split('\n').map((line, index) => (
                  <p key={index} className={`${index > 0 ? 'mt-4' : ''} text-white/95`}>
                    {line.trim()}
                  </p>
                ))
              ) : (
                <p className="text-white/90 italic">No description available for this tour.</p>
              )}
            </div>
            <DecorativeElement />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourOverview;
