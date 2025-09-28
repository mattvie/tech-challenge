import React from 'react';
import { PostCard } from '../../components/posts/PostCard'; // Componente que você vai criar
import { usePosts } from '../../hooks/usePosts'; // Hook que já existe
import { Layout } from '../../components/layout/Layout';

const HomePage: React.FC = () => {
  const { posts, loading, error } = usePosts();

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Últimos Posts</h1>
        
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Grid responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
  );
};

export default HomePage;