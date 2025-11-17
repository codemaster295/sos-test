import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div<{ $size: number }>`
  border: 2px solid rgba(55, 53, 47, 0.16);
  border-top: 2px solid #37352f;
  border-radius: 50%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  gap: 12px;
`;

const Message = styled.p`
  font-size: 14px;
  color: rgba(55, 53, 47, 0.65);
  margin: 0;
`;

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, size = 32 }) => {
  return (
    <Container>
      <Spinner $size={size} />
      {message && <Message>{message}</Message>}
    </Container>
  );
};
