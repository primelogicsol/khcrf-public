"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaHistory, FaPen, FaArrowUp, FaArrowDown, FaMagic, FaSpinner, FaSave } from 'react-icons/fa';

export default function TocWorkspace({ params }: { params: any }) {
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');
  
  // Edit & Add State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [addingNew, setAddingNew] = useState(false);

  // Status flags
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.resolve(params).then((p: any) => {
      setId(p.id);
      loadTOC(p.id);
    });
  }, [params]);

  const loadTOC = async (pubId: string) => {
    try {
      const res = await api.get(`/publications/${pubId}/chapters`);
      setChapters([...res.data].sort((a: any, b: any) => a.order - b.order));
    } catch (err) {
      toast.error("Failed to load TOC");
    } finally {
      setLoading(false);
    }
  };

  const moveChapter = async (idx: number, dir: number) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= chapters.length) return;
    
    // Optimistic UI Reorder
    const originalChapters = [...chapters];
    const newChapters = [...chapters];
    
    // Swap orders
    const tempOrder = newChapters[idx].order;
    newChapters[idx].order = newChapters[targetIdx].order;
    newChapters[targetIdx].order = tempOrder;
    
    newChapters.sort((a, b) => a.order - b.order);
    setChapters(newChapters);
    
    try {
      setSaving(true);
      await api.patch(`/publications/${id}/chapters/reorder`, {
        chapters: newChapters.map(c => ({ id: c.id, order: c.order }))
      });
      toast.success("Chapters reordered successfully");
    } catch (err: any) {
      setChapters(originalChapters); // Rollback
      toast.error(err.response?.data?.message || "Failed to reorder chapters");
    } finally {
      setSaving(false);
    }
  };

  const approveAll = async () => {
    if (chapters.length === 0) {
      return toast.error("No chapters to approve");
    }
    
    try {
      setSaving(true);
      await api.post(`/publications/${id}/toc/approve`);
      toast.success("TOC approved successfully");
      loadTOC(id); // Reload to reflect status
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve TOC");
    } finally {
      setSaving(false);
    }
  };

  const saveChapter = async (chapterId?: string) => {
    if (!editTitle.trim()) return toast.error("Title cannot be blank");
    
    try {
      setSaving(true);
      if (chapterId) {
        // Edit
        await api.put(`/chapters/${chapterId}`, { title: editTitle });
        toast.success("Chapter updated");
      } else {
        // Create
        const maxOrder = chapters.length > 0 ? Math.max(...chapters.map(c => c.order)) : 0;
        await api.post(`/chapters`, {
          title: editTitle,
          order: maxOrder + 1,
          status: 'DRAFT',
          publicationId: id
        });
        toast.success("Chapter created");
      }
      setEditingId(null);
      setAddingNew(false);
      setEditTitle('');
      loadTOC(id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteChapter = async (chapterId: string) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    
    try {
      setSaving(true);
      const res = await api.delete(`/chapters/${chapterId}`);
      toast.success(res.data?.message || "Chapter removed");
      loadTOC(id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete chapter");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><FaSpinner className="animate-spin text-teal-600 text-2xl" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      {saving && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-teal-600 font-bold text-xs bg-white px-3 py-1 rounded shadow-sm border border-teal-100">
          <FaSpinner className="animate-spin" /> Saving...
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-gray-900">Table of Contents Engine</h2>
          <p className="text-xs text-gray-500 mt-1">Manage the architectural structure of your publication before manuscript drafting.</p>
        </div>
        <div className="flex items-center gap-3">
          <button disabled className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-lg text-[10px] font-bold text-stone-400 cursor-not-allowed">
            <FaMagic size={10} /> Bulk Generate (Deferred)
          </button>
          <button disabled className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-lg text-[10px] font-bold text-stone-400 cursor-not-allowed">
            <FaHistory size={10} /> Compare Versions (Unavailable)
          </button>
          <button onClick={approveAll} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-teal-600 rounded-lg text-[10px] font-bold text-white hover:bg-teal-700 disabled:opacity-50">
            <FaCheck size={10} /> Approve TOC
          </button>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 bg-stone-50 border-b border-stone-200 px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
          <div className="col-span-1 text-center">Order</div>
          <div className="col-span-6">Chapter Title</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-stone-100">
          {chapters.map((ch, idx) => (
            <div key={ch.id} className="grid grid-cols-12 px-4 py-4 items-center hover:bg-stone-50/50 transition-colors group">
              <div className="col-span-1 flex flex-col items-center gap-1">
                <button onClick={() => moveChapter(idx, -1)} disabled={idx === 0 || saving} className="text-stone-300 hover:text-teal-600 disabled:opacity-30"><FaArrowUp size={10}/></button>
                <span className="text-xs font-black text-gray-400">{ch.order}</span>
                <button onClick={() => moveChapter(idx, 1)} disabled={idx === chapters.length - 1 || saving} className="text-stone-300 hover:text-teal-600 disabled:opacity-30"><FaArrowDown size={10}/></button>
              </div>
              
              <div className="col-span-6 pr-4">
                {editingId === ch.id ? (
                  <input 
                    autoFocus
                    type="text" 
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full text-sm font-bold text-gray-900 border-b-2 border-teal-500 focus:outline-none bg-transparent"
                    onKeyDown={e => e.key === 'Enter' && saveChapter(ch.id)}
                  />
                ) : (
                  <p className="text-sm font-bold text-gray-900">{ch.title}</p>
                )}
              </div>
              
              <div className="col-span-2 flex justify-center">
                <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
                  ch.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  ch.status === 'REVIEW' || ch.status === 'EDITOR_REVIEW' ? 'bg-amber-100 text-amber-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {ch.status || 'DRAFT'}
                </span>
              </div>
              
              <div className="col-span-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId === ch.id ? (
                  <>
                    <button onClick={() => saveChapter(ch.id)} disabled={saving} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded bg-white border border-stone-200"><FaSave size={10}/></button>
                    <button onClick={() => setEditingId(null)} disabled={saving} className="p-1.5 text-stone-400 hover:bg-stone-50 rounded bg-white border border-stone-200"><FaTimes size={10}/></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditingId(ch.id); setEditTitle(ch.title); }} className="p-1.5 text-stone-400 hover:text-teal-600 rounded bg-white border border-stone-200" title="Edit Chapter"><FaPen size={10}/></button>
                    <button onClick={() => deleteChapter(ch.id)} disabled={saving} className="p-1.5 text-stone-400 hover:text-red-600 rounded bg-white border border-stone-200" title="Delete"><FaTrash size={10}/></button>
                  </>
                )}
              </div>
            </div>
          ))}

          {addingNew && (
            <div className="grid grid-cols-12 px-4 py-4 items-center bg-teal-50/30">
              <div className="col-span-1 flex justify-center">
                <span className="text-xs font-black text-teal-400">New</span>
              </div>
              <div className="col-span-8 pr-4">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Enter chapter title..."
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full text-sm font-bold text-gray-900 border-b-2 border-teal-500 focus:outline-none bg-transparent"
                  onKeyDown={e => e.key === 'Enter' && saveChapter()}
                />
              </div>
              <div className="col-span-3 flex justify-end gap-2">
                <button onClick={() => saveChapter()} disabled={saving} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded bg-white border border-teal-200"><FaSave size={10}/></button>
                <button onClick={() => { setAddingNew(false); setEditTitle(''); }} disabled={saving} className="p-1.5 text-stone-400 hover:bg-stone-50 rounded bg-white border border-stone-200"><FaTimes size={10}/></button>
              </div>
            </div>
          )}

          {chapters.length === 0 && !addingNew && (
            <div className="p-12 text-center text-gray-400 text-sm">
              No chapters found. Add your first chapter below.
            </div>
          )}
        </div>
        
        {!addingNew && (
          <div className="bg-stone-50 border-t border-stone-200 px-4 py-3 flex justify-center">
            <button onClick={() => { setAddingNew(true); setEditTitle(''); }} className="flex items-center gap-2 text-[11px] font-bold text-teal-600 hover:text-teal-800">
              <FaPlus size={10} /> Add Chapter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
