import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-8 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none";
  
  const errorStyles = error 
    ? "border-error focus:ring-error" 
    : "border-gray-300 hover:border-gray-400";
  
  return (
    <textarea
      className={cn(baseStyles, errorStyles, className)}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;