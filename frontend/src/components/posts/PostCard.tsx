import React from 'react';
import { Post } from '../../types';
import { Link } from 'react-router-dom';
import { LikeButton } from './LikeButton';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const postDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link to={`/post/${post.id}`} className="block group">
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={post.imageUrl || 'https://via.placeholder.com/400x250'} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt || 'Este post não possui um resumo...'}
          </p>
        </div>
      </Link>
      
      {/* SEÇÃO DE INFORMAÇÕES (FOOTER DO CARD) */}
      <div className="mt-auto p-6 pt-0 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          <span>Por <strong>{post.author?.username || 'Anônimo'}</strong></span>
          <span className="block">{postDate}</span>
        </div>
        {/* ADICIONAR O BOTÃO DE LIKE AQUI */}
        <LikeButton 
          postId={post.id} 
          initialLikesCount={post.likesCount}
          initialIsLiked={!!post.isLikedByCurrentUser}
        />
      </div>
    </div>
  );
};