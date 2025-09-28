import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Box, Heading, Button } from '../../components/ui';
import { Form, FormGroup, Label, Input, TextArea, ErrorText, FileInput } from '../../components/forms';
import { useFileUpload } from '../../hooks/useFileUpload';
import { postService } from '../../services/postService';

interface CreatePostFormData {
  title: string;
  excerpt: string;
  content: string;
}

export const CreatePostPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { 
    uploading, 
    error: uploadError, 
    uploadedFile,
    uploadFile,
    clearError
  } = useFileUpload();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormData>();
  
  // Função para lidar com a seleção de arquivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Cria uma URL local para a prévia
      uploadFile(file); // Inicia o upload
    }
  };

  const onSubmit: SubmitHandler<CreatePostFormData> = async (data) => {
    if (!uploadedFile?.url) {
      toast.error('Por favor, aguarde o upload da imagem ser concluído ou selecione uma imagem.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPostData = {
        ...data,
        imageUrl: uploadedFile.url, // Usando a URL retornada pelo hook
      };
      
      const { post: createdPost } = await postService.createPost(newPostData);

      toast.success('Post criado com sucesso!');
      navigate(`/post/${createdPost.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Falha ao criar o post.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (uploadError) {
      toast.error(`Erro no upload: ${uploadError}`);
      clearError(); // Limpa o erro para não mostrar novamente
    }
  }, [uploadError, clearError]);

  return (
    <div className="max-w-4xl mx-auto">
      <Box className="bg-white p-8 rounded-lg shadow-md">
        <Heading as="h1" className="mb-6">
          Criar Novo Post
        </Heading>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* ... O resto do formulário (Inputs de título, resumo, etc.) continua igual ... */}
          <FormGroup>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              type="text"
              placeholder="Um título chamativo para seu post"
              hasError={!!errors.title}
              {...register('title', {
                required: 'O título é obrigatório',
                minLength: { value: 5, message: 'O título deve ter no mínimo 5 caracteres' },
              })}
            />
            {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="excerpt">Resumo (opcional)</Label>
            <Input
              id="excerpt"
              type="text"
              placeholder="Uma breve descrição do seu post"
              hasError={!!errors.excerpt}
              {...register('excerpt')}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="image">Imagem de Capa</Label>
            {/* O onChange foi movido para o componente FileInput */}
            <FileInput onChange={handleFileChange} />
            {uploading && <p className="text-sm text-gray-500 mt-2">Enviando imagem...</p>}
            {uploadError && <ErrorText className="mt-2">{uploadError}</ErrorText>}
            {preview && !uploadError && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Prévia da Imagem:</p>
                <img src={preview} alt="Prévia" className="max-w-xs rounded-lg shadow-sm" />
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">Conteúdo</Label>
            <TextArea
              id="content"
              placeholder="Escreva sua história aqui..."
              rows={10}
              hasError={!!errors.content}
              {...register('content', {
                required: 'O conteúdo é obrigatório',
                minLength: { value: 20, message: 'O conteúdo deve ter no mínimo 20 caracteres' },
              })}
            />
            {errors.content && <ErrorText>{errors.content.message}</ErrorText>}
          </FormGroup>
          
          <Button 
            type="submit"
            size="lg"
            isLoading={isSubmitting || uploading}
            disabled={isSubmitting || uploading}
          >
            {isSubmitting ? 'Publicando...' : (uploading ? 'Aguardando imagem...' : 'Publicar Post')}
          </Button>
        </Form>
      </Box>
    </div>
  );
};