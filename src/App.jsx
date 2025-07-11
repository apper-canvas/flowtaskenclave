import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { setUser, clearUser } from '@/store/userSlice';
import { store } from '@/store/store';
import Layout from "@/components/organisms/Layout";
import HomePage from "@/components/pages/HomePage";
import TasksPage from "@/components/pages/TasksPage";
import NotesPage from "@/components/pages/NotesPage";
import SearchPage from "@/components/pages/SearchPage";
import FolderPage from "@/components/pages/FolderPage";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import Login from '@/components/pages/Login';
import Signup from '@/components/pages/Signup';
import Callback from '@/components/pages/Callback';
import ErrorPage from '@/components/pages/ErrorPage';
import ResetPassword from '@/components/pages/ResetPassword';
import PromptPassword from '@/components/pages/PromptPassword';
import { folderService } from "@/services/api/folderService";
import { taskService } from "@/services/api/taskService";
import { noteService } from "@/services/api/noteService";

// Create auth context
export const AuthContext = createContext(null);

const AppContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [folders, setFolders] = useState([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
      }
    });
  }, [dispatch, navigate]);
  
  useEffect(() => {
    if (isAuthenticated) {
      loadFolders();
    }
  }, [isAuthenticated]);
  
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
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-screen w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
          <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
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
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;