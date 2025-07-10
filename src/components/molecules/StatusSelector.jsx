import { cn } from "@/utils/cn";

const StatusSelector = ({ 
  value, 
  onChange, 
  className,
  ...props 
}) => {
  const statuses = [
    { value: "todo", label: "To Do", color: "text-gray-600" },
    { value: "in-progress", label: "In Progress", color: "text-info" },
    { value: "completed", label: "Completed", color: "text-success" }
  ];
  
  return (
    <div className={cn("flex space-x-2", className)} {...props}>
      {statuses.map((status) => (
        <button
          key={status.value}
          type="button"
          onClick={() => onChange(status.value)}
          className={cn(
            "px-3 py-2 rounded-8 text-sm font-medium transition-all duration-200",
            value === status.value
              ? "bg-gray-100 text-gray-900 ring-2 ring-primary"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <span className={cn("font-medium", status.color)}>
            {status.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default StatusSelector;