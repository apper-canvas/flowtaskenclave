import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  icon,
  iconPosition = "left",
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-8 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow hover:scale-105",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:scale-105",
    ghost: "text-gray-700 hover:bg-gray-100 hover:scale-105",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-glow hover:scale-105",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:shadow-glow hover:scale-105",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <ApperIcon name={icon} size={16} className="mr-2" />
      )}
      {children}
      {icon && iconPosition === "right" && (
        <ApperIcon name={icon} size={16} className="ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;