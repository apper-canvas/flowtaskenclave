import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const DatePicker = forwardRef(({ 
  className, 
  value,
  onChange,
  placeholder = "Select date",
  ...props 
}, ref) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="relative">
      <input
        type="date"
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
          className
        )}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        ref={ref}
        {...props}
      />
      <ApperIcon 
        name="Calendar" 
        size={16} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
});

DatePicker.displayName = "DatePicker";

export default DatePicker;