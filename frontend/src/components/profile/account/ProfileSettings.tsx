import SettingsBasic from './SettingsBasic';
import SettingsPassword from './SettingsPassword';

const ProfileSettings = () => {
  return (
    <div className="p-6 space-y-8">
      <SettingsBasic />
      <SettingsPassword />
    </div>
  );
};

export default ProfileSettings; 