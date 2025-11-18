'use client';

import React, { useState, useRef } from 'react';
import Button from './common/Button';
import TextField from './common/TextField';
import { cn } from '@/lib/utils';
import { getContentConfig, getFeatureConfig } from '@/lib/constants';
import { useProfileOperations } from '@/hooks/useProfileOperations';
import { useSnackbar } from '@/components/snackbar/use-snackbar';

export interface SignupProps {
  className?: string;
}

const Signup: React.FC<SignupProps> = ({ className }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputsRef = useRef<Array<HTMLInputElement | null>>([]);
  
  // Get configuration
  const contentConfig = getContentConfig();
  const featureConfig = getFeatureConfig();
  
  // Profile operations and snackbar
  const { createProfile, sendOtp, verifyOtp } = useProfileOperations();
  const { showSnackbar } = useSnackbar();

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

  const handleSendOtp = async () => {
    // Validate mobile number and name, then create profile and send OTP
    if (mobileNumber.length === 10 && name.trim()) {
      if (isCreatingProfile) return; // Prevent double clicks
      
      setIsCreatingProfile(true);
      try {
        const phoneNumber = `+91${mobileNumber}`;
        await createProfile(phoneNumber, name.trim());
        setIsOtpSent(true);
        startCountdown();
        showSnackbar('Profile created and OTP sent successfully!', 'success');
      } catch (error) {
        showSnackbar(error instanceof Error ? error.message : 'Failed to create profile', 'error');
      } finally {
        setIsCreatingProfile(false);
      }
    } else {
      if (mobileNumber.length !== 10) {
        showSnackbar('Please enter a valid 10-digit mobile number', 'error');
      } else if (!name.trim()) {
        showSnackbar('Please enter your name', 'error');
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const otpArray = otp.split('');

    if (digit) {
      otpArray[index] = digit;
    } else {
      otpArray[index] = '';
    }

    const newOtp = otpArray.join('').slice(0, featureConfig.auth.otpLength);
    setOtp(newOtp);

    if (digit && index < featureConfig.auth.otpLength - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (countdown === 0 && !isSendingOtp) {
      setIsSendingOtp(true);
      try {
        const phoneNumber = `+91${mobileNumber}`;
        await sendOtp(phoneNumber);
        startCountdown();
        showSnackbar('OTP resent successfully!', 'success');
      } catch (error) {
        showSnackbar(error instanceof Error ? error.message : 'Failed to resend OTP', 'error');
      } finally {
        setIsSendingOtp(false);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== featureConfig.auth.otpLength) {
      showSnackbar('Please enter a valid OTP', 'error');
      return;
    }
    
    if (isVerifying) return; // Prevent double clicks
    
    setIsVerifying(true);
    try {
      const phoneNumber = `+91${mobileNumber}`;
      await verifyOtp(phoneNumber, parseInt(otp)); // Pass OTP as number
      showSnackbar('Signup successful!', 'success');
      // Redirect to onboarding flow
      window.location.href = '/onboarding';
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Signup failed', 'error');
      setIsVerifying(false); // Only reset on error; success redirects anyway
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
        <div className="relative z-10 flex flex-col justify-center items-start px-8 xl:px-12 text-white">
          <div className="space-y-3">
            <h2 className="text-xs sm:text-sm font-medium uppercase tracking-wider opacity-75">
              JOIN THE PROGRAM
            </h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug">
              AFFILIATE PROGRAM
            </h3>
            <p className="text-sm sm:text-base opacity-90 mt-3 sm:mt-4 max-w-md">
              Start your journey as a creator and earn with us
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 lg:w-3/5 bg-card flex flex-col justify-center items-center px-6 sm:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Join Our Program
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Create your account and start earning
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5 sm:space-y-6">
            {!isOtpSent ? (
              <>
                <TextField
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(value) => setName(value)}
                  required
                  className="w-full"
                />

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
                    We&apos;ll send OTP to +91 {mobileNumber}
                  </p>
                )}

                <Button
                  type="button"
                  onClick={handleSendOtp}
                  size="lg"
                  className="w-full bg-primary-gradient font-bold text-base sm:text-lg py-3.5 sm:py-4"
                  disabled={mobileNumber.length !== 10 || !name.trim() || isCreatingProfile}
                >
                  {isCreatingProfile ? 'Creating Profile...' : 'Create Profile & Send OTP'}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2 text-center">
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                    Enter Verification Code
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    We have sent a verification code to{' '}
                    <span className="font-medium text-foreground">
                      +91 {mobileNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="ml-2 text-primary font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </p>
                </div>

                <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                  {Array.from({ length: featureConfig.auth.otpLength }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={(el: HTMLInputElement | null) => {
                        otpInputsRef.current[index] = el;
                      }}
                      className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl border border-white bg-gray-800 text-white text-center text-lg sm:text-xl font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-white/80"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 sm:mt-4 text-[11px] sm:text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>⏱</span>
                    <span>00:{countdown.toString().padStart(2, '0')}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isSendingOtp}
                    className={cn(
                      'font-medium',
                      countdown > 0 || isSendingOtp
                        ? 'text-muted-foreground cursor-not-allowed'
                        : 'text-primary hover:text-primary-hover'
                    )}
                  >
                    {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-4 w-full bg-primary-gradient text-black font-bold text-base sm:text-lg py-3.5 sm:py-4"
                  disabled={otp.length !== featureConfig.auth.otpLength || isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Continue'}
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