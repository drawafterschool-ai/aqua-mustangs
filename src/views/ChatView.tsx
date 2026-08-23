import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { type ChatChannel, type ChatMessage, type UserRole } from '../types';
import { 
  Send, 
  Plus, 
  Lock, 
  Smile, 
  Crown 
} from 'lucide-react';

interface ChatViewProps {
  onOpenCreateChannel: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onOpenCreateChannel }) => {
  const { 
    currentUser, 
    channels, 
    messages, 
    sendMessage, 
    toggleReaction, 
    isAdmin, 
    isCoach 
  } = useApp();

  const [activeChannelId, setActiveChannelId] = useState<string>('girls-team');
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find((c: ChatChannel) => c.id === activeChannelId) || channels[0];

  const channelMessages = messages
    .filter((m: ChatMessage) => m.channelId === activeChannelId)
    .sort((a: ChatMessage, b: ChatMessage) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length, activeChannelId]);

  const hasAccessToActiveChannel = () => {
    if (!activeChannel) return false;
    if (activeChannel.type === 'public') return true;
    if (activeChannel.type === 'admins_only') {
      return isAdmin;
    }
    if (activeChannel.type === 'girls_only') {
      return !isCoach || isAdmin;
    }
    if (activeChannel.type === 'custom' && activeChannel.allowedUserIds) {
      return activeChannel.allowedUserIds.includes(currentUser?.id || '');
    }
    return true;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeChannelId, inputText.trim());
    setInputText('');
  };

  const reactionEmojis = ['💚', '🔥', '🏊‍♀️', '🍝', '👍', '❤️', '🙌', '🎉'];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'head_coach':
      case 'assistant_coach':
      case 'diving_coach':
        return <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">COACH</span>;
      case 'captain':
        return <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">CAPTAIN</span>;
      case 'diver':
        return <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-950 text-sky-300">DIVER</span>;
      default:
        return <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">SWIMMER</span>;
    }
  };

  const isAccessible = hasAccessToActiveChannel();

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] pb-4 pt-1 animate-in fade-in">
      
      {/* CHANNEL SELECTOR HORIZONTAL TRAY */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar mb-2 flex-shrink-0">
        {channels.map((chan: ChatChannel) => {
          const isActive = chan.id === activeChannelId;

          return (
            <button
              key={chan.id}
              onClick={() => setActiveChannelId(chan.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                isActive 
                  ? 'bg-emerald-800 text-amber-300 border-amber-400/80 shadow-md scale-102' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span className="text-sm">{chan.icon}</span>
              <span>{chan.name}</span>
              {chan.type === 'admins_only' && <Lock className="w-3 h-3 text-amber-400 ml-0.5" />}
            </button>
          );
        })}

        <button
          onClick={onOpenCreateChannel}
          className="flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-bold text-emerald-400 bg-slate-950 hover:bg-slate-900 border border-dashed border-emerald-700/60 whitespace-nowrap transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Group</span>
        </button>
      </div>

      {/* ACTIVE CHANNEL MAIN CONTAINER */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-3xl border border-emerald-800/40 shadow-2xl overflow-hidden min-h-0">
        
        {/* Channel Header */}
        <div className="p-3 sm:p-4 bg-[#06241b] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl">{activeChannel?.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                  {activeChannel?.name}
                </h3>
                {activeChannel?.type === 'admins_only' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5" /> Admins Only
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-300 truncate">
                {activeChannel?.description}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
            {channelMessages.length} Messages
          </div>
        </div>

        {/* MESSAGES THREAD */}
        {!isAccessible ? (
          /* Gated Channel Notice */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-3 border border-amber-400/40">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-white">Admins &amp; Captains Only</h4>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              This channel is restricted to Head Coaches, Assistant Coaches, and Team Captains for lineup &amp; strategy discussions.
            </p>
            <p className="text-[11px] text-amber-300/90 mt-3 font-semibold">
              Tip: Switch to a Coach or Captain profile in the top menu to view.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {channelMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No messages in this channel yet. Say hi to the team!
              </div>
            ) : (
              channelMessages.map((msg: ChatMessage) => {
                const isMe = msg.senderId === currentUser?.id;
                const reactions = msg.reactions || {};

                return (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[80%] ${
                      isMe ? 'ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    <img 
                      src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                      alt="" 
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-700 flex-shrink-0 mt-0.5"
                    />

                    <div className={`space-y-1 ${isMe ? 'items-end' : ''}`}>
                      <div className={`flex items-center gap-1.5 ${isMe ? 'justify-end' : ''}`}>
                        <span className="text-xs font-bold text-slate-200">
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        {getRoleBadge(msg.senderRole)}
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Message Bubble */}
                      <div 
                        className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe 
                            ? 'bg-emerald-700 text-white rounded-tr-none border border-emerald-600 shadow-md' 
                            : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-md'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Reactions Row */}
                      <div className={`flex items-center gap-1 flex-wrap ${isMe ? 'justify-end' : ''}`}>
                        {Object.entries(reactions).map(([emoji, userIds]: [string, string[]]) => {
                          const reactedByMe = currentUser ? userIds.includes(currentUser.id) : false;
                          return (
                            <button
                              key={emoji}
                              onClick={() => toggleReaction(msg.id, emoji)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border transition ${
                                reactedByMe 
                                  ? 'bg-emerald-950 text-amber-300 border-amber-400/80' 
                                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span>{userIds.length}</span>
                            </button>
                          );
                        })}

                        {/* Quick React Trigger */}
                        <button
                          onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                          className="p-1 rounded-full text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition text-[10px]"
                          title="Add reaction"
                        >
                          <Smile className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Inline Emoji Selector Modal/Tray */}
                      {showEmojiPicker === msg.id && (
                        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-700 rounded-xl shadow-xl animate-in zoom-in-95 duration-100">
                          {reactionEmojis.map(em => (
                            <button
                              key={em}
                              onClick={() => {
                                toggleReaction(msg.id, em);
                                setShowEmojiPicker(null);
                              }}
                              className="p-1 hover:bg-slate-800 rounded text-sm transition hover:scale-125"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* MESSAGE INPUT BOX */}
        {isAccessible && (
          <form onSubmit={handleSendMessage} className="p-2 sm:p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 flex-shrink-0">
            
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message #${activeChannel?.name}...`}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-700 text-white font-bold transition shadow-md border border-amber-400/40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
