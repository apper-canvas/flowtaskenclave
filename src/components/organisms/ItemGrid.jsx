import { motion } from "framer-motion";
import React from "react";
import TaskCard from "@/components/organisms/TaskCard";
import NoteCard from "@/components/organisms/NoteCard";
import Empty from "@/components/ui/Empty";
const ItemGrid = ({ 
  items = [], 
  folders = [], 
  onTaskUpdate, 
  onTaskDelete, 
  onTaskClick,
  onNoteDelete,
  onNoteClick,
  emptyIcon = "Files",
  emptyTitle = "No items yet",
  emptyDescription = "Create your first task or note to get started",
  onQuickAdd
}) => {
  if (items.length === 0) {
    return (
      <Empty
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Create Item"
        onAction={onQuickAdd}
      />
    );
  }
  
return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => {
        // Generate unique key for mixed task/note items
        const itemType = item.status !== undefined ? 'task' : 'note';
        const itemId = item.Id || item.id || `${itemType}-${index}`;
        const uniqueKey = `${itemType}-${itemId}`;
        return (
          <motion.div
            key={uniqueKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
{item.status !== undefined ? (
              <TaskCard
                task={item}
                onUpdate={onTaskUpdate}
                onDelete={onTaskDelete}
                onClick={onTaskClick}
                folders={folders}
              />
            ) : (
              <NoteCard
                note={item}
                onDelete={onNoteDelete}
                onClick={onNoteClick}
                folders={folders}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ItemGrid;