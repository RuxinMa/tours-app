import MainLayout from '../components/layout/MainLayout';

const ProfilePage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>
        <p className="text-center text-gray-600">User profile and reviews will be displayed here</p>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;