import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import ItemGrid from "@/components/organisms/ItemGrid";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import NoteEditor from "@/components/organisms/NoteEditor";
import { taskService } from "@/services/api/taskService";
import { noteService } from "@/services/api/noteService";

const SearchPage = ({ folders = [], onQuickAdd }) => {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    filterItems();
  }, [searchQuery, tasks, notes]);
  
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
  
  const filterItems = () => {
    if (!searchQuery.trim()) {
      setFilteredItems([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const allItems = [...tasks, ...notes];
    
    const filtered = allItems.filter(item => {
      const titleMatch = item.title?.toLowerCase().includes(query);
      const descriptionMatch = item.description?.toLowerCase().includes(query);
      const contentMatch = item.content?.toLowerCase().includes(query);
      
      return titleMatch || descriptionMatch || contentMatch;
    });
    
    // Sort by relevance (title matches first)
    const sorted = filtered.sort((a, b) => {
      const aTitle = a.title?.toLowerCase().includes(query);
      const bTitle = b.title?.toLowerCase().includes(query);
      
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    
    setFilteredItems(sorted);
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
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search</h1>
          <p className="text-gray-600 mt-1">
            Find your tasks and notes quickly
          </p>
        </div>
        <Button onClick={onQuickAdd} icon="Plus" className="shadow-fab">
          Quick Add
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="max-w-2xl">
        <SearchBar
          placeholder="Search tasks, notes, and content..."
          onSearch={handleSearch}
          className="w-full"
        />
      </div>
      
      {/* Search Results */}
      {searchQuery ? (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <ApperIcon name="Search" size={20} className="text-gray-500" />
            <span className="text-gray-600">
              {filteredItems.length} results for "{searchQuery}"
            </span>
          </div>
          
          {filteredItems.length > 0 ? (
            <ItemGrid
              items={filteredItems}
              folders={folders}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onTaskClick={handleTaskClick}
              onNoteDelete={handleNoteDelete}
              onNoteClick={handleNoteClick}
            />
          ) : (
            <Empty
              icon="Search"
              title="No results found"
              description={`No items match your search for "${searchQuery}". Try different keywords or create a new item.`}
              actionLabel="Create Item"
              onAction={onQuickAdd}
            />
          )}
        </div>
      ) : (
        <Empty
          icon="Search"
          title="Start searching"
          description="Enter keywords to find your tasks and notes quickly. Search by title, description, or content."
          variant="compact"
        />
      )}
      
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

export default SearchPage;