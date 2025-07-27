"use client";

import { useState } from 'react';
import Image from "next/image";
import { createClient } from '@/lib/supabase';

interface EmailSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailSignupModal({ isOpen, onClose }: EmailSignupModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const supabase = createClient();

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    setIsLoading(true);
    setStatusMessage('');

    try {
      // First check if the email exists in our guests table
      const { data: guest } = await supabase
        .from('guests')
        .select('email')
        .eq('email', email)
        .single();

      if (!guest) {
        setStatusMessage('Email not found. Please contact the wedding organizers if you think this is an error.');
        setIsLoading(false);
        return;
      }

      // Send OTP
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        setStatusMessage('Error sending magic link. Please try again.');
        console.error('Error:', error);
      } else {
        setStatusMessage('Check your email for the magic link to sign in!');
      }
    } catch (error) {
      setStatusMessage('Error sending magic link. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* SVG Filters for rough effects */}
      <svg className="absolute w-0 h-0" style={{ visibility: 'hidden' }}>
        <defs>
          <filter id="modal-rough-border" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
              baseFrequency="0.15" 
              numOctaves="3" 
              result="modalNoise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="modalNoise" 
              scale="3"
              result="roughModalBorder"
            />
          </filter>
          
          <filter id="signin-rough-border" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence 
              baseFrequency="0.25" 
              numOctaves="2" 
              result="signinNoise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="signinNoise" 
              scale="2"
              result="roughSigninBorder"
            />
          </filter>
          
          <filter id="signin-button-rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence 
              baseFrequency="0.3" 
              numOctaves="2" 
              result="buttonNoise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="buttonNoise" 
              scale="1.5"
              result="roughButton"
            />
          </filter>
        </defs>
      </svg>
      
      <div 
        className="bg-[#1E1300] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative border-4 border-[#CE7200] shadow-2xl"
        style={{ filter: 'url(#modal-rough-border)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#CE7200] hover:text-yellow-500 text-3xl font-bold z-10 transition-colors"
        >
          ×
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mb-4 bg-[#CE7200] p-4 rounded-lg inline-block">
              <Image
                src="/img/yishanandyitong.svg"
                alt="Yishan and Yitong"
                width={300}
                height={80}
                className="mx-auto filter brightness-0"
              />
            </div>
          </div>

          {/* Sign In Form */}
          <div 
            className="max-w-md mx-auto p-6 rounded-lg bg-[#2E2000] border-2 border-[#CE7200]"
            style={{ filter: 'url(#signin-rough-border)' }}
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-[#CE7200] font-gooper-semibold">
              Sign In
            </h2>
            <p className="text-center mb-6 text-yellow-500">
              Enter your email to access your wedding invitation and RSVP
            </p>
            
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 bg-[#1E1300] border-2 border-[#CE7200] text-yellow-500 placeholder-yellow-700 focus:ring-[#CE7200] focus:ring-offset-2 focus:ring-offset-[#2E2000]"
                />
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-lg transition-all bg-[#CE7200] text-[#1E1300] font-gooper-semibold hover:bg-yellow-600 hover:shadow-lg disabled:bg-gray-700 text-lg"
                style={{ filter: 'url(#signin-button-rough)' }}
              >
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
            
            {statusMessage && (
              <div className={`mt-4 p-4 rounded-lg ${
                statusMessage.includes('Error') || statusMessage.includes('not found') 
                  ? 'bg-red-900/20 text-red-400 border border-red-800'
                  : 'bg-green-900/20 text-green-400 border border-green-800'
              }`}>
                {statusMessage}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#CE7200] opacity-80">
              Only invited guests can access the wedding details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 