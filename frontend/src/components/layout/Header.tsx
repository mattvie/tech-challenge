import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Flex, Box, Text, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';

// O componente estilizado com classes do Tailwind
export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm will-change-transform">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 no-underline">
            TechBlog
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 no-underline px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-all">
              Posts
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/create" className="text-gray-600 no-underline px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-all">
                  Write
                </Link>
                <div className="relative inline-block">
                  <button className="flex items-center gap-2 p-2 border-none bg-none cursor-pointer rounded-md hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <Text className="text-sm text-gray-600">
                      {user?.username}
                    </Text>
                  </button>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 no-underline px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-all">
                  Login
                </Link>
                {/* Correção para o botão de link: envolva o Button com o Link */}
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
};