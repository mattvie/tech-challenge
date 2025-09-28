import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { clsx } from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { postService } from '../../services/postService';

// Ícone de coração em SVG
const HeartIcon = ({ className = '' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="m11.645 20.91-1.11-1.023C5.672 15.36 2.25 12.174 2.25 8.5 2.25 5.42 4.42 3.25 7.5 3.25c1.74 0 3.41.81 4.5 2.09C13.09 4.06 14.76 3.25 16.5 3.25 19.58 3.25 21.75 5.42 21.75 8.5c0 3.673-3.422 6.86-8.285 11.388L12 21.47l-.355-.36Z" />
  </svg>
);

interface LikeButtonProps {
  postId: number;
  initialLikesCount: number;
  initialIsLiked: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLikesCount,
  initialIsLiked,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  // CORREÇÃO APLICADA AQUI:
  const [likesCount, setLikesCount] = useState(Number(initialLikesCount));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    // E AQUI TAMBÉM, PARA GARANTIR A SINCRONIZAÇÃO
    setLikesCount(Number(initialLikesCount));
  }, [initialIsLiked, initialLikesCount]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      toast.info('Você precisa estar logado para curtir um post.');
      return;
    }

    setIsLoading(true);

    const previousState = { isLiked, likesCount };
    setIsLiked(!isLiked);
    setLikesCount(likesCount + (!isLiked ? 1 : -1));

    try {
      const response = await postService.likePost(postId);
      setIsLiked(response.liked);
    } catch (error) {
      setIsLiked(previousState.isLiked);
      setLikesCount(previousState.likesCount);
      toast.error('Ocorreu um erro ao processar seu like.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading || !isAuthenticated}
      className={clsx(
        'flex items-center gap-2 text-sm font-medium transition-colors duration-200 rounded-full py-1 px-3',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'text-red-500 bg-red-100 hover:bg-red-200 focus:ring-red-500': isLiked,
          'text-gray-600 bg-gray-100 hover:bg-gray-200 focus:ring-primary-500': !isLiked,
          'cursor-not-allowed': !isAuthenticated,
        }
      )}
    >
      <HeartIcon className="w-5 h-5" />
      <span>{likesCount}</span>
    </button>
  );
};