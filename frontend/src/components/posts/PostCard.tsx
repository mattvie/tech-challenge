// Em frontend/src/components/posts/PostCard.tsx (exemplo)
import React from 'react';
import { Post } from '../../types';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`} className="block group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <img 
        src={post.imageUrl || 'https://via.placeholder.com/400x250'} 
        alt={post.title}
        className="w-full h-48 object-cover"
        loading="lazy" // Otimização de imagem!
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
        <div className="text-xs text-gray-500">
          <span>By {post.author?.username}</span> · <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};