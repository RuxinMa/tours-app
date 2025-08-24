import { useNavigate } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import NotFound from '../assets/not-found.svg';
import Button from '../components/common/Button';

const ErrorPage = () => {
  const navigate = useNavigate();

  const onGoHome = () => {
    navigate('/');
  };

  return (
    <div className="page-background-main">
      <Navigation />
      <div className='min-h-screen flex justify-center mt-12 md:mt-16 p-6'>
        <div className="max-w-md mx-auto text-center">
          <img 
            src={NotFound} 
            alt="Not Found" 
            className="mx-auto w-64 md:w-96 h-auto" 
          />
          <h1 className="text-2xl md:text-3xl font-bold my-6">
            Sorry, the page you are looking for does not exist.
          </h1>
          <Button 
            onClick={onGoHome}
            fullWidth={true}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;