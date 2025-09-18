import api from './api';
import { Comment, CommentsResponse, CreateCommentRequest } from '../types';

export const commentService = {
  async getComments(postId: number, page: number = 1, limit: number = 20): Promise<CommentsResponse> {
    const response = await api.get<CommentsResponse>(`/comments/post/${postId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  async createComment(commentData: CreateCommentRequest): Promise<{ message: string; comment: Comment }> {
    const response = await api.post<{ message: string; comment: Comment }>('/comments', commentData);
    return response.data;
  },

  async updateComment(id: number, content: string): Promise<{ message: string; comment: Comment }> {
    const response = await api.put<{ message: string; comment: Comment }>(`/comments/${id}`, { content });
    return response.data;
  },

  async deleteComment(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/comments/${id}`);
    return response.data;
  },
};