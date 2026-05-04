"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { log } from 'console';
import { getLogin } from '@/app/services/api/apiService';
import { useRouter } from 'next/navigation';

// 1. Define Validation Schema
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const router=useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "john@gmail.com", // Parameters from your request
            password: "123456",
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        getLogin(data, setIsLoading,router)
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 transition-colors dark:bg-zinc-950">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

                {/* Logo/Header */}
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <span className="text-2xl font-bold">N</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                        Log in to your NexBean account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                                Email address
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className={`block w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-3 text-sm transition-all focus:ring-2 dark:bg-zinc-800 dark:text-white ${errors.email
                                            ? "border-red-500 focus:ring-red-200"
                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-zinc-700"
                                        }`}
                                    placeholder="name@company.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    className={`block w-full rounded-lg border bg-gray-50 py-2.5 pl-10 pr-10 text-sm transition-all focus:ring-2 dark:bg-zinc-800 dark:text-white ${errors.password
                                            ? "border-red-500 focus:ring-red-200"
                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-zinc-700"
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-zinc-400">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-zinc-400">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up for free
                    </Link>
                </p>
            </div>
        </div>
    );
}