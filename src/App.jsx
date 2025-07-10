import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import HomePage from "@/components/pages/HomePage";
import TasksPage from "@/components/pages/TasksPage";
import NotesPage from "@/components/pages/NotesPage";
import SearchPage from "@/components/pages/SearchPage";
import FolderPage from "@/components/pages/FolderPage";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import { folderService } from "@/services/api/folderService";
import { taskService } from "@/services/api/taskService";
import { noteService } from "@/services/api/noteService";

const App = () => {
  const [folders, setFolders] = useState([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    loadFolders();
  }, []);
  
  const loadFolders = async () => {
    try {
      const foldersData = await folderService.getAll();
      setFolders(foldersData.sort((a, b) => a.order - b.order));
    } catch (err) {
      toast.error("Failed to load folders");
    }
  };
  
  const handleQuickAdd = () => {
    setShowQuickAdd(true);
  };
  
  const handleQuickAddSubmit = async (type, itemData) => {
    try {
      if (type === "task") {
        await taskService.create(itemData);
        toast.success("Task created successfully");
      } else {
        await noteService.create(itemData);
        toast.success("Note created successfully");
      }
    } catch (err) {
      toast.error(`Failed to create ${type}`);
    }
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout 
                folders={folders} 
                onSearch={handleSearch} 
                onQuickAdd={handleQuickAdd} 
              />
            }
          >
            <Route index element={<HomePage folders={folders} onQuickAdd={handleQuickAdd} />} />
            <Route path="tasks" element={<TasksPage folders={folders} onQuickAdd={handleQuickAdd} />} />
            <Route path="notes" element={<NotesPage folders={folders} onQuickAdd={handleQuickAdd} />} />
            <Route path="search" element={<SearchPage folders={folders} onQuickAdd={handleQuickAdd} />} />
            <Route path="folder/:folderId" element={<FolderPage folders={folders} onQuickAdd={handleQuickAdd} />} />
          </Route>
        </Routes>
        
        <QuickAddModal
          isOpen={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
          onSubmit={handleQuickAddSubmit}
          folders={folders}
        />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
};

export default App;