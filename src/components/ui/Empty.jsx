import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "FileText", 
  title = "No items yet", 
  description = "Get started by creating your first item",
  actionLabel = "Create Item",
  onAction,
  variant = "default"
}) => {
  if (variant === "compact") {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <ApperIcon name={icon} size={24} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 mb-3">{title}</p>
        {onAction && (
          <button
            onClick={onAction}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-8 hover:shadow-glow transition-all duration-200 font-medium hover:scale-105"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default Empty;