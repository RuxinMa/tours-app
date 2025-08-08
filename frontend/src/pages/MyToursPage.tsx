import MainLayout from "../components/layout/MainLayout";

const MyToursPage = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">My Tours</h1>
        <p className="text-center text-gray-600">Your booked tours will be displayed here</p>
      </div>
    </MainLayout>
  );
};

export default MyToursPage;