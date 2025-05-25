
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { ROUTES } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Card from '../components/Card';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, user: authUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    if (authUser) {
      // User is already logged in, redirect to their dashboard
      if (authUser.role === UserRole.FARMER) {
        navigate(ROUTES.FARMER_DASHBOARD);
      } else if (authUser.role === UserRole.BUYER) {
        navigate(ROUTES.BUYER_DASHBOARD);
      } else {
        navigate(ROUTES.LANDING); // Fallback, should not happen if role is set
      }
    }
  }, [authUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(formData.email, formData.password);
      if (user) {
        if (user.role === UserRole.FARMER) {
          navigate(ROUTES.FARMER_DASHBOARD);
        } else {
          navigate(ROUTES.BUYER_DASHBOARD);
        }
      } else {
         setError("Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card title="Welcome Back to HarvestHub AI!">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary-dark border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Keep me logged in</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">Forgot your password?</a>
            </div>
          </div>
          <Button type="submit" isLoading={loading} fullWidth size="lg">
            Login
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="font-medium text-primary hover:text-primary-dark">
            Sign up here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
    