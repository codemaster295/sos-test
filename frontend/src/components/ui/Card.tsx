import React from 'react';
import styled from 'styled-components';
import { cn } from '../../lib/utils';

const StyledCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(55, 53, 47, 0.09);
  border-radius: 3px;
  overflow: hidden;
  transition: all 0.15s ease;

  &:hover {
    border-color: rgba(55, 53, 47, 0.16);
    box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px;
  }
`;

const CardHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid rgba(55, 53, 47, 0.09);
`;

const CardContent = styled.div`
  padding: 14px 16px;
`;

const CardFooter = styled.div`
  padding: 10px 16px;
  background-color: rgba(55, 53, 47, 0.03);
  border-top: 1px solid rgba(55, 53, 47, 0.09);
`;

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const CardComponent: React.FC<CardProps> = ({ children, className }) => {
  return <StyledCard className={cn(className)}>{children}</StyledCard>;
};

export const Card = CardComponent as typeof CardComponent & {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
