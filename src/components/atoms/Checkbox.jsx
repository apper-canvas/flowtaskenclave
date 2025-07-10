import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className, 
  checked,
  onChange,
  ...props 
}, ref) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      <div className={cn(
        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
        checked 
          ? "bg-primary border-primary" 
          : "border-gray-300 hover:border-gray-400",
        className
      )}>
        {checked && (
          <ApperIcon name="Check" size={12} className="text-white" />
        )}
      </div>
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;