import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postService } from '../../services/postService';
import { Post } from '../../types';
import { CommentSection } from '../../components/comments/CommentSection';
import { LikeButton } from '../../components/posts/LikeButton';

export const PostDetailPage: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  useEffect(() => {
    if (!postId) {
      setError('ID do post inválido.');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postService.getPostById(postId);
        setPost(response.post);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Post não encontrado.');
        toast.error('Não foi possível carregar o post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <div className="text-center py-20">Carregando post...</div>;
  }

  if (error || !post) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Erro ao carregar</h2>
        <p className="text-gray-500 mb-6">{error || 'O post que você está procurando não existe.'}</p>
        <Link to="/" className="text-primary-600 hover:underline font-medium">
          Voltar para a Home
        </Link>
      </div>
    );
  }

  const postDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <article className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-96 object-cover"
        />
        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex justify-between items-center text-sm text-gray-500 mb-8 border-b pb-4">
            <div>
              <span>Por <strong>{post.author?.username}</strong></span>
              <span className="mx-2">&middot;</span>
              <span>{postDate}</span>
            </div>
            {/* ADICIONAR O BOTÃO DE LIKE AQUI */}
            <LikeButton
              postId={post.id}
              initialLikesCount={post.likesCount}
              initialIsLiked={!!post.isLikedByCurrentUser}
            />
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-800 whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </div>

      <CommentSection postId={postId} />
    </article>
  );
};