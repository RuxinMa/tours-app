// 🎯 Error Component
import toursError from '../../assets/tours-error.svg';
import Button from '../common/Button';

const ToursError = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  return (
    <div className="text-center py-12 space-y-6">
      <img 
        src={toursError} 
        alt="Error loading tours"
        className="w-60 md:w-72 h-auto text-gray-400 mx-auto mb-6 md:mb-12" 
      />
      <h1 className="text-xl md:text-2xl font-medium text-gray-900 mb-4">
        Unable to load tours
      </h1>
      <p className="text-gray-500 mb-4">{error}</p>
      <div className="px-12 md:px-32">
        <Button 
          variant="primary"
          onClick={onRetry}
          fullWidth={true}
        >
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ToursError;