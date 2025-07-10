import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, variant = "default" }) => {
  if (variant === "inline") {
    return (
      <div className="flex items-center space-x-2 text-error text-sm">
        <ApperIcon name="AlertCircle" size={16} />
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-primary hover:text-primary/80 underline font-medium"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" size={32} className="text-error" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-8 hover:shadow-glow transition-all duration-200 font-medium"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default Error;