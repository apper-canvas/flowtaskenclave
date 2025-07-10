import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NoteCard = ({ note, onDelete, onClick, folders = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(note.Id);
  };
  
  const folder = folders.find(f => f.Id === note.folderId);
  
  // Extract first 150 characters for preview
  const getPreview = (content) => {
    if (!content) return "";
    const text = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-surface rounded-12 p-6 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer"
      onClick={() => onClick(note)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex-1 mr-4">
          {note.title}
        </h3>
        
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
      
      {note.content && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {getPreview(note.content)}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" size={14} />
            <span>{format(new Date(note.updatedAt), "MMM d, yyyy")}</span>
          </div>
          {folder && (
            <div className="flex items-center space-x-1">
              <ApperIcon name={folder.icon} size={14} style={{ color: folder.color }} />
              <span>{folder.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <ApperIcon name="FileText" size={14} />
          <span>Note</span>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;