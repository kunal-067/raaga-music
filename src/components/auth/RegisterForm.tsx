// src/components/auth/RegisterForm.tsx
// Registration form with name, email, password validation via react-hook-form + zod
// Imports: react-hook-form, zod, next-auth signIn, lucide-react

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Registration failed'); return; }

      // Auto sign in
      await signIn('credentials', { email: data.email, password: data.password, redirect: false });
      toast.success('Account created! Welcome to Raaga 🎵');
      router.push('/main');
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  const inputCls = "w-full bg-[var(--raaga-bg)] border border-[var(--raaga-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--raaga-accent)] transition-colors placeholder:text-[var(--raaga-text3)]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input {...register('name')} placeholder="Full name" className={inputCls} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input {...register('email')} type="email" placeholder="Email address" className={inputCls} />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div className="relative">
        <input
          {...register('password')}
          type={showPw ? 'text' : 'password'}
          placeholder="Password (min 8 characters)"
          className={cn(inputCls, 'pr-12')}
        />
        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--raaga-text3)]">
          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <input
          {...register('confirmPassword')}
          type="password"
          placeholder="Confirm password"
          className={inputCls}
        />
        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-red-400">{error}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[var(--raaga-accent)] text-black rounded-full text-sm font-bold hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Create account
      </button>
    </form>
  );
}
