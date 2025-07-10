import { motion } from "framer-motion";
import TaskCard from "./TaskCard";
import NoteCard from "./NoteCard";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.Id}
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
      ))}
    </div>
  );
};

export default ItemGrid;