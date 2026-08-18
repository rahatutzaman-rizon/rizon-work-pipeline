'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Clock } from 'lucide-react';
import { CommentItem, fetchComments, createComment } from '@/lib/supabase/modules-db';

interface CommentThreadProps {
  parentType: 'note' | 'task';
  parentId: string;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ parentType, parentId }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newCommentBody, setNewCommentBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [parentType, parentId]);

  const loadComments = async () => {
    const list = await fetchComments(parentType, parentId);
    setComments(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentBody.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const created = await createComment(parentType, parentId, newCommentBody);
    if (created) {
      setComments([...comments, created]);
      setNewCommentBody('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <MessageSquare className="w-4 h-4 text-emerald-600" />
        <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
          Discussion & Study Comments ({comments.length})
        </h4>
      </div>

      {/* Scrollable Comments List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <User className="w-3 h-3 text-emerald-600" />
                  Candidate Note
                </span>
                <span className="font-mono text-[10px]">
                  {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{comment.body}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic text-center py-3">
            No study comments added yet. Type below to start discussion.
          </p>
        )}
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-2 border-t border-slate-200">
        <input
          type="text"
          value={newCommentBody}
          onChange={(e) => setNewCommentBody(e.target.value)}
          placeholder="Add a study review note or revision comment..."
          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newCommentBody.trim() || isSubmitting}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </form>
    </div>
  );
};
