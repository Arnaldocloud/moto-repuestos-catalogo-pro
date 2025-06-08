
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'default' | 'destructive';
}

const Badge = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className = '', variant = 'primary', ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-800',
      outline: 'border border-gray-300 bg-transparent',
      default: 'bg-blue-600 text-white',
      destructive: 'bg-red-500 text-white'
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium ${
          variantClasses[variant]
        } ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
