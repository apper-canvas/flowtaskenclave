import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ItemGrid from "@/components/organisms/ItemGrid";
import NoteEditor from "@/components/organisms/NoteEditor";
import { noteService } from "@/services/api/noteService";

const NotesPage = ({ folders = [], onQuickAdd }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  
  useEffect(() => {
    loadNotes();
  }, []);
  
  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const notesData = await noteService.getAll();
      setNotes(notesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
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
  
  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setShowNoteEditor(true);
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
        <Loading variant="grid" />
      </div>
    );
  }
  
  if (error) {
    return <Error message={error} onRetry={loadNotes} />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-600 mt-1">
            Capture and organize your thoughts
          </p>
        </div>
        <Button onClick={onQuickAdd} icon="Plus" className="shadow-fab">
          Add Note
        </Button>
      </div>
      
      {/* Notes Grid */}
      <ItemGrid
        items={notes}
        folders={folders}
        onNoteDelete={handleNoteDelete}
        onNoteClick={handleNoteClick}
        emptyIcon="FileText"
        emptyTitle="No notes found"
        emptyDescription="Create your first note to start capturing your ideas."
        onQuickAdd={onQuickAdd}
      />
      
      {/* Note Editor */}
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

export default NotesPage;