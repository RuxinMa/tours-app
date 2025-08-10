// 🎯 Empty State Component
import empty from '../../assets/empty-tours.svg';

const EmptyTours = () => {
  return (
    <div className="text-center py-12">
      <img 
        src={empty} 
        alt="No tours available" 
        className="w-64 md:w-96 h-auto text-gray-400 mx-auto mb-6 md:mb-12" 
      />
      <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4">
        No tours available
      </h1>
      <p className="text-sm md:text-base text-gray-600">
        Please check back later or explore other sections of the site.
      </p>
    </div>
  );
};

export default EmptyTours;