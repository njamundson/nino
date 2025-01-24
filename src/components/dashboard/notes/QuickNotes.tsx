import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: number;
  text: string;
  completed: boolean;
}

const QuickNotes = () => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
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
      id: Date.now(),
      text: newNote,
      completed: false
    };
    
    setNotes([...notes, note]);
    setNewNote('');
    
    toast({
      description: "Note added successfully",
    });
  };

  const toggleNote = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      description: "Note deleted successfully",
    });
  };

  return (
    <Card className="bg-white border border-gray-100/50 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-nino-text">Quick Notes</h3>
          <button 
            className="p-2 hover:bg-nino-bg rounded-full transition-colors"
            onClick={() => {
              setNewNote('');
              document.querySelector<HTMLInputElement>('input[placeholder="Add a note..."]')?.focus();
            }}
          >
            <Plus className="w-5 h-5 text-nino-primary" />
          </button>
        </div>
        
        <form onSubmit={handleAddNote} className="mb-6">
          <input
            type="text"
            placeholder="Add a note..."
            className="w-full px-4 py-3 rounded-2xl bg-nino-bg border-0 text-nino-text placeholder:text-nino-gray/60 focus:ring-2 focus:ring-nino-primary/20 focus:outline-none"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
        </form>

        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-nino-bg/50 hover:bg-nino-bg transition-colors group"
            >
              <button
                onClick={() => toggleNote(note.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                  ${note.completed 
                    ? 'bg-nino-primary border-nino-primary text-white' 
                    : 'border-nino-gray/30 group-hover:border-nino-primary'
                  }`}
              >
                {note.completed && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <span className={`flex-1 text-sm ${note.completed ? 'text-nino-gray line-through' : 'text-nino-text'}`}>
                {note.text}
              </span>
              <button
                onClick={() => deleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-nino-primary/10 rounded-full"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-nino-primary">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-nino-gray">No notes yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickNotes;