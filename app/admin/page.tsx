"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  UploadCloud, 
  Activity, 
  Inbox, 
  Grid, 
  Image as ImageIcon, 
  Music,
  LogOut,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter(); // Explicitly defined within component
  const [activeTab, setActiveTab] = useState("inventory");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showBeatForm, setShowBeatForm] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Data State
  const [beats, setBeats] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Form State
  const [newCategory, setNewCategory] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [beatsRes, categoriesRes, projectsRes, inquiriesRes] = await Promise.all([
        supabase.from('beats').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      ]);

      if (beatsRes.data) setBeats(beatsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (inquiriesRes.data) setInquiries(inquiriesRes.data);
    } catch (err) {
        console.error("Data fetch protocol failure:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin/login");
            } else {
                setUser(session.user);
                fetchData();
            }
        } catch (err) {
            console.error("Auth check protocol error:", err);
            router.push("/admin/login");
        }
    }
    checkAuth();
  }, [router, fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm(`CONFIRM_DELETION: Permanent removal of ${table} entry?`)) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchData();
    else alert(`Error deleting ${table}: ${error.message}`);
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    const slug = newCategory.toLowerCase().replace(/\s+/g, '-');
    const { error } = await supabase.from('categories').insert([{ name: newCategory, slug }]);
    if (!error) {
      setNewCategory("");
      fetchData();
    } else {
      alert(`Error adding category: ${error.message}`);
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.secure_url;
  };

  const stats = [
    { label: "TOTAL_BEATS", value: beats.length.toString().padStart(2, '0'), trend: "SYNCED" },
    { label: "INQUIRIES", value: inquiries.length.toString().padStart(2, '0'), trend: inquiries.length > 0 ? "URGENT" : "NONE" },
    { label: "PROJECTS", value: projects.length.toString().padStart(2, '0'), trend: "ARCHIVED" },
    { label: "SYS_STATUS", value: "ONLINE", trend: "0ms_LATENCY" },
  ];

  return (
    <>
      <main className="min-h-screen pt-8 pb-32 px-4 md:px-12 lg:px-24 bg-zinc-950 text-zinc-50 font-['Space_Grotesk']">
        {/* Admin Header */}
        <header className="mb-12 border-b-4 border-zinc-50 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-2">ACCESS_LEVEL: SUPER_USER // {user?.email}</p>
            <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter italic">ADMIN_TERMINAL</h1>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={() => router.push('/')}
                className="border border-zinc-700 px-6 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-zinc-50 hover:text-zinc-950 transition-all flex items-center gap-2"
            >
                <ExternalLink size={12} />
                VIEW_CLIENT_FRONT
            </button>
            <button 
                onClick={handleLogout}
                className="bg-red-900/20 text-red-500 border border-red-900/50 px-6 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
            >
                <LogOut size={12} />
                TERMINATE_SESSION
            </button>
          </div>
        </header>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 border-2 border-zinc-800 mb-16 shadow-2xl">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-zinc-950 p-6 flex flex-col gap-2 relative overflow-hidden group">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest z-10">{stat.label}</span>
              <span className="font-headline text-3xl font-black z-10">{stat.value}</span>
              <span className={`font-mono text-[8px] uppercase tracking-tighter z-10 ${stat.trend === 'URGENT' ? 'text-primary' : 'text-green-500'}`}>{stat.trend}</span>
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 group-hover:opacity-10 transition-opacity">
                  <Activity size={80} />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {[
              { id: "inventory", icon: Music, label: "INVENTORY" },
              { id: "projects", icon: ImageIcon, label: "PROJECTS" },
              { id: "categories", icon: Grid, label: "CATEGORIES" },
              { id: "inquiries", icon: Inbox, label: "INQUIRIES" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 font-mono text-[10px] uppercase tracking-[0.4em] transition-all border-b-2 flex items-center gap-2 ${
                activeTab === tab.id ? "border-zinc-50 text-zinc-50" : "border-transparent text-zinc-600 hover:text-zinc-300"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <section className="min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-900 bg-zinc-900/10 transition-all">
                <RefreshCw className="animate-spin text-zinc-700 mb-4" size={24} />
                <p className="font-mono text-xs uppercase tracking-[0.5em] text-zinc-700">Synchronizing_With_Supabase...</p>
             </div>
          ) : (
            <>
              {activeTab === "inventory" && (
                <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex justify-between items-center">
                    <h2 className="font-headline text-3xl font-black uppercase italic">BEAT_ARCHIVE</h2>
                    <button 
                        onClick={() => setShowBeatForm(!showBeatForm)}
                        className={`px-8 py-3 font-headline font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${
                            showBeatForm ? "bg-zinc-800 text-zinc-500 hover:text-white" : "bg-zinc-50 text-zinc-950 hover:invert"
                        }`}
                    >
                        {showBeatForm ? <Plus className="rotate-45 transition-transform" /> : <Plus />}
                        {showBeatForm ? "CANCEL_UPLOAD" : "UPLOAD_NEW_BEAT"}
                    </button>
                  </div>

                  {showBeatForm && (
                      <div className="bg-zinc-900/50 border border-zinc-800 p-8 animate-[fadeIn_0.3s_ease-out]">
                         <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">INITIALIZE_NEW_SIGNAL_ASSET</p>
                         <form onSubmit={async (e) => {
                             e.preventDefault();
                             const form = e.target as HTMLFormElement;
                             const audioFile = (form.querySelector('input[name="audio"]') as HTMLInputElement).files?.[0];
                             const artFile = (form.querySelector('input[name="art"]') as HTMLInputElement).files?.[0];
                             const title = (form.querySelector('input[name="title"]') as HTMLInputElement).value;
                             const genre = (form.querySelector('input[name="genre"]') as HTMLInputElement).value;
                             const bpm = (form.querySelector('input[name="bpm"]') as HTMLInputElement).value;
                             const tags = (form.querySelector('input[name="tags"]') as HTMLInputElement).value;
                             const isFeatured = (form.querySelector('input[name="is_featured"]') as HTMLInputElement).checked;

                             if (!audioFile) return alert("AUDIO_REQUIRED: No signal source identified.");

                             setUploading(true);
                             try {
                                const audioUrl = await uploadFile(audioFile, 'beats/audio');
                                let artUrl = null;
                                if (artFile) {
                                    artUrl = await uploadFile(artFile, 'beats/art');
                                }

                                const { error } = await supabase.from('beats').insert([{
                                    title,
                                    genre,
                                    bpm: parseInt(bpm),
                                    audio_url: audioUrl,
                                    art_url: artUrl,
                                    is_featured: isFeatured,
                                    tags: tags.split(',').map(t => t.trim()).filter(t => t)
                                }]);

                                if (error) throw error;
                                
                                form.reset();
                                setShowBeatForm(false);
                                fetchData();
                             } catch (err: any) {
                                 alert(`UPLOAD_PROTOCOL_ERROR: ${err.message}`);
                             } finally {
                                 setUploading(false);
                             }
                         }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2 lg:col-span-2">
                                <label className="font-mono text-[9px] text-zinc-500 uppercase">Track_Title</label>
                                <input name="title" required placeholder="SIGNAL_IDENTIFIER" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs uppercase focus:border-zinc-50 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-[9px] text-zinc-500 uppercase">Tempo (BPM)</label>
                                <input name="bpm" required type="number" defaultValue="140" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs uppercase focus:border-zinc-50 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-[9px] text-zinc-500 uppercase">Style_Genre</label>
                                <select name="genre" required className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs uppercase focus:border-zinc-50 outline-none appearance-none">
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                    {categories.length === 0 && <option value="DEFAULT">NO_CATEGORIES_DEFINED</option>}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-[9px] text-zinc-500 uppercase">Meta_Tags (Comma Separated)</label>
                                <input name="tags" placeholder="DARK, HARD, 808" className="w-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs uppercase focus:border-zinc-50 outline-none" />
                            </div>
                            <div className="space-y-4 flex flex-col justify-end">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" name="is_featured" className="w-4 h-4 bg-zinc-950 border-zinc-800 checked:bg-zinc-50" />
                                    <span className="font-mono text-[10px] text-zinc-500 uppercase group-hover:text-zinc-50 transition-colors">FEATURE_IN_MAIN_PORTFOLIO</span>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="font-mono text-[9px] text-zinc-500 uppercase">Audio_Source (.MP3 / .WAV)</label>
                                <div className="relative group">
                                    <input type="file" name="audio" required accept="audio/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <div className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] flex items-center justify-between group-hover:border-zinc-50 transition-colors">
                                        <span className="text-zinc-600">UPLOAD_SIGNAL</span>
                                        <Music size={14} className="text-zinc-600 group-hover:text-zinc-50" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-[9px] text-zinc-500 uppercase">Visual_Asset (Cover Art)</label>
                                <div className="relative group">
                                    <input type="file" name="art" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <div className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] flex items-center justify-between group-hover:border-zinc-50 transition-colors">
                                        <span className="text-zinc-600">UPLOAD_ART</span>
                                        <ImageIcon size={14} className="text-zinc-600 group-hover:text-zinc-50" />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1 pt-6">
                                <button 
                                    disabled={uploading}
                                    className="w-full h-14 bg-zinc-50 text-zinc-950 font-black uppercase text-xs tracking-widest hover:invert transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {uploading ? (
                                        <>
                                            <RefreshCw className="animate-spin" size={16} />
                                            STREAMING_ASSETS...
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud size={16} />
                                            INITIALIZE_BEAT
                                        </>
                                    )}
                                </button>
                            </div>
                         </form>
                      </div>
                  )}

                  <div className="border border-zinc-800 overflow-x-auto">
                    <table className="w-full text-left font-mono text-[10px] md:text-sm whitespace-nowrap">
                      <thead>
                        <tr className="bg-zinc-900 border-b border-zinc-800">
                          <th className="p-4 uppercase tracking-widest text-zinc-500">BEAT_TITLE</th>
                          <th className="p-4 uppercase tracking-widest text-zinc-500">GENRE</th>
                          <th className="p-4 uppercase tracking-widest text-zinc-500 text-right">OPERATIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {beats.map((beat) => (
                          <tr key={beat.id} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                            <td className="p-4 font-bold flex items-center gap-3">
                                {beat.title}
                                {beat.is_featured && (
                                    <span className="bg-primary/20 text-primary text-[7px] font-black px-1.5 py-0.5 border border-primary/30 uppercase tracking-widest">DEMO</span>
                                )}
                            </td>
                            <td className="p-4">
                                <span className="bg-zinc-900 px-2 py-1 border border-zinc-800 text-[9px] uppercase">{beat.genre}</span>
                            </td>
                            <td className="p-4 text-right">
                              <button onClick={() => handleDelete('beats', beat.id)} className="text-zinc-500 hover:text-red-500 transition-colors">
                                  <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                   <div className="flex justify-between items-center">
                    <h2 className="font-headline text-3xl font-black uppercase italic">PORTFOLIO_ARCHIVE</h2>
                  </div>
                  
                  {/* Add Project Form */}
                  <div className="bg-zinc-900/50 border border-zinc-800 p-8">
                     <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6">ADD_NEW_PROJECT_FILE</p>
                     <form onSubmit={async (e) => {
                         e.preventDefault();
                         const form = e.target as HTMLFormElement;
                         const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
                         const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement;
                         const categoryInput = form.querySelector('input[name="category"]') as HTMLInputElement;
                         
                         if (!fileInput.files?.[0]) return alert("IMAGE_REQUIRED: Select a visual asset.");
                         
                         setUploading(true);
                         try {
                            const imageUrl = await uploadFile(fileInput.files[0], 'projects');
                            const { error } = await supabase.from('projects').insert([{
                                title: titleInput.value.toUpperCase(),
                                category: categoryInput.value.toUpperCase(),
                                image_url: imageUrl,
                                date: `${form.querySelector<HTMLInputElement>('input[name="year"]')?.value || '2024'}-01-01`
                            }]);
                            if (error) throw error;
                            form.reset();
                            fetchData();
                         } catch (err: any) {
                             alert(`PROTOCOL_FAILURE: ${err.message}`);
                         } finally {
                             setUploading(false);
                         }
                     }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <input name="title" required placeholder="PROJECT_TITLE" className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs uppercase focus:border-zinc-50 outline-none" />
                        <input name="category" required placeholder="GENRE/ROLE (e.g. PROD)" className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs uppercase focus:border-zinc-50 outline-none" />
                        <input name="year" required type="number" defaultValue={new Date().getFullYear()} className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs uppercase focus:border-zinc-50 outline-none" />
                        <div className="relative">
                            <input type="file" required accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div className="h-full bg-zinc-950 border border-zinc-800 p-4 font-mono text-[10px] flex items-center gap-2 text-zinc-500">
                                <UploadCloud size={14} />
                                SELECT_COVER_ART
                            </div>
                        </div>
                        <button disabled={uploading} className="bg-zinc-50 text-zinc-950 font-black uppercase text-xs tracking-widest hover:invert transition-all disabled:opacity-50">
                            {uploading ? "WAIT..." : "INITIALIZE"}
                        </button>
                     </form>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-zinc-900 group relative border border-zinc-800 overflow-hidden">
                            <img src={project.image_url} alt={project.title} className="w-full aspect-video object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                            <div className="p-4 flex justify-between items-center bg-zinc-900 relative z-10">
                                <div className="truncate">
                                    <h4 className="font-bold uppercase text-[10px] truncate">{project.title}</h4>
                                    <span className="text-[8px] text-zinc-500 uppercase tracking-tighter">{project.category}</span>
                                </div>
                                <button onClick={() => handleDelete('projects', project.id)} className="text-zinc-600 hover:text-red-500 transition-colors shrink-0">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "categories" && (
                <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
                    <div className="flex justify-between items-center">
                        <h2 className="font-headline text-3xl font-black uppercase italic">SIGNAL_CATEGORIES</h2>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 max-w-2xl">
                        <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6 underline decoration-zinc-800 underline-offset-8">ADD_NEW_CATEGORY_PROTOCOL</p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input 
                                type="text" 
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="CATEGORY_NAME (e.g. PHONK)" 
                                className="flex-1 bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs focus:border-zinc-50 outline-none transition-colors uppercase" 
                            />
                            <button onClick={handleAddCategory} className="bg-zinc-50 text-zinc-950 px-8 py-4 font-headline font-black text-xs uppercase tracking-widest hover:invert transition-all">INITIALIZE_CATEGORY</button>
                        </div>
                    </div>

                    <div className="border border-zinc-800 max-w-4xl">
                        <table className="w-full text-left font-mono text-[10px] md:text-sm">
                            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500">
                                <tr>
                                    <th className="p-4 uppercase tracking-tighter">CATEGORY_IDENTIFIER</th>
                                    <th className="p-4 uppercase tracking-tighter text-right">MODIFICATION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="border-b border-zinc-900 group">
                                        <td className="p-4 font-bold md:text-lg uppercase">{cat.name}</td>
                                        <td className="p-4 text-right opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDelete('categories', cat.id)} className="text-zinc-500 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
              )}

              {activeTab === "inquiries" && (
                <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                   <h2 className="font-headline text-3xl font-black uppercase italic">CLIENT_TRANSMISSIONS</h2>
                   {inquiries.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {inquiries.map((iq) => (
                               <div key={iq.id} className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-4 group hover:border-zinc-50 transition-all">
                                   <div className="flex justify-between items-start">
                                       <div>
                                           <h4 className="font-bold uppercase text-lg group-hover:text-primary transition-colors">{iq.client_name}</h4>
                                           <p className="font-mono text-[10px] text-zinc-600">{iq.client_email}</p>
                                       </div>
                                       <span className="bg-zinc-800 text-zinc-500 text-[8px] px-2 py-1 uppercase font-bold">{iq.status || "NEW"}</span>
                                   </div>
                                   <p className="text-xs text-zinc-400 italic leading-relaxed border-l-2 border-zinc-800 pl-4">"{iq.message}"</p>
                                   <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-zinc-700">
                                       <span className="font-mono text-[9px] uppercase tracking-widest">{new Date(iq.created_at).toLocaleDateString()} // GMT</span>
                                       <button onClick={() => handleDelete('inquiries', iq.id)} className="hover:text-red-500 transition-colors">
                                           <Trash2 size={14} />
                                       </button>
                                   </div>
                               </div>
                           ))}
                       </div>
                   ) : (
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-900">
                        <AlertTriangle size={32} className="text-zinc-800 mb-4" />
                        <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest">No_Active_Transmission_Protocols</p>
                    </div>
                   )}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
