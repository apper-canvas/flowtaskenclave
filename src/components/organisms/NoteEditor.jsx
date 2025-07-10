import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const NoteEditor = ({ isOpen, onClose, note, onUpdate, folders = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    folderId: "",
  });
  
  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || "",
        content: note.content || "",
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
  
  if (!note) return null;
  
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
              <h2 className="text-xl font-semibold text-gray-900">Edit Note</h2>
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
              
              <FormField label="Content">
                <Textarea
                  placeholder="Start writing your note..."
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  rows={12}
                  className="content-editor"
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
                  Update Note
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