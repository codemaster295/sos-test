import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 2rem;
`;

const RegisterCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(55, 53, 47, 0.09);
  border-radius: 3px;
  box-shadow: rgba(15, 15, 15, 0.03) 0px 0px 0px 1px, rgba(15, 15, 15, 0.05) 0px 3px 6px, rgba(15, 15, 15, 0.1) 0px 9px 24px;
  padding: 48px;
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #37352f;
  margin-bottom: 4px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: rgba(55, 53, 47, 0.65);
  text-align: center;
  margin-bottom: 32px;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ErrorMessage = styled.p`
  color: #eb5757;
  font-size: 13px;
  padding: 8px 10px;
  background-color: rgba(235, 87, 87, 0.1);
  border-radius: 3px;
  border: 1px solid rgba(235, 87, 87, 0.2);
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 24px;
  color: rgba(55, 53, 47, 0.65);
  font-size: 14px;

  a {
    color: #37352f;
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid transparent;
    transition: border-color 0.15s ease;

    &:hover {
      border-bottom-color: #37352f;
    }
  }
`;

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register({ email, password, name: name || undefined });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <RegisterCard>
        <Logo>🚑</Logo>
        <Title>Create Account</Title>
        <Subtitle>Sign up for SOS Emergency Services</Subtitle>
        <Form onSubmit={handleSubmit}>
          <Input
            label="Name (Optional)"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={isLoading}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            disabled={isLoading}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button variant="primary" type="submit" disabled={isLoading} style={{ width: '100%', marginTop: '8px' }}>
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </Form>
        <LinkText>
          Already have an account? <Link to="/login">Sign in</Link>
        </LinkText>
      </RegisterCard>
    </Container>
  );
};
