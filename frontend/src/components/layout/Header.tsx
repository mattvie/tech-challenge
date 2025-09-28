import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

// Estilo para o NavLink ativo
const activeLinkStyle = {
  fontWeight: 'bold',
  color: '#4F46E5', // Cor primária do seu tema
};

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            BlogTech
          </Link>

          {/* Navegação */}
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 hidden sm:block">
                  Olá, <span className="font-semibold">{user?.username}</span>
                </span>
                <NavLink 
                  to="/create" 
                  style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Criar Post
                </NavLink>
                <Button onClick={logout} variant="secondary" size="sm">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login"
                  style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                  className="text-gray-600 hover:text-primary-600 transition-colors hidden sm:block"
                >
                  Entrar
                </NavLink>
                <NavLink to="/register">
                    <Button variant='primary' size='sm'>Criar Conta</Button>
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};