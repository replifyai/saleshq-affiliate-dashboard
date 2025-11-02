'use client';

import React, { useState } from 'react';
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

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to configured OTP length
    const digits = value.replace(/\D/g, '').slice(0, featureConfig.auth.otpLength);
    setOtp(digits);
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
                  className="w-full bg-primary-gradient font-bold text-lg py-4"
                  disabled={mobileNumber.length !== 10 || !name.trim() || isCreatingProfile}
                >
                  {isCreatingProfile ? 'Creating Profile...' : 'Create Profile & Send OTP'}
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
                  placeholder={contentConfig.auth.login.otpPlaceholder}
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
                    disabled={countdown > 0 || isSendingOtp}
                  >
                    {isSendingOtp 
                      ? 'Sending...'
                      : countdown > 0 
                        ? `Resend in ${countdown}s`
                        : 'Resend OTP'
                    }
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary-gradient font-bold text-lg py-4"
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