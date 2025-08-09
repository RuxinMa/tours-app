import MainLayout from '../components/layout/MainLayout';
import { ToursTest } from '../components/tours/ToursTest';

const HomePage = () => {
  return (
      <MainLayout >
        <h1 className="text-center text-3xl font-bold">
          Welcome to the Home Page
        </h1>
        <ToursTest />
      </MainLayout>
  );
};

export default HomePage;