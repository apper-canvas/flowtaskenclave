import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuToggle, onSearch, onQuickAdd }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch?.(query);
  };
  
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
          
          <Button
            onClick={onQuickAdd}
            icon="Plus"
            className="shadow-fab"
          >
            <span className="hidden sm:inline">Quick Add</span>
          </Button>
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