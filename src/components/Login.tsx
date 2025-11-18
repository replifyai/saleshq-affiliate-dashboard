'use client';

import React, { useState, useRef } from 'react';
import Button from './common/Button';
import TextField from './common/TextField';
import Toggle from './common/Toggle';
import { cn } from '@/lib/utils';
import { getContentConfig, getFeatureConfig } from '@/lib/constants';
import { useProfileOperations } from '@/hooks/useProfileOperations';
import { useSnackbar } from '@/components/snackbar/use-snackbar';

export interface LoginProps {
  className?: string;
}

const Login: React.FC<LoginProps> = ({ className }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputsRef = useRef<Array<HTMLInputElement | null>>([]);
  
  // Get configuration
  const contentConfig = getContentConfig();
  const featureConfig = getFeatureConfig();
  
  // Profile operations and snackbar
  const { sendOtp, verifyOtp } = useProfileOperations();
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
    // Validate mobile number and send OTP
    if (mobileNumber.length === 10) {
      if (isSendingOtp) return; // Prevent double clicks
      
      setIsSendingOtp(true);
      try {
        const phoneNumber = `+91${mobileNumber}`;
        await sendOtp(phoneNumber);
        setIsOtpSent(true);
        startCountdown();
        showSnackbar('OTP sent successfully!', 'success');
      } catch (error) {
        showSnackbar(error instanceof Error ? error.message : 'Failed to send OTP', 'error');
      } finally {
        setIsSendingOtp(false);
      }
    } else {
      showSnackbar(contentConfig.auth.login.errors.invalidMobile, 'error');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1); // keep only last digit
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

  const handleLogin = async (e: React.FormEvent) => {
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
      showSnackbar('Login successful!', 'success');
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Login failed', 'error');
      setIsVerifying(false); // Only reset on error; success redirects anyway
    }
  };

  return (
  <div className={cn('flex min-h-screen' , className)}>
      {/* Left Panel - Background Image & Branding */}
      <div className="hidden rounded-tr-3xl rounded-br-3xl lg:flex lg:w-3/5 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
          style={{
            backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/replify-9f49f.firebasestorage.app/o/images%2FzDO0ZxFXrxadSzqhNFpWxDOA74.avif?alt=media&token=2afab80e-0cae-4818-a566-4a01c7edb3d8")`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start px-8 xl:px-12 text-white">
          <div className="space-y-3">
            <h2 className="text-xs sm:text-sm font-medium uppercase tracking-wider text-white opacity-90">
              {contentConfig.navigation.logo.toUpperCase()}:
            </h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-white leading-snug">
              {contentConfig.navigation.logo.toUpperCase()} PROGRAM
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mt-3 sm:mt-4 max-w-md">
              {contentConfig.auth.login.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 lg:w-2/5 flex flex-col justify-center items-center px-6 sm:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {contentConfig.auth.login.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {contentConfig.auth.login.subtitle}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            {!isOtpSent ? (
              <>
                <TextField
                  label={contentConfig.auth.login.mobileLabel}
                  type="tel"
                  placeholder={contentConfig.auth.login.mobilePlaceholder}
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
                
                {featureConfig.auth.enableRememberMe && (
                  <Toggle
                    checked={rememberMe}
                    onChange={setRememberMe}
                    label={contentConfig.auth.login.rememberMeText}
                    className="justify-start"
                  />
                )}

                <Button
                  type="button"
                  onClick={handleSendOtp}
                  size="lg"
                  className="w-full bg-primary-gradient font-bold text-base sm:text-lg py-3.5 sm:py-4"
                  disabled={mobileNumber.length !== 10 || isSendingOtp}
                >
                  {isSendingOtp ? 'Sending...' : contentConfig.auth.login.sendOtpText}
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
                    {isSendingOtp
                      ? 'Sending...'
                      : contentConfig.auth.login.resendOtpText}
                  </button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-4 w-full bg-primary-gradient text-black font-bold text-base sm:text-lg py-3.5 sm:py-4"
                  disabled={otp.length !== featureConfig.auth.otpLength || isVerifying}
                >
                  {isVerifying ? 'Verifying...' : contentConfig.auth.login.verifyText}
                </Button>
              </>
            )}
          </form>

          {/* Sign Up Link */}
          {featureConfig.auth.enableRegistration && (
            <div className="text-center space-y-6">
              <p className="text-foreground">
                New to our affiliate program?{' '}
                <a 
                  href="/signup" 
                  className="text-primary hover:text-primary-hover font-semibold underline decoration-2 underline-offset-4 transition-colors"
                >
                  {contentConfig.navigation.cta.text}
                </a>
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border pt-6 mt-8">
            <div className="text-center text-muted-foreground text-sm">
              <p className="mb-2">
                {contentConfig.footer.copyright}
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                {contentConfig.footer.links.map((link, index) => (
                  <React.Fragment key={link.href}>
                    <a href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </a>
                    {index < contentConfig.footer.links.length - 1 && <span>|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;