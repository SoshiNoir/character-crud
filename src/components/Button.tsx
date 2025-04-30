import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode; // Texto ou conteúdo do botão
  className?: string; // Classes adicionais para estilização
  bgColor?: string; // Cor de fundo
  hoverColor?: string; // Cor ao passar o mouse
  textColor?: string; // Cor do texto
  disabled?: boolean; // Desabilitar o botão
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '',
  bgColor = 'bg-blue-500',
  hoverColor = 'hover:bg-blue-600',
  textColor = 'text-white',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${bgColor} ${hoverColor} ${textColor} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
