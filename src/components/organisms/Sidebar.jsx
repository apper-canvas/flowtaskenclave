import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Sidebar = ({ folders = [], isOpen, onToggle }) => {
  const [expandedFolders, setExpandedFolders] = useState(true);
  const location = useLocation();
  
  const navigationItems = [
    { name: "All Items", path: "/", icon: "Home" },
    { name: "Tasks", path: "/tasks", icon: "CheckSquare" },
    { name: "Notes", path: "/notes", icon: "FileText" },
    { name: "Search", path: "/search", icon: "Search" },
  ];
  
  const toggleFolders = () => {
    setExpandedFolders(!expandedFolders);
  };
  
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-12 flex items-center justify-center">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">FlowTask</h1>
            <p className="text-sm text-gray-500">Organize & Focus</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-8 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
        
        {/* Folders Section */}
        <div className="pt-4">
          <button
            onClick={toggleFolders}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <span>Folders</span>
            <ApperIcon 
              name={expandedFolders ? "ChevronDown" : "ChevronRight"} 
              size={16} 
              className="transition-transform duration-200"
            />
          </button>
          
          <AnimatePresence>
            {expandedFolders && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1 mt-2">
                  {folders.map((folder) => (
                    <NavLink
                      key={folder.Id}
                      to={`/folder/${folder.Id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-8 text-sm transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )
                      }
                    >
                      <ApperIcon name={folder.icon} size={16} style={{ color: folder.color }} />
                      <span>{folder.name}</span>
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          icon="Settings"
        >
          Settings
        </Button>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-20">
        <SidebarContent />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={onToggle}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;