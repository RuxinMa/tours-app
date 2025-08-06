import Navigation from '../components/common/Navigation';

const ErrorPage = () => {
  return (
    <div className="page-background-main">
      <Navigation />
      <h1 className="text-center text-3xl font-bold mt-10">
        Not Found! 404 Error
      </h1>
    </div>
  );
};

export default ErrorPage;