import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ItemGrid from "@/components/organisms/ItemGrid";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import NoteEditor from "@/components/organisms/NoteEditor";
import { taskService } from "@/services/api/taskService";
import { noteService } from "@/services/api/noteService";

const FolderPage = ({ folders = [], onQuickAdd }) => {
  const { folderId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  
  const folder = folders.find(f => f.Id === parseInt(folderId));
  
  useEffect(() => {
    loadData();
  }, [folderId]);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, notesData] = await Promise.all([
        taskService.getAll(),
        noteService.getAll()
      ]);
      
      // Filter items by folder
      const folderTasks = tasksData.filter(task => task.folderId === parseInt(folderId));
      const folderNotes = notesData.filter(note => note.folderId === parseInt(folderId));
      
      setTasks(folderTasks);
      setNotes(folderNotes);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load folder data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTaskUpdate = async (updatedTask) => {
    try {
      await taskService.update(updatedTask.Id, updatedTask);
      setTasks(prev => prev.map(t => t.Id === updatedTask.Id ? updatedTask : t));
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };
  
  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };
  
  const handleNoteUpdate = async (updatedNote) => {
    try {
      await noteService.update(updatedNote.Id, updatedNote);
      setNotes(prev => prev.map(n => n.Id === updatedNote.Id ? updatedNote : n));
      toast.success("Note updated successfully");
    } catch (err) {
      toast.error("Failed to update note");
    }
  };
  
  const handleNoteDelete = async (noteId) => {
    try {
      await noteService.delete(noteId);
      setNotes(prev => prev.filter(n => n.Id !== noteId));
      toast.success("Note deleted successfully");
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };
  
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };
  
  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setShowNoteEditor(true);
  };
  
  // Combine items
  const allItems = [...tasks, ...notes].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  
  if (!folder) {
    return (
      <Error 
        message="Folder not found" 
        onRetry={() => window.history.back()} 
      />
    );
  }
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
        <Loading variant="grid" />
      </div>
    );
  }
  
  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-12 flex items-center justify-center"
              style={{ backgroundColor: folder.color + "20" }}
            >
              <ApperIcon 
                name={folder.icon} 
                size={24} 
                style={{ color: folder.color }} 
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{folder.name}</h1>
              <p className="text-gray-600 mt-1">
                {tasks.length} tasks, {notes.length} notes
              </p>
            </div>
          </div>
        </div>
        <Button onClick={onQuickAdd} icon="Plus" className="shadow-fab">
          Add Item
        </Button>
      </div>
      
      {/* Items Grid */}
      <ItemGrid
        items={allItems}
        folders={folders}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskClick={handleTaskClick}
        onNoteDelete={handleNoteDelete}
        onNoteClick={handleNoteClick}
        emptyIcon={folder.icon}
        emptyTitle={`No items in ${folder.name}`}
        emptyDescription="Add tasks and notes to this folder to keep them organized."
        onQuickAdd={onQuickAdd}
      />
      
      {/* Modals */}
      <TaskDetailModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        task={selectedTask}
        onUpdate={handleTaskUpdate}
        folders={folders}
      />
      
      <NoteEditor
        isOpen={showNoteEditor}
        onClose={() => setShowNoteEditor(false)}
        note={selectedNote}
        onUpdate={handleNoteUpdate}
        folders={folders}
      />
    </div>
  );
};

export default FolderPage;