import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import PrioritySelector from "@/components/molecules/PrioritySelector";
import StatusSelector from "@/components/molecules/StatusSelector";
import DatePicker from "@/components/molecules/DatePicker";

const NoteEditor = ({ isOpen, onClose, note, onUpdate, folders = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
    folderId: "",
  });
  
useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || "",
        content: note.content || "",
        description: note.description || "",
        priority: note.priority || "medium",
        status: note.status || "todo",
        dueDate: note.dueDate || "",
        folderId: note.folderId || "",
      });
    }
  }, [note]);
  
const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    
    const updatedNote = {
      ...note,
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    
    onUpdate(updatedNote);
    onClose();
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
const isEditing = !!note;
  
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
            className="bg-white rounded-16 p-6 w-full max-w-2xl shadow-xl relative max-h-[90vh] overflow-y-auto"
          >
<div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Edit Note" : "Create Note"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Title" required>
                <Input
                  placeholder="Enter note title..."
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </FormField>
<FormField label="Description" required>
                <Textarea
                  placeholder="Enter note description..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </FormField>
              
              <FormField label="Content">
                <Textarea
                  placeholder="Start writing your note..."
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  rows={8}
                  className="content-editor"
                />
              </FormField>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Priority">
                  <PrioritySelector
                    value={formData.priority}
                    onChange={(value) => handleChange("priority", value)}
                  />
                </FormField>
                
                <FormField label="Status">
                  <StatusSelector
                    value={formData.status}
                    onChange={(value) => handleChange("status", value)}
                  />
                </FormField>
              </div>
              
              <FormField label="Due Date">
                <DatePicker
                  value={formData.dueDate}
                  onChange={(value) => handleChange("dueDate", value)}
                />
              </FormField>
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
              
              <div className="flex space-x-3 pt-6">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
<Button type="submit" className="flex-1">
                  {isEditing ? "Update Note" : "Create Note"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NoteEditor;