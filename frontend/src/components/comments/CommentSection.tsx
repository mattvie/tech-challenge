// frontend/src/components/comments/CommentSection.tsx

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useComments } from '../../hooks/useComments';
// O service não é mais necessário aqui, o hook já o utiliza por baixo dos panos
// import { commentService } from '../../services/commentService';
import { Button } from '../ui/Button';
import { Form, FormGroup, TextArea, ErrorText } from '../forms';
import { Comment } from '../../types';

interface CommentSectionProps {
  postId: number;
}

interface CommentFormData {
  content: string;
}

// Componente para renderizar um único comentário
const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  const commentDate = new Date(comment.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center mb-2">
        {/* CORREÇÃO 1: Acessando o username de forma segura */}
        <span className="font-semibold text-gray-800">{comment.author?.username || 'Usuário anônimo'}</span>
        <span className="text-gray-500 text-xs ml-3">{commentDate}</span>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
    </div>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  // CORREÇÃO 2: Usando as funções corretas do hook
  const { comments, loading, error, addComment, refreshComments } = useComments(postId);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CommentFormData>();

  const onSubmit: SubmitHandler<CommentFormData> = async (data) => {
    try {
      // CORREÇÃO 3: Chamando a função addComment do hook
      await addComment(data.content);
      toast.success('Comentário adicionado!');
      reset(); // Limpa o formulário
      // Opcional mas recomendado: Chamar refreshComments() se addComment não atualizar a lista automaticamente
      // await refreshComments();
    } catch (err) {
      toast.error('Falha ao adicionar o comentário.');
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mt-8">
      <h3 className="text-2xl font-bold mb-6">Comentários ({comments.length})</h3>

      {isAuthenticated && (
        <Form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <FormGroup>
            <TextArea
              placeholder="Deixe seu comentário..."
              rows={4}
              hasError={!!errors.content}
              {...register('content', { required: 'O comentário não pode estar vazio.' })}
            />
            {errors.content && <ErrorText>{errors.content.message}</ErrorText>}
          </FormGroup>
          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
          </Button>
        </Form>
      )}

      <div className="space-y-4">
        {loading && <p>Carregando comentários...</p>}
        {error && <p className="text-red-500">Erro ao carregar comentários.</p>}
        {!loading && comments.length === 0 && (
          <p className="text-gray-500">Seja o primeiro a comentar!</p>
        )}
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};