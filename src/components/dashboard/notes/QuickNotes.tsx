import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { StickyNote, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

const QuickNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedNotes = localStorage.getItem('creator-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('creator-notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note = {
      id: crypto.randomUUID(),
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
    };

    setNotes(prev => [note, ...prev]);
    setNewNote("");
    
    toast({
      title: "Note added",
      description: "Your note has been saved successfully.",
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Your note has been removed.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="bg-white border border-gray-100/50 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-nino-primary/5 p-2">
                <StickyNote className="h-5 w-5 text-nino-primary" />
              </div>
              <h3 className="text-xl font-semibold text-nino-text">Quick Notes</h3>
            </div>
          </div>

          <form onSubmit={handleAddNote} className="flex gap-2 mb-6">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              className="h-12 bg-gray-50/50 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20"
            />
            <Button 
              type="submit" 
              size="icon"
              className="h-12 w-12 rounded-xl bg-nino-primary hover:bg-nino-primary/90"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </form>

          <ScrollArea className="h-[240px] pr-4">
            <AnimatePresence mode="popLayout">
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="group p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-nino-text pr-6">{note.content}</p>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
                        >
                          <X className="h-4 w-4 text-nino-gray" />
                        </button>
                      </div>
                      <p className="text-xs text-nino-gray mt-2">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <StickyNote className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-nino-gray">No notes yet</p>
                  <p className="text-sm text-nino-gray/70 mt-1">
                    Add your first note above
                  </p>
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickNotes;