import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Box, Heading, Button } from '../../components/ui';
import { Form, FormGroup, Label, Input, TextArea, ErrorText } from '../../components/forms';
import { postService } from '../../services/postService';
import { Post } from '../../types';

interface EditPostFormData {
  title: string;
  excerpt: string;
  content: string;
}

export const EditPostPage: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditPostFormData>();

  // Busca os dados do post ao carregar a página
  useEffect(() => {
    if (!postId) {
      toast.error("ID do post inválido.");
      navigate('/');
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await postService.getPostById(postId);
        setPost(response.post);
        // Preenche o formulário com os dados existentes
        reset({
          title: response.post.title,
          excerpt: response.post.excerpt,
          content: response.post.content,
        });
      } catch (error) {
        toast.error("Não foi possível carregar o post para edição.");
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate, reset]);

  const onSubmit: SubmitHandler<EditPostFormData> = async (data) => {
    try {
      await postService.updatePost(postId, data);
      toast.success('Post atualizado com sucesso!');
      navigate(`/post/${postId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Falha ao atualizar o post.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Carregando editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Box className="bg-white p-8 rounded-lg shadow-md">
        <Heading as="h1" className="mb-6">
          Editar Post
        </Heading>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              type="text"
              hasError={!!errors.title}
              {...register('title', {
                required: 'O título é obrigatório',
              })}
            />
            {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="excerpt">Resumo (opcional)</Label>
            <Input
              id="excerpt"
              type="text"
              {...register('excerpt')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">Conteúdo</Label>
            <TextArea
              id="content"
              rows={10}
              hasError={!!errors.content}
              {...register('content', {
                required: 'O conteúdo é obrigatório',
              })}
            />
            {errors.content && <ErrorText>{errors.content.message}</ErrorText>}
          </FormGroup>
          
          <Button 
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Form>
      </Box>
    </div>
  );
};