import Navigation from '../components/layout/Navigation';
import NotFound from '../assets/not-found.svg';

const ErrorPage = () => {
  return (
    <div className="page-background-main">
      <Navigation />
      <div className='pt-6 md:pt-10 mb-4 text-center'>
        <img 
          src={NotFound} 
          alt="Not Found" 
          className="mx-auto w-64 md:w-96 h-auto mt-16" 
        />
        <h1 className="text-2xl md:text-3xl font-bold mt-12">
          Sorry, the page you are looking for does not exist.
        </h1>
      </div>
    </div>
  );
};

export default ErrorPage;