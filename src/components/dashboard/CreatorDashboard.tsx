import React, { useState } from 'react';
import { Bell, Briefcase, FilePlus, Plus, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Sidebar from './Sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CreatorDashboard = () => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState([
    { id: 1, text: "Meeting with Luxury Brand at 3 PM", completed: false },
    { id: 2, text: "Prepare portfolio for Fashion Week", completed: false },
    { id: 3, text: "Review contract terms", completed: false },
    { id: 4, text: "Submit proposal for summer campaign", completed: true },
  ]);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return data;
    }
  });

  const { data: recentMessages } = useQuery({
    queryKey: ['recent-messages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(
            first_name,
            last_name
          ),
          receiver:receiver_id(
            first_name,
            last_name
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(3);
      
      return data || [];
    }
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    setNotes([
      ...notes,
      { id: Date.now(), text: newNote, completed: false }
    ]);
    setNewNote('');
  };

  const toggleNote = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="flex h-screen bg-nino-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-end items-center space-x-4 mb-8">
          <button className="p-2 hover:bg-nino-white rounded-full transition-colors">
            <Bell className="w-6 h-6 text-nino-gray hover:text-nino-primary transition-colors" />
          </button>
          <Avatar className="w-10 h-10 ring-2 ring-nino-primary/20">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback className="bg-nino-primary text-nino-white">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-nino-primary" />
                </div>
                <div>
                  <h3 className="text-lg text-nino-gray font-medium mb-1">
                    Active Projects
                  </h3>
                  <p className="text-4xl font-semibold text-nino-text">
                    0
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
                  <FilePlus className="w-6 h-6 text-nino-primary" />
                </div>
                <div>
                  <h3 className="text-lg text-nino-gray font-medium mb-1">
                    New Proposals
                  </h3>
                  <p className="text-4xl font-semibold text-nino-text">
                    0
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-nino-text">Quick Notes</h3>
                  <button className="p-2 hover:bg-nino-bg rounded-full transition-colors">
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
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-nino-text">Recent Messages</h3>
                  <button className="p-2 hover:bg-nino-bg rounded-full transition-colors">
                    <MessageSquare className="w-5 h-5 text-nino-primary" />
                  </button>
                </div>

                <div className="space-y-4">
                  {recentMessages?.map((message: any) => (
                    <div key={message.id} className="flex items-start gap-3 p-3 rounded-2xl bg-nino-bg/50">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-nino-primary/10 text-nino-primary text-xs">
                          {message.sender?.first_name?.[0]}{message.sender?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-nino-text truncate">
                          {message.sender?.first_name} {message.sender?.last_name}
                        </p>
                        <p className="text-sm text-nino-gray line-clamp-2">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {(!recentMessages || recentMessages.length === 0) && (
                    <div className="text-center py-4">
                      <p className="text-sm text-nino-gray">No messages yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;