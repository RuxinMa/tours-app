export const QuickFact = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
}) => {
  return (
    <div className="flex items-center gap-6 mb-6 text-sm md:text-base">
      {icon}
      <p className="font-medium text-gray-700 uppercase mr-1">{label}</p>
      <p className="font-light text-gray-500">{value}</p>
    </div>
  );
};

export const BackgroundPattern = () => {
  return (
    <div className="absolute inset-0 opacity-10">
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>
    </div>
  );
};

export const DecorativeElement = () => {
  return (
    <div className="mt-2 lg:mt-6 flex justify-end">
      <div className="w-16 h-1 bg-white/30 rounded-full"></div>
    </div>
  );
};