import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  children,
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-8 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white";
  
  const errorStyles = error 
    ? "border-error focus:ring-error" 
    : "border-gray-300 hover:border-gray-400";
  
  return (
    <div className="relative">
      <select
        className={cn(baseStyles, errorStyles, className)}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        size={16} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;