"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getForgotPassword } from '@/app/services/api/apiService';

// ✅ Schema
const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      setIsLoading(true);

      console.log("Request Body:", data);

      // 👉 Call your API here
      await getForgotPassword(data)

      router.push("/auth/login");

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-8 shadow-sm dark:bg-zinc-900">
  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <span className="text-2xl font-bold">N</span>
                    </div>
                       <div className="text-center">
          <h2 className="text-2xl font-bold">Forgot Password</h2>
          <p className="text-sm text-gray-500">Reset your password</p>
        </div>
                </div>
       

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email */}
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

          {/* New Password */}
          <div className="relative">
            <input
              {...register("newPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="w-full p-2 border rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs">{errors.newPassword.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
}