import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import PrioritySelector from "@/components/molecules/PrioritySelector";
import DatePicker from "@/components/molecules/DatePicker";

const QuickAddModal = ({ isOpen, onClose, onSubmit, folders = [] }) => {
  const [formData, setFormData] = useState({
    type: "task",
    title: "",
    description: "",
    content: "",
    priority: "medium",
    dueDate: "",
    folderId: "",
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    const itemData = {
      title: formData.title,
      folderId: formData.folderId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (formData.type === "task") {
      itemData.description = formData.description;
      itemData.priority = formData.priority;
      itemData.status = "todo";
      itemData.dueDate = formData.dueDate || null;
    } else {
      itemData.content = formData.content;
    }
    
    onSubmit(formData.type, itemData);
    handleReset();
  };
  
  const handleReset = () => {
    setFormData({
      type: "task",
      title: "",
      description: "",
      content: "",
      priority: "medium",
      dueDate: "",
      folderId: "",
    });
    onClose();
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-16 p-6 w-full max-w-md shadow-xl relative"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Quick Add</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div className="flex space-x-2 p-1 bg-gray-100 rounded-8">
                <button
                  type="button"
                  onClick={() => handleChange("type", "task")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-6 text-sm font-medium transition-all duration-200 ${
                    formData.type === "task"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name="CheckSquare" size={16} />
                  <span>Task</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("type", "note")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-6 text-sm font-medium transition-all duration-200 ${
                    formData.type === "note"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name="FileText" size={16} />
                  <span>Note</span>
                </button>
              </div>
              
              {/* Title */}
              <FormField label="Title" required>
                <Input
                  placeholder={`Enter ${formData.type} title...`}
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </FormField>
              
              {/* Content based on type */}
              {formData.type === "task" ? (
                <>
                  <FormField label="Description">
                    <Textarea
                      placeholder="Add a description..."
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      rows={3}
                    />
                  </FormField>
                  
                  <FormField label="Priority">
                    <PrioritySelector
                      value={formData.priority}
                      onChange={(value) => handleChange("priority", value)}
                    />
                  </FormField>
                  
                  <FormField label="Due Date">
                    <DatePicker
                      value={formData.dueDate}
                      onChange={(value) => handleChange("dueDate", value)}
                    />
                  </FormField>
                </>
              ) : (
                <FormField label="Content">
                  <Textarea
                    placeholder="Start writing your note..."
                    value={formData.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    rows={4}
                  />
                </FormField>
              )}
              
              {/* Folder Selection */}
              {folders.length > 0 && (
                <FormField label="Folder">
                  <Select
                    value={formData.folderId}
                    onChange={(e) => handleChange("folderId", e.target.value)}
                  >
                    <option value="">Select a folder</option>
                    {folders.map((folder) => (
                      <option key={folder.Id} value={folder.Id}>
                        {folder.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
              )}
              
              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create {formData.type === "task" ? "Task" : "Note"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;