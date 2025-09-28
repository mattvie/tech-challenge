import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Heading, Text, Button } from '../../components/ui';
import { Form, FormGroup, Label, Input, ErrorText } from '../../components/forms';
import { useAuth } from '../../hooks/useAuth';
import { RegisterRequest } from '../../types';
import { toast } from 'react-toastify';

// Adicionando o campo de confirmação de senha ao tipo do formulário
type RegisterFormData = RegisterRequest & {
  confirmPassword?: string;
};

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  // Observa o valor do campo de senha para a validação de confirmação
  const password = watch('password');

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsLoading(true);
    try {
      // Remove o campo de confirmação antes de enviar para a API
      const { confirmPassword, ...registerData } = data;
      await authRegister(registerData);
      
      toast.success('Conta criada com sucesso! Bem-vindo(a)!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Falha ao criar a conta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Box className="bg-white p-8 rounded-lg shadow-md">
        <Heading as="h1" className="text-center mb-6">
          Criar Nova Conta
        </Heading>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Escolha um nome de usuário"
              hasError={!!errors.username}
              {...register('username', {
                required: 'Username é obrigatório',
                minLength: { value: 3, message: 'Deve ter no mínimo 3 caracteres' },
              })}
            />
            {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              hasError={!!errors.email}
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Endereço de email inválido',
                },
              })}
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </FormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup>
              <Label htmlFor="firstName">Primeiro Nome</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Seu nome"
                {...register('firstName')}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="lastName">Último Nome</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Seu sobrenome"
                {...register('lastName')}
              />
            </FormGroup>
          </div>
          
          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Crie uma senha forte"
              hasError={!!errors.password}
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter no mínimo 6 caracteres',
                },
              })}
            />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              hasError={!!errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Confirmação de senha é obrigatória',
                validate: value =>
                  value === password || "As senhas não correspondem",
              })}
            />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword.message}</ErrorText>}
          </FormGroup>
          
          <Button 
            type="submit" 
            fullWidth={true} 
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </Form>
        
        <Text className="text-center mt-6 text-gray-600 text-sm">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary-600 hover:underline font-medium">
            Faça login
          </Link>
        </Text>
      </Box>
    </div>
  );
};