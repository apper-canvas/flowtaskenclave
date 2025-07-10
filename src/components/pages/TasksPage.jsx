import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ItemGrid from "@/components/organisms/ItemGrid";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import { taskService } from "@/services/api/taskService";

const TasksPage = ({ folders = [], onQuickAdd }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [filter, setFilter] = useState("all");
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tasksData = await taskService.getAll();
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load tasks");
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
  
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case "todo":
        return task.status === "todo";
      case "in-progress":
        return task.status === "in-progress";
      case "completed":
        return task.status === "completed";
      default:
        return true;
    }
  });
  
  // Get stats
  const stats = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse w-20"></div>
          ))}
        </div>
        <Loading variant="grid" />
      </div>
    );
  }
  
  if (error) {
    return <Error message={error} onRetry={loadTasks} />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your tasks and track progress
          </p>
        </div>
        <Button onClick={onQuickAdd} icon="Plus" className="shadow-fab">
          Add Task
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-8 text-sm font-medium transition-all duration-200 ${
            filter === "all"
              ? "bg-primary/10 text-primary"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All ({stats.all})
        </button>
        <button
          onClick={() => setFilter("todo")}
          className={`px-4 py-2 rounded-8 text-sm font-medium transition-all duration-200 ${
            filter === "todo"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          To Do ({stats.todo})
        </button>
        <button
          onClick={() => setFilter("in-progress")}
          className={`px-4 py-2 rounded-8 text-sm font-medium transition-all duration-200 ${
            filter === "in-progress"
              ? "bg-info/10 text-info"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          In Progress ({stats.inProgress})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-8 text-sm font-medium transition-all duration-200 ${
            filter === "completed"
              ? "bg-success/10 text-success"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Completed ({stats.completed})
        </button>
      </div>
      
      {/* Tasks Grid */}
      <ItemGrid
        items={filteredTasks}
        folders={folders}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskClick={handleTaskClick}
        emptyIcon="CheckSquare"
        emptyTitle="No tasks found"
        emptyDescription="Create your first task to start organizing your work."
        onQuickAdd={onQuickAdd}
      />
      
      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        task={selectedTask}
        onUpdate={handleTaskUpdate}
        folders={folders}
      />
    </div>
  );
};

export default TasksPage;