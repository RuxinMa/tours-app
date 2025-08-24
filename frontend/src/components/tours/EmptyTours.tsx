// 🎯 Empty State Component
import empty from '../../assets/empty-tours.svg';

interface EmptyToursProps {
  title: string;
  message: string;
}

const EmptyTours = ({ title, message }: EmptyToursProps) => {
  return (
    <div className="text-center py-12">
      <img 
        src={empty} 
        alt="No tours available" 
        className="w-64 md:w-96 h-auto text-gray-400 mx-auto mb-6 md:mb-12" 
      />
      <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2">
        {title}
      </h1>
      <p className="text-sm md:text-base text-gray-600">
        {message}
      </p>
    </div>
  );
};

export default EmptyTours;