import React from 'react';
import styled from 'styled-components';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const StyledButton = styled.button<{ $variant: string; $size: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.15s ease;
  cursor: pointer;
  border: none;
  outline: none;
  user-select: none;
  white-space: nowrap;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }

  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: #37352f;
          color: #ffffff;
          &:hover:not(:disabled) {
            background-color: #2e2d29;
          }
        `;
      case 'secondary':
        return `
          background-color: rgba(55, 53, 47, 0.08);
          color: #37352f;
          &:hover:not(:disabled) {
            background-color: rgba(55, 53, 47, 0.12);
          }
        `;
      case 'danger':
        return `
          background-color: #eb5757;
          color: #ffffff;
          &:hover:not(:disabled) {
            background-color: #e04747;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: #37352f;
          border: 1px solid rgba(55, 53, 47, 0.16);
          &:hover:not(:disabled) {
            background-color: rgba(55, 53, 47, 0.06);
            border-color: rgba(55, 53, 47, 0.24);
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: #37352f;
          &:hover:not(:disabled) {
            background-color: rgba(55, 53, 47, 0.08);
          }
        `;
      default:
        return '';
    }
  }}

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: 4px 10px;
          font-size: 13px;
          height: 28px;
        `;
      case 'md':
        return `
          padding: 6px 14px;
          font-size: 14px;
          height: 32px;
        `;
      case 'lg':
        return `
          padding: 8px 18px;
          font-size: 15px;
          height: 36px;
        `;
      default:
        return '';
    }
  }}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      className={cn(className)}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
