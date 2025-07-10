import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuToggle, onSearch, onQuickAdd }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleQuickAddClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (type) => {
    onQuickAdd?.(type);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30 lg:ml-64">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuToggle}
            icon="Menu"
          />
          
          <div className="hidden md:block">
            <SearchBar
              placeholder="Search tasks and notes..."
              onSearch={handleSearch}
              className="w-80"
            />
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            icon="Search"
          />
          
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={handleQuickAddClick}
              icon="Plus"
              className="shadow-fab"
            >
              <span className="hidden sm:inline">Quick Add</span>
            </Button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-12 shadow-card-hover border border-gray-200 z-50"
                >
                  <div className="py-2">
                    <button
                      onClick={() => handleOptionClick("task")}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <ApperIcon name="CheckSquare" size={18} className="text-primary" />
                      <div>
                        <div className="font-medium text-gray-900">Task</div>
                        <div className="text-sm text-gray-500">Create a new task</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleOptionClick("note")}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <ApperIcon name="FileText" size={18} className="text-primary" />
                      <div>
                        <div className="font-medium text-gray-900">Note</div>
                        <div className="text-sm text-gray-500">Create a new note</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar
          placeholder="Search tasks and notes..."
          onSearch={handleSearch}
        />
      </div>
    </header>
  );
};

export default Header;