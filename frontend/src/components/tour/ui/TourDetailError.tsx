// 🚨 Error Component for Tour Detail
import NotFound from '../../../assets/not-found.svg';
import Button from '../../common/Button';

const TourDetailError = ({ 
  error, 
  onGoBack 
}: { 
  error: string; 
  onGoBack: () => void;
}) => {
  return (
    <div className="min-h-screen flex justify-center bg-gray-50 mt-10 md:mt-16 p-6">
      <div className="max-w-md mx-auto text-center items-center">
        <img 
          src={NotFound} 
          alt="Not Found" 
          className="mx-auto w-64 md:w-96 h-auto" 
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button 
          onClick={onGoBack}
          fullWidth={true}
        >
          ← Back to All Tours
        </Button>
      </div>
    </div>
  );
};

export default TourDetailError;