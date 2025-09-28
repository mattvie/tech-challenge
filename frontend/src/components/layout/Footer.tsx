import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {currentYear} BlogTech. Todos os direitos reservados.</p>
        <p className="text-sm text-gray-400 mt-1">
          Um Desafio Técnico feito com React, Node.js e muito café.
        </p>
      </div>
    </footer>
  );
};