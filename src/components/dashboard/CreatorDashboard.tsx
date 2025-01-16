import { motion } from "framer-motion";
import { Bell, Calendar, FileText, MessageSquare, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CreatorDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['creator-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Fetch active projects, upcoming shoots, and new proposals
      // For now returning placeholder data
      return {
        activeProjects: 0,
        upcomingShoots: 0,
        newProposals: 0
      };
    },
  });

  const { data: messages } = useQuery({
    queryKey: ['recent-messages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('messages')
        .select('*, sender:sender_id(*)')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      return data;
    },
  });

  return (
    <div className="min-h-screen bg-[#FAF9F9]">
      {/* Navbar */}
      <nav className="border-b bg-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-medium text-gray-900">Welcome Back!</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#B4736E] text-white flex items-center justify-center text-sm">
            CR
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-4">
              <Users className="text-[#B4736E]" />
              <div>
                <p className="text-gray-600">Active Projects</p>
                <h3 className="text-2xl font-semibold">{stats?.activeProjects || 0}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-4">
              <Calendar className="text-[#B4736E]" />
              <div>
                <p className="text-gray-600">Upcoming Shoots</p>
                <h3 className="text-2xl font-semibold">{stats?.upcomingShoots || 0}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-4">
              <FileText className="text-[#B4736E]" />
              <div>
                <p className="text-gray-600">New Proposals</p>
                <h3 className="text-2xl font-semibold">{stats?.newProposals || 0}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Messages and Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Messages */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Recent Messages</h2>
                <span className="text-sm text-[#B4736E] font-medium">2 New</span>
              </div>
              <div className="space-y-4">
                {messages?.map((message) => (
                  <div key={message.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">Luxury Brand Co.</h3>
                        <span className="text-sm text-gray-500">2h ago</span>
                      </div>
                      <p className="text-gray-600 text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Notes */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Quick Notes</h2>
                <button className="text-[#B4736E]">+</button>
              </div>
              <input
                type="text"
                placeholder="Add a note..."
                className="w-full p-3 bg-gray-50 rounded-lg mb-4 text-sm"
              />
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Meeting with Luxury Brand at 3 PM</span>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Prepare portfolio for Fashion Week</span>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-sm text-gray-700">Review contract terms</span>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked disabled />
                  <span className="text-sm text-gray-400 line-through">Submit proposal for summer campaign</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorDashboard;