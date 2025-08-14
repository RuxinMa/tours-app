interface FormTitleProps {
  title: string;
  icon?: React.ReactNode;
}

interface SettingsFormProps {
  label: string;
  type: string;
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FormTitle = ({ title, icon }: FormTitleProps) => {
  return (
    <div className="flex items-center mb-6 md:text-2xl text-xl gap-4">
      {icon && <span className="text-emerald-400">{icon}</span>}
      <h2 className="font-bold main-color bg-clip-text text-transparent text-center">{title}</h2>
    </div>
  );
}

export const SettingsForm = ({label, type, value, onChange, placeholder}: SettingsFormProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full md:text-base text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
        placeholder={placeholder}
        required
      />
    </div>
  );
}