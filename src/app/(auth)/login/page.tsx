'use client';

import { Divider, LoginForm } from '@/components/auth/LoginForm';
import { GithubAuthButton, GoogleAuthButton } from '@/components/auth/OAuth';
import { Music, Music4 } from 'lucide-react';
import { useState } from 'react';


// ─── Login Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);

  return (
    <>
      <div className="page">
        <div className="card">
          {/* Logo */}
          <div className="logo-wrap flex justify-center items-center flex-col">
            <div className="logo-icon">
              <Music4 color='black' fontWeight={900}/>
            </div>
            <div>
              <div className="logo-title">Raaga</div>
              <div className="logo-sub">Millions of songs, free forever.</div>
            </div>
          </div>

          {/* Server error */}
          {/* {serverError && <div className="server-error">{serverError}</div>} */}

          <div className="space-y-4">
            <GoogleAuthButton oauthLoading={oauthLoading} setOauthLoading={setOauthLoading} />
            <GithubAuthButton oauthLoading={oauthLoading} setOauthLoading={setOauthLoading} />

            <Divider/>
            {/* Form */}
            <LoginForm />
          </div>
          {/* Footer */}
          <div className="footer-text">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="footer-link">Sign up for free</a>
          </div>

          <div className="terms">
            By continuing, you agree to our{' '}
            <a href="/terms">Terms of Service</a> and{' '}
            <a href="/privacy">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </>
  );
}

const SuccessModal = () => {
  return (
    <div className="success-card">
      <div className="success-icon">🎵</div>
      <div className="success-title">You&apos;re in!</div>
      <div className="success-sub">Welcome to Raaga,.<br />Your account is ready.</div>
      <a href="/main" className="success-btn">Start listening</a>
    </div>
  )
}