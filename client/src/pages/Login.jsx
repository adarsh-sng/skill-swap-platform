import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import ParticleAnimation from '../components/ParticleCanvas';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const result = await login(data);
      if (result.success) {
        toast.success('Welcome back!', {
          description: 'You have been successfully logged in.',
          duration: 4000,
        });
        navigate('/');
      } else {
        toast.error('Login failed', {
          description: result.error || 'Please check your credentials and try again.',
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center bg-black text-gray-100 p-6 overflow-hidden">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 border border-cyan-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your SkillSwap account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="label">
                <span className="label-text text-white">Email</span>
              </label>
              <input
                type="email"
                {...register('email')}
                className="input input-bordered w-full bg-gray-700 border-cyan-500/20 text-white placeholder-white/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text text-white">Password</span>
              </label>
              <input
                type="password"
                {...register('password')}
                className="input input-bordered w-full bg-gray-700 border-cyan-500/20 text-white placeholder-white/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 hover:shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="divider text-gray-400">or</div>

          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login; 