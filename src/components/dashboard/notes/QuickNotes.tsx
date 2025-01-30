import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Note {
  id: string;
  text: string;
  completed: boolean;
  brand_id: string;
}

const QuickNotes = () => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [brandId, setBrandId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch brand ID for the current user
  useEffect(() => {
    const fetchBrandId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: brandData } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        if (brandData) {
          setBrandId(brandData.id);
        }
      }
    };
    fetchBrandId();
  }, []);

  // Fetch notes when brandId is available
  useEffect(() => {
    if (brandId) {
      const fetchNotes = async () => {
        const { data, error } = await supabase
          .from('brand_notes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notes:', error);
          toast({
            description: "Failed to load notes",
            variant: "destructive",
          });
        } else if (data) {
          setNotes(data);
        }
      };

      fetchNotes();

      // Set up real-time subscription
      const subscription = supabase
        .channel('brand_notes_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'brand_notes' 
          }, 
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setNotes(current => [payload.new as Note, ...current]);
            } else if (payload.eventType === 'DELETE') {
              setNotes(current => current.filter(note => note.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
              setNotes(current => 
                current.map(note => 
                  note.id === payload.new.id ? payload.new as Note : note
                )
              );
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [brandId, toast]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !brandId) return;
    
    const { data, error } = await supabase
      .from('brand_notes')
      .insert([
        {
          brand_id: brandId,
          text: newNote.trim(),
          completed: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding note:', error);
      toast({
        description: "Failed to add note",
        variant: "destructive",
      });
    } else if (data) {
      setNewNote('');
      toast({
        description: "Note added successfully",
      });
    }
  };

  const toggleNote = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('brand_notes')
      .update({ completed: !completed })
      .eq('id', id);

    if (error) {
      console.error('Error toggling note:', error);
      toast({
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from('brand_notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      toast({
        description: "Failed to delete note",
        variant: "destructive",
      });
    } else {
      toast({
        description: "Note deleted successfully",
      });
    }
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
                onClick={() => toggleNote(note.id, note.completed)}
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