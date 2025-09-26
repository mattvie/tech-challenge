import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, QueryKey } from 'react-query';
import { postService, PostQuery } from '../services/postService';
import { useAuth } from './useAuth';
import { Post, CreatePostRequest, UpdatePostRequest, User } from '../types';

// Custom hook for managing posts
export const usePostsAdvanced = (options?: {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  authorId?: number;
  enabled?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const {
    page = 1,
    limit = 10,
    search,
    tags,
    authorId,
    enabled = true
  } = options || {};

  const queryKey: QueryKey = ['posts', { page, limit, search, tags, authorId }];

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery(
    queryKey,
    // Correção aplicada em tags
    () => postService.getPosts({ page, limit, search, tags: tags?.join(','), authorId }),
    {
      enabled,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      keepPreviousData: true,
      onError: (error) => {
        console.error('Error fetching posts:', error);
      }
    }
  );

  const createPostMutation = useMutation(
    (postData: CreatePostRequest) => postService.createPost(postData),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['posts']);
        queryClient.setQueryData(['post', data.post.id], data.post);
      },
      onError: (error) => {
        console.error('Error creating post:', error);
      }
    }
  );

  const updatePostMutation = useMutation(
    ({ id, data }: { id: number; data: UpdatePostRequest }) =>
      postService.updatePost(id, data),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['post', data.post.id], data.post);
        queryClient.invalidateQueries(['posts']);
      },
      onError: (error) => {
        console.error('Error updating post:', error);
      }
    }
  );
  
  const deletePostMutation = useMutation(
    (postId: number) => postService.deletePost(postId),
    {
      onSuccess: (_, deletedPostId) => {
        queryClient.removeQueries(['post', deletedPostId]);
        queryClient.invalidateQueries(['posts']);
      },
      onError: (error) => {
        console.error('Error deleting post:', error);
      }
    }
  );
  
  const likePostMutation = useMutation(
    (postId: number) => postService.likePost(postId),
    {
      onMutate: async (postId) => {
        await queryClient.cancelQueries(['post', postId]);
        await queryClient.cancelQueries(['posts']);

        const previousPost = queryClient.getQueryData(['post', postId]);
        const previousPosts = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(['post', postId], (old: any) => ({
          ...old,
          isLiked: !old?.isLiked,
          likeCount: old?.isLiked ? old.likeCount - 1 : old.likeCount + 1,
        }));

        queryClient.setQueryData(queryKey, (old: any) => ({
          ...old,
          posts: old?.posts?.map((post: Post) => 
            post.id === postId 
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likeCount: (post.likeCount ?? 0) + (post.isLiked ? -1 : 1),
                }
              : post
          ),
        }));

        return { previousPost, previousPosts };
      },
      onError: (err, postId, context: any) => {
        if (context?.previousPost) {
          queryClient.setQueryData(['post', postId], context.previousPost);
        }
        if (context?.previousPosts) {
          queryClient.setQueryData(queryKey, context.previousPosts);
        }
      },
      onSettled: (data, error, postId) => {
        queryClient.invalidateQueries(['post', postId]);
        queryClient.invalidateQueries(['posts']);
      },
    }
  );

  const createPost = useCallback((postData: CreatePostRequest) => {
    return createPostMutation.mutateAsync(postData);
  }, [createPostMutation]);

  const updatePost = useCallback((id: number, data: UpdatePostRequest) => {
    return updatePostMutation.mutateAsync({ id, data });
  }, [updatePostMutation]);

  const deletePost = useCallback((postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      return deletePostMutation.mutateAsync(postId);
    }
  }, [deletePostMutation]);

  const likePost = useCallback((postId: number) => {
    if (!user) {
      throw new Error('Must be logged in to like posts');
    }
    return likePostMutation.mutateAsync(postId);
  }, [likePostMutation, user]);

  const canEditPost = useCallback((post: Post) => {
    return user && ((user as User).id === post.authorId || (user as any).role === 'admin');
  }, [user]);

  const canDeletePost = useCallback((post: Post) => {
    return user && ((user as User).id === post.authorId || (user as any).role === 'admin');
  }, [user]);

  return {
    posts: postsData?.posts || [],
    pagination: postsData?.pagination,
    isLoading,
    isFetching,
    isCreating: createPostMutation.isLoading,
    isUpdating: updatePostMutation.isLoading,
    isDeleting: deletePostMutation.isLoading,
    isLiking: likePostMutation.isLoading,
    error,
    createError: createPostMutation.error,
    updateError: updatePostMutation.error,
    deleteError: deletePostMutation.error,
    likeError: likePostMutation.error,
    createPost,
    updatePost,
    deletePost,
    likePost,
    refetch,
    canEditPost,
    canDeletePost,
    resetCreateError: createPostMutation.reset,
    resetUpdateError: updatePostMutation.reset,
    resetDeleteError: deletePostMutation.reset,
    resetLikeError: likePostMutation.reset,
  };
};

export const usePost = (postId: number | null, enabled = true) => {
  const queryClient = useQueryClient();

  const {
    data, // Mudei para data para evitar conflito
    isLoading,
    error,
    refetch
  } = useQuery(
    ['post', postId],
    () => postService.getPostById(postId!),
    {
      enabled: enabled && !!postId,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
  
  const post = data?.post;

  useEffect(() => {
    if (post?.tags && post.tags.length > 0) {
      const tagsString = post.tags.slice(0, 3).join(',');
      queryClient.prefetchQuery(
        ['posts', { tags: tagsString }],
        () => postService.getPosts({ tags: tagsString, limit: 5 }),
        {
          staleTime: 10 * 60 * 1000,
        }
      );
    }
  }, [post?.tags, queryClient]);

  return {
    post,
    isLoading,
    error,
    refetch,
  };
};

export const useDrafts = () => {
  const { user } = useAuth();
  
  return useQuery(
    ['posts', 'drafts', user?.id],
    () => postService.getPosts({ 
      authorId: (user as User)?.id, 
      published: false,
      limit: 50 
    }),
    {
      enabled: !!user,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const usePostView = (postId: number) => {
  const [hasViewed, setHasViewed] = useState(false);

  const trackView = useCallback(() => {
    if (!hasViewed && postId) {
      setHasViewed(true);
    }
  }, [postId, hasViewed]);

  return {
    trackView,
    hasViewed,
  };
};

export const usePostSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { posts, isLoading, error } = usePostsAdvanced({
    search: debouncedSearchTerm,
    tags: selectedTags,
    enabled: debouncedSearchTerm.length > 0 || selectedTags.length > 0,
  });
  
const addTag = useCallback((tag: string) => {
  setSelectedTags(prev => Array.from(new Set([...prev, tag])));
}, []);

  const removeTag = useCallback((tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedTags([]);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedTags,
    addTag,
    removeTag,
    clearSearch,
    posts: debouncedSearchTerm.length > 0 || selectedTags.length > 0 ? posts : [],
    isLoading,
    error,
    hasQuery: debouncedSearchTerm.length > 0 || selectedTags.length > 0,
  };
};