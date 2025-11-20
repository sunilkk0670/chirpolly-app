import React, { useState, useEffect } from 'react';
import { ParrotIcon } from './icons/ParrotIcon';
import { Button } from './common/Button';
import { auth } from '../services/firebase';
import { reload, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const VerifyEmail: React.FC = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'sending' | 'checking' | 'sent' | 'verified' | 'error'>('checking');
  const [message, setMessage] = useState<string | null>(null);

  // Auto-check verification status when component mounts
  useEffect(() => {
    const checkVerification = async () => {
      try {
        if (!auth.currentUser) {
          setStatus('error');
          setMessage('Not signed in. Please log in again.');
          return;
        }

        await reload(auth.currentUser);

        if (auth.currentUser?.emailVerified) {
          setStatus('verified');
          setMessage('Email verified! Redirecting to home...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setStatus('idle');
        }
      } catch (e: any) {
        setStatus('idle');
        console.error('Auto-check failed:', e);
      }
    };

    checkVerification();
  }, [navigate]);

  const doResend = async () => {
    try {
      setStatus('sending');
      setMessage(null);
      if (!user) throw new Error('Not signed in');
      await sendEmailVerification(user);
      setStatus('sent');
      setMessage('Verification email sent. Please check your inbox.');
    } catch (e: any) {
      setStatus('error');
      setMessage(e?.message ?? 'Failed to send verification email.');
    }
  };

  const doCheck = async () => {
    try {
      setStatus('checking');
      if (!auth.currentUser) throw new Error('Not signed in');
      await reload(auth.currentUser);
      if (auth.currentUser?.emailVerified) {
        setStatus('verified');
        setMessage('Email verified! Redirecting to home...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setStatus('idle');
        setMessage('Still not verified. Please check your email and click the verification link.');
      }
    } catch (e: any) {
      setStatus('error');
      setMessage(e?.message ?? 'Failed to check status.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-teal-100 to-yellow-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 text-center animate-fade-in">
        <div className="flex flex-col items-center">
          <ParrotIcon className="h-16 w-auto" />
          <h1 className="mt-2 text-2xl font-bold text-slate-800">Verify your email</h1>
          <p className="text-sm text-slate-600 mt-2">
            {status === 'verified'
              ? 'Your email has been verified!'
              : 'We sent a verification link to your email. Please verify to continue.'}
          </p>
        </div>

        {message && <p className={`text-sm ${status === 'error' ? 'text-red-600' : status === 'verified' ? 'text-green-700' : 'text-teal-700'}`}>{message}</p>}

        {status === 'checking' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        )}

        {status !== 'verified' && status !== 'checking' && (
          <div className="space-y-3">
            <Button onClick={doResend} disabled={status === 'sending'} className="w-full">
              {status === 'sending' ? 'Sending…' : 'Resend verification'}
            </Button>
            <button onClick={doCheck} disabled={status === 'checking'} className="w-full inline-flex items-center justify-center gap-x-2 rounded-md bg-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-300">
              {status === 'checking' ? 'Checking…' : 'I\'ve verified — Continue'}
            </button>
          </div>
        )}

        {status === 'verified' && (
          <div className="flex justify-center">
            <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
