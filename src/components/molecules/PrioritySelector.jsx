import { cn } from "@/utils/cn";

const PrioritySelector = ({ 
  value, 
  onChange, 
  className,
  ...props 
}) => {
  const priorities = [
    { value: "low", label: "Low", color: "bg-success" },
    { value: "medium", label: "Medium", color: "bg-warning" },
    { value: "high", label: "High", color: "bg-accent" }
  ];
  
  return (
    <div className={cn("flex space-x-2", className)} {...props}>
      {priorities.map((priority) => (
        <button
          key={priority.value}
          type="button"
          onClick={() => onChange(priority.value)}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-8 text-sm font-medium transition-all duration-200",
            value === priority.value
              ? "bg-gray-100 text-gray-900 ring-2 ring-primary"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <div className={cn("w-3 h-3 rounded-full", priority.color)}></div>
          <span>{priority.label}</span>
        </button>
      ))}
    </div>
  );
};

export default PrioritySelector;