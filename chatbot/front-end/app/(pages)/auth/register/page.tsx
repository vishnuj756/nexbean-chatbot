"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Mail, User, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRegister } from '@/app/services/api/apiService';

// 1. Define Signup Validation Schema
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const router=useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
   getRegister(data,setIsLoading,router)
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 transition-colors dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
            Join NexBean and start your AI journey
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Username
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("username")}
                  className={`block w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-3 text-sm focus:ring-2 dark:bg-zinc-800 dark:text-white ${
                    errors.username ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 dark:border-zinc-700"
                  }`}
                  placeholder="johndoe"
                />
              </div>
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Email
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className={`block w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-3 text-sm focus:ring-2 dark:bg-zinc-800 dark:text-white ${
                    errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 dark:border-zinc-700"
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`block w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-10 text-sm focus:ring-2 dark:bg-zinc-800 dark:text-white ${
                    errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 dark:border-zinc-700"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}