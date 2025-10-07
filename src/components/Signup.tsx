'use client';

import React, { useState } from 'react';
import Button from './common/Button';
import TextField from './common/TextField';
import { cn } from '@/lib/utils';
import { getContentConfig, getFeatureConfig, formatContent } from '@/lib/constants';

export interface SignupProps {
  className?: string;
}

const Signup: React.FC<SignupProps> = ({ className }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Get configuration
  const contentConfig = getContentConfig();
  const featureConfig = getFeatureConfig();

  const startCountdown = () => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatMobileNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 10 digits
    return digits.slice(0, 10);
  };

  const handleMobileChange = (value: string) => {
    setMobileNumber(formatMobileNumber(value));
  };

  const handleSendOtp = () => {
    // Validate mobile number and send OTP
    if (mobileNumber.length === 10) {
      setIsOtpSent(true);
      startCountdown();
      console.log('OTP sent to:', mobileNumber);
    } else {
      alert('Please enter a valid 10-digit mobile number');
    }
  };

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to configured OTP length
    const digits = value.replace(/\D/g, '').slice(0, featureConfig.auth.otpLength);
    setOtp(digits);
  };

  const handleResendOtp = () => {
    if (countdown === 0) {
      startCountdown();
      console.log('OTP resent to:', mobileNumber);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OTP verification and proceed to onboarding
    if (otp.length === featureConfig.auth.otpLength) {
      // Redirect to onboarding flow (now in authenticated pages)
      window.location.href = '/onboarding';
    }
  };

  return (
    <div className={cn('flex min-h-screen', className)}>
      {/* Left Panel - Background Image & Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%238B5CF6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236366F1;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23grad)' d='M0 0h800v600H0z'/%3E%3Cpath fill='%23ffffff' fill-opacity='0.1' d='M0 100c50 0 100 50 100 100s50 100 100 100 100-50 100-100 50-100 100-100 100 50 100 100s50 100 100 100v400H0V200z'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start px-12 text-white">
          <div className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wider opacity-75">
              JOIN THE PROGRAM
            </h2>
            <h3 className="text-4xl font-bold">
              AFFILIATE PROGRAM
            </h3>
            <p className="text-lg opacity-90 mt-4">
              Start your journey as a creator and earn with us
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 lg:w-3/5 bg-card flex flex-col justify-center items-center px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Join Our Program
            </h1>
            <p className="text-lg text-muted-foreground">
              Create your account and start earning
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            {!isOtpSent ? (
              <>
                <TextField
                  label="Mobile Number"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  required
                  className="w-full"
                />
                {mobileNumber && mobileNumber.length === 10 && (
                  <p className="text-xs text-secondary -mt-2">
                    We'll send OTP to +91 {mobileNumber}
                  </p>
                )}

                <Button
                  type="button"
                  onClick={handleSendOtp}
                  size="lg"
                  className="w-full bg-primary-gradient font-bold text-lg py-4"
                  disabled={mobileNumber.length !== 10}
                >
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <div className="bg-primary/10 border border-primary rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <p className="text-sm text-primary font-medium text-center">
                      OTP sent to +91 {mobileNumber.slice(0, 2)}***{mobileNumber.slice(7)}
                    </p>
                  </div>
                </div>

                <TextField
                  label="Enter OTP"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                  className="w-full text-center text-2xl font-mono tracking-widest"
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOtpSent(false)}
                    className="flex-1"
                  >
                    Change Number
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleResendOtp}
                    className="flex-1"
                    disabled={countdown > 0}
                  >
                    {countdown > 0 
                      ? `Resend in ${countdown}s`
                      : 'Resend OTP'
                    }
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary-gradient font-bold text-lg py-4"
                  disabled={otp.length !== featureConfig.auth.otpLength}
                >
                  Verify & Continue
                </Button>
              </>
            )}
          </form>

          {/* Login Link */}
          <div className="text-center space-y-6">
            <p className="text-foreground">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-primary hover:text-primary-hover font-semibold underline decoration-2 underline-offset-4 transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-border pt-6 mt-8">
            <div className="text-center text-muted-foreground text-sm">
              <p className="mb-2">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;