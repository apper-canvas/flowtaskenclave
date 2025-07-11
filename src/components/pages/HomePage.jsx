import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ItemGrid from "@/components/organisms/ItemGrid";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import NoteEditor from "@/components/organisms/NoteEditor";
import { taskService } from "@/services/api/taskService";
import { noteService } from "@/services/api/noteService";

const HomePage = ({ folders = [], onQuickAdd }) => {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, notesData] = await Promise.all([
        taskService.getAll(),
        noteService.getAll()
      ]);
      
      setTasks(tasksData);
      setNotes(notesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load data");
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
  
  // Combine and sort items by updatedAt
  const allItems = [...tasks, ...notes].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  
  // Get recent items (last 10)
  const recentItems = allItems.slice(0, 10);
  
  // Get stats
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === "completed").length,
    totalNotes: notes.length,
    totalItems: tasks.length + notes.length,
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-12 p-6 shadow-card">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          ))}
        </div>
        <Loading variant="grid" />
      </div>
    );
  }
  
  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }
  
  return (
    <div className="space-y-8">
{/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}!
        </h1>
        <p className="text-gray-600 mt-1">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-12 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-12 flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={24} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-surface rounded-12 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-success">{stats.completedTasks}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-12 flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
        </div>
        
        <div className="bg-surface rounded-12 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalNotes}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-12 flex items-center justify-center">
              <ApperIcon name="FileText" size={24} className="text-secondary" />
            </div>
          </div>
        </div>
        
        <div className="bg-surface rounded-12 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">All Items</p>
              <p className="text-2xl font-bold text-accent">{stats.totalItems}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-12 flex items-center justify-center">
              <ApperIcon name="Files" size={24} className="text-accent" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Items */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Items</h2>
          {recentItems.length > 0 && (
            <Button variant="outline" size="sm">
              View All
            </Button>
          )}
        </div>
        
<ItemGrid
          items={recentItems}
          folders={folders}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onTaskClick={handleTaskClick}
          onNoteDelete={handleNoteDelete}
          onNoteClick={handleNoteClick}
          emptyIcon="Home"
          emptyTitle="Welcome to FlowTask!"
          emptyDescription="Start organizing your tasks and notes in one place. Create your first item to get started."
        />
      </div>
      
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

export default HomePage;