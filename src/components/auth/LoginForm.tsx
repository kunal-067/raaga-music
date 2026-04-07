// src/components/auth/LoginForm.tsx
// Login form with email/password, Google, and GitHub OAuth buttons
// Imports: react-hook-form, zod, next-auth signIn, lucide-react

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError(null);
    const res = await signIn('credentials', { ...data, redirect: false });
    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/main');
      router.refresh();
    }
  }

  async function handleOAuth(provider: 'google' | 'github') {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl: '/main' });
  }

  const inputCls = "w-full bg-[var(--raaga-bg)] border border-[var(--raaga-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--raaga-accent)] transition-colors placeholder:text-[var(--raaga-text3)]";

  return (
    < form onSubmit={handleSubmit(onSubmit)} className="space-y-3" >
      <div>
        <input {...register('email')} type="email" placeholder="Email address" className={inputCls} />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div className="relative">
        <input
          {...register('password')}
          type={showPw ? 'text' : 'password'}
          placeholder="Password"
          className={cn(inputCls, 'pr-12')}
        />
        <button
          type="button"
          onClick={() => setShowPw(!showPw)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--raaga-text3)]"
        >
          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {
        error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-red-400">
            {error}
          </div>
        )
      }

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[var(--raaga-accent)] text-black rounded-full text-sm font-bold hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Log in
      </button>
    </form >
  );
}

export const Divider = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-[var(--raaga-border)]" />
      <span className="text-xs text-[var(--raaga-text3)]">or</span>
      <div className="flex-1 h-px bg-[var(--raaga-border)]" />
    </div>
  )
}