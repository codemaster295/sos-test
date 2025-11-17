import React from 'react';
import styled from 'styled-components';
import { cn } from '../../lib/utils';

const InputWrapper = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #37352f;
  margin-bottom: 4px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 3px;
  font-size: 14px;
  font-family: inherit;
  background-color: #ffffff;
  color: #37352f;
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: #37352f;
    box-shadow: 0 0 0 1px #37352f;
  }

  &:disabled {
    background-color: rgba(55, 53, 47, 0.06);
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: rgba(55, 53, 47, 0.4);
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid rgba(55, 53, 47, 0.16);
  border-radius: 3px;
  font-size: 14px;
  font-family: inherit;
  background-color: #ffffff;
  color: #37352f;
  resize: vertical;
  min-height: 80px;
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: #37352f;
    box-shadow: 0 0 0 1px #37352f;
  }

  &:disabled {
    background-color: rgba(55, 53, 47, 0.06);
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: rgba(55, 53, 47, 0.4);
  }
`;

const ErrorText = styled.p`
  margin-top: 4px;
  font-size: 13px;
  color: #eb5757;
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <InputWrapper className={cn(className)}>
      {label && <Label>{label}</Label>}
      <StyledInput {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => {
  return (
    <InputWrapper className={cn(className)}>
      {label && <Label>{label}</Label>}
      <StyledTextarea {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </InputWrapper>
  );
};
