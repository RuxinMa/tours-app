// 🚨 Error Component for Tour Detail
import NotFound from '../../assets/not-found.svg';

const TourDetailError = ({ 
  error, 
  onRetry, 
  onGoBack 
}: { 
  error: string; 
  onRetry: () => void;
  onGoBack: () => void;
}) => {
  return (
    <div className="min-h-screen flex justify-center bg-gray-50 mt-10">
      <div className="max-w-md mx-auto text-center">
        <img 
          src={NotFound} 
          alt="Not Found" 
          className="mx-auto w-64 md:w-96 h-auto mt-16" 
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        
        <div className="space-y-4">
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-md font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
          
          <button
            onClick={onGoBack}
            className="w-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 px-6 py-2 rounded-md font-medium transition-colors duration-200"
          >
            ← Back to Tours
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourDetailError;