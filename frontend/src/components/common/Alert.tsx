import type { ReactNode } from 'react';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
 type?: AlertType;
 children?: ReactNode;
 message?: string;      
 className?: string;
 onClose?: () => void; 
}

const Alert = ({ 
 type = 'error', 
 children, 
 message,
 className = '', 
 onClose
}: AlertProps) => {
 const typeClasses = {
   error: 'bg-red-50 border-red-400 text-red-700',
   success: 'bg-green-50 border-green-400 text-green-700',
   warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
   info: 'bg-blue-50 border-blue-400 text-blue-700'
 };

 const iconClasses = {
   error: 'text-red-400',
   success: 'text-green-400',
   warning: 'text-yellow-400',
   info: 'text-blue-400'
 };

 const closeButtonClasses = {
   error: 'text-red-500 hover:text-red-700 hover:bg-red-100',
   success: 'text-green-500 hover:text-green-700 hover:bg-green-100',
   warning: 'text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100',
   info: 'text-blue-500 hover:text-blue-700 hover:bg-blue-100'
 };

 const getIcon = () => {
   switch (type) {
     case 'success':
       return (
         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
         </svg>
       );
     case 'warning':
       return (
         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
         </svg>
       );
     case 'info':
       return (
         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
       );
     default: // error
       return (
         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
       );
   }
 };

 return (
   <div className={`mb-6 p-4 border-l-4 rounded-lg ${typeClasses[type]} ${className}`}>
     <div className="flex items-center justify-between">
       <div className="flex items-center">
         <div className={`flex-shrink-0 mr-2 ${iconClasses[type]}`}>
           {getIcon()}
         </div>
         <span className="text-sm">{message || children}</span>
       </div>
        {/* Close Button */}
       {onClose && (
         <button
           onClick={onClose}
           className={`ml-4 flex-shrink-0 p-1 rounded-md transition-colors duration-200 ${closeButtonClasses[type]}`}
           aria-label="Close alert"
         >
           <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>
       )}
     </div>
   </div>
 );
};

export default Alert;