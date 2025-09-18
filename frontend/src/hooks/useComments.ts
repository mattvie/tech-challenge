import { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { Comment } from '../types';

export const useComments = (postId: number | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await commentService.getComments(postId);
        setComments(response.comments);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const addComment = async (content: string, parentId?: number) => {
    if (!postId) return;

    try {
      const response = await commentService.createComment({
        content,
        postId,
        parentId,
      });

      // Add the new comment to the list
      if (parentId) {
        // Handle reply logic
        setComments(prev => 
          prev.map(comment => 
            comment.id === parentId 
              ? { 
                  ...comment, 
                  replies: [...(comment.replies || []), response.comment]
                }
              : comment
          )
        );
      } else {
        setComments(prev => [response.comment, ...prev]);
      }

      return response.comment;
    } catch (err: any) {
      throw err;
    }
  };

  const updateComment = async (commentId: number, content: string) => {
    try {
      const response = await commentService.updateComment(commentId, content);
      
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? response.comment
            : {
                ...comment,
                replies: comment.replies?.map(reply => 
                  reply.id === commentId ? response.comment : reply
                ) || []
              }
        )
      );

      return response.comment;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await commentService.deleteComment(commentId);
      
      setComments(prev => 
        prev.filter(comment => comment.id !== commentId)
             .map(comment => ({
               ...comment,
               replies: comment.replies?.filter(reply => reply.id !== commentId) || []
             }))
      );
    } catch (err: any) {
      throw err;
    }
  };

  const refreshComments = () => {
    if (postId) {
      // Re-fetch comments
    }
  };

  return {
    comments,
    loading,
    error,
    pagination,
    addComment,
    updateComment,
    deleteComment,
    refreshComments,
  };
};