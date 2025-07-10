import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox";

const TaskCard = ({ task, onUpdate, onDelete, onClick, folders = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleStatusChange = (e) => {
    e.stopPropagation();
    const newStatus = task.status === "completed" ? "todo" : "completed";
    onUpdate({ ...task, status: newStatus });
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.Id);
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-accent";
      case "medium": return "bg-warning";
      case "low": return "bg-success";
      default: return "bg-gray-300";
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed": return { variant: "success", label: "Completed" };
      case "in-progress": return { variant: "info", label: "In Progress" };
      default: return { variant: "default", label: "To Do" };
    }
  };
  
  const folder = folders.find(f => f.Id === task.folderId);
  const statusBadge = getStatusBadge(task.status);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "bg-surface rounded-12 p-6 shadow-card transition-all duration-200 cursor-pointer",
        "hover:shadow-card-hover",
        task.status === "completed" && "opacity-75"
      )}
      onClick={() => onClick(task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={task.status === "completed"}
            onChange={handleStatusChange}
          />
          <div className={cn("w-3 h-3 rounded-full", getPriorityColor(task.priority))}></div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={statusBadge.variant} size="sm">
            {statusBadge.label}
          </Badge>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-error transition-colors duration-200"
            >
              <ApperIcon name="Trash2" size={16} />
            </motion.button>
          )}
        </div>
      </div>
      
      <h3 className={cn(
        "font-semibold text-gray-900 mb-2",
        task.status === "completed" && "line-through text-gray-500"
      )}>
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          {task.dueDate && (
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={14} />
              <span>{format(new Date(task.dueDate), "MMM d")}</span>
            </div>
          )}
          {folder && (
            <div className="flex items-center space-x-1">
              <ApperIcon name={folder.icon} size={14} style={{ color: folder.color }} />
              <span>{folder.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <ApperIcon name="CheckSquare" size={14} />
          <span>Task</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;