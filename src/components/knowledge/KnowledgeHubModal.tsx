import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  type TeamDocument, 
  type DocumentCategory 
} from '../../types';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Plus, 
  X, 
  Trash2, 
  Edit3, 
  Share2, 
  Printer, 
  Pin, 
  ExternalLink, 
  ChevronRight, 
  Check 
} from 'lucide-react';

interface KnowledgeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeHubModal: React.FC<KnowledgeHubModalProps> = ({ isOpen, onClose }) => {
  const { documents, isAdmin, addDocument, updateDocument, deleteDocument } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [activeDocument, setActiveDocument] = useState<TeamDocument | null>(null);

  // Document Editor State (Admin)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<TeamDocument | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<DocumentCategory>('handbook_policies');
  const [formDescription, setFormDescription] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formFileType, setFormFileType] = useState<'policy' | 'pdf' | 'doc' | 'sheet' | 'link'>('policy');
  const [formExternalUrl, setFormExternalUrl] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formTags, setFormTags] = useState('');

  const [copiedShare, setCopiedShare] = useState(false);

  // Filtered list
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query || 
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query) ||
        (doc.tags && doc.tags.some(t => t.toLowerCase().includes(query)));
      return matchCategory && matchQuery;
    });
  }, [documents, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setFormTitle('');
    setFormCategory('handbook_policies');
    setFormDescription('');
    setFormContent('');
    setFormFileType('policy');
    setFormExternalUrl('');
    setFormIsPinned(false);
    setFormTags('Policy, 2026-2027');
    setShowEditModal(true);
  };

  const handleOpenEdit = (doc: TeamDocument) => {
    setEditingDoc(doc);
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormDescription(doc.description);
    setFormContent(doc.content);
    setFormFileType(doc.fileType);
    setFormExternalUrl(doc.externalUrl || '');
    setFormIsPinned(Boolean(doc.isPinned));
    setFormTags(doc.tags ? doc.tags.join(', ') : '');
    setShowEditModal(true);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const tagsArray = formTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingDoc) {
      updateDocument(editingDoc.id, {
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        content: formContent.trim(),
        fileType: formFileType,
        externalUrl: formExternalUrl.trim() || undefined,
        isPinned: formIsPinned,
        tags: tagsArray
      });
      if (activeDocument?.id === editingDoc.id) {
        setActiveDocument(prev => prev ? {
          ...prev,
          title: formTitle.trim(),
          category: formCategory,
          description: formDescription.trim(),
          content: formContent.trim(),
          fileType: formFileType,
          externalUrl: formExternalUrl.trim() || undefined,
          isPinned: formIsPinned,
          tags: tagsArray
        } : null);
      }
    } else {
      const created = addDocument({
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        content: formContent.trim(),
        fileType: formFileType,
        externalUrl: formExternalUrl.trim() || undefined,
        isPinned: formIsPinned,
        tags: tagsArray
      });
      setActiveDocument(created);
    }

    setShowEditModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document from the Knowledge Hub?')) {
      deleteDocument(id);
      if (activeDocument?.id === id) {
        setActiveDocument(null);
      }
    }
  };

  const handleShareDoc = (doc: TeamDocument) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${doc.title}\n\n${doc.content}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getCategoryBadge = (cat: DocumentCategory) => {
    switch (cat) {
      case 'handbook_policies':
        return { label: 'Policies & Handbook', bg: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      case 'lettering_standards':
        return { label: 'Lettering & Times', bg: 'bg-amber-950 text-amber-300 border-amber-800' };
      case 'medical_safety':
        return { label: 'Medical & Safety', bg: 'bg-rose-950 text-rose-300 border-rose-800' };
      case 'parent_booster':
        return { label: 'Booster & Parents', bg: 'bg-teal-950 text-teal-300 border-teal-800' };
      default:
        return { label: 'General Info', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-3xl w-full h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#06241b] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center border border-amber-400/40 shadow-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Aqua Mustangs Knowledge Hub</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {documents.length} Docs
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                Official team policies, handbooks, lettering standards &amp; health guidelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleOpenAdd}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white text-xs font-bold shadow border border-amber-400/40 flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Document</span>
              </button>
            )}

            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-3 sm:p-4 bg-slate-950/90 border-b border-slate-800 space-y-2.5 flex-shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search policies, lettering cuts, concussion rules, pasta parties..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'all' 
                  ? 'bg-emerald-700 text-white shadow-sm border border-amber-400/40' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              All Docs ({documents.length})
            </button>

            <button
              onClick={() => setSelectedCategory('handbook_policies')}
              className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'handbook_policies' 
                  ? 'bg-emerald-700 text-white shadow-sm border border-amber-400/40' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              📋 Handbook &amp; Rules
            </button>

            <button
              onClick={() => setSelectedCategory('lettering_standards')}
              className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'lettering_standards' 
                  ? 'bg-emerald-700 text-white shadow-sm border border-amber-400/40' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              🏅 Lettering &amp; Cuts
            </button>

            <button
              onClick={() => setSelectedCategory('medical_safety')}
              className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'medical_safety' 
                  ? 'bg-emerald-700 text-white shadow-sm border border-amber-400/40' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              🩺 Safety &amp; Medical
            </button>

            <button
              onClick={() => setSelectedCategory('parent_booster')}
              className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
                selectedCategory === 'parent_booster' 
                  ? 'bg-emerald-700 text-white shadow-sm border border-amber-400/40' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              🤝 Booster &amp; Volunteers
            </button>
          </div>
        </div>

        {/* Content Body: List vs Active Reader */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Document List Pane */}
          <div className={`flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 ${activeDocument ? 'hidden md:block md:w-5/12 md:max-w-sm md:border-r md:border-slate-800' : 'w-full'}`}>
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-500 opacity-50" />
                <p className="text-xs font-semibold">No documents found matching your filter.</p>
              </div>
            ) : (
              filteredDocuments.map(doc => {
                const badge = getCategoryBadge(doc.category);
                const isSelected = activeDocument?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setActiveDocument(doc)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition ${
                      isSelected 
                        ? 'bg-emerald-950/70 border-amber-400/60 shadow-lg' 
                        : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 hover:border-emerald-700/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      {doc.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                      {doc.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {doc.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Updated: {doc.updatedAt}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        Read Policy <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Active Document Reader Pane */}
          {activeDocument ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/90 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Back button on mobile */}
                <button
                  onClick={() => setActiveDocument(null)}
                  className="md:hidden flex items-center gap-1 text-xs font-bold text-amber-300 mb-2"
                >
                  ← Back to Document List
                </button>

                {/* Top Document Metadata & Action Bar */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${getCategoryBadge(activeDocument.category).bg}`}>
                        {getCategoryBadge(activeDocument.category).label}
                      </span>
                      <span className="text-[11px] text-slate-400">By {activeDocument.author}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white">
                      {activeDocument.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activeDocument.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleShareDoc(activeDocument)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Copy / Share document text"
                    >
                      {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={handlePrint}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Print Document"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(activeDocument)}
                          className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-amber-400/40 transition"
                          title="Edit Document"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(activeDocument.id)}
                          className="p-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 transition"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* External Link banner if present */}
                {activeDocument.externalUrl && (
                  <div className="p-3 bg-emerald-950/70 rounded-2xl border border-emerald-600/50 flex items-center justify-between gap-3 text-xs">
                    <span className="text-emerald-200">Official External PDF / Website Resource Available</span>
                    <a
                      href={activeDocument.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center gap-1 transition"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Rich Markdown / Policy Content Box */}
                <div className="p-4 sm:p-5 bg-slate-950 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans space-y-3 whitespace-pre-line">
                  {activeDocument.content}
                </div>

                {/* Tags */}
                {activeDocument.tags && activeDocument.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-2">
                    <span className="text-[11px] font-bold text-slate-400">Tags:</span>
                    {activeDocument.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              {/* Reader Footer */}
              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-6">
                <span>Aqua Mustangs 2026-2027 Season</span>
                <span className="text-amber-400 font-medium">Official Team Documentation</span>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center p-8 text-center text-slate-500 flex-col space-y-2">
              <BookOpen className="w-12 h-12 text-emerald-600/40" />
              <h4 className="text-sm font-bold text-slate-300">Select a Document to View</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Choose any policy, lettering standard, or volunteer guide from the left to read full details.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* ADMIN ADD / EDIT DOCUMENT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
            
            <div className="p-4 border-b border-slate-800 bg-[#06241b] flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">
                {editingDoc ? 'Edit Document / Policy' : 'Add New Document / Policy'}
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. 2026-2027 Section 4AA Qualifying Standards"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as DocumentCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="handbook_policies">Handbook &amp; Rules</option>
                    <option value="lettering_standards">Lettering &amp; Times</option>
                    <option value="medical_safety">Medical &amp; Safety</option>
                    <option value="parent_booster">Booster &amp; Parents</option>
                    <option value="meet_info">Meet Info &amp; General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Format Type</label>
                  <select
                    value={formFileType}
                    onChange={e => setFormFileType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="policy">Policy / Text</option>
                    <option value="pdf">PDF Document</option>
                    <option value="sheet">Score / Time Sheet</option>
                    <option value="doc">Volunteer Guide</option>
                    <option value="link">External Website Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Brief 1-sentence overview for list cards"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Detailed Content / Policy Text *</label>
                <textarea
                  required
                  rows={6}
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  placeholder="Write the full policy guidelines, rules, point thresholds, or instructions here..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Optional External URL / PDF Link</label>
                <input
                  type="url"
                  value={formExternalUrl}
                  onChange={e => setFormExternalUrl(e.target.value)}
                  placeholder="https://mshsl.org/sports/swimming or Google Drive link"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={e => setFormTags(e.target.value)}
                    placeholder="Lettering, State, MSHSL"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPinned}
                      onChange={e => setFormIsPinned(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded bg-slate-950 border-slate-700"
                    />
                    <span className="font-bold text-white text-xs">Pin to Top of Knowledge Hub</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold shadow border border-amber-400/40"
                >
                  {editingDoc ? 'Save Changes' : 'Publish Document'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
