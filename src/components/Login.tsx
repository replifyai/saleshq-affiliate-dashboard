'use client';

import React, { useState } from 'react';
import Button from './common/Button';
import TextField from './common/TextField';
import Toggle from './common/Toggle';
import { cn } from '@/lib/utils';
import { getContentConfig, getFeatureConfig, formatContent } from '@/lib/constants';

export interface LoginProps {
  className?: string;
}

const Login: React.FC<LoginProps> = ({ className }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      alert(contentConfig.auth.login.errors.invalidMobile);
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OTP verification and login
    console.log('Login attempt:', { mobileNumber, otp, rememberMe });
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
        <div className="relative z-10 flex flex-col justify-center items-start px-12 text-white">
          <div className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wider text-white opacity-90">
              {contentConfig.navigation.logo.toUpperCase()}:
            </h2>
            <h3 className="text-4xl font-bold bg-clip-text text-white">
              {contentConfig.navigation.logo.toUpperCase()} PROGRAM
            </h3>
            <p className="text-lg text-gray-300 mt-4">
              {contentConfig.auth.login.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 lg:w-2/5 flex flex-col justify-center items-center px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              {contentConfig.auth.login.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {contentConfig.auth.login.subtitle}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
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
                    We'll send OTP to +91 {mobileNumber}
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
                  className="w-full bg-primary-gradient font-bold text-lg py-4"
                  disabled={mobileNumber.length !== 10}
                >
                  {contentConfig.auth.login.sendOtpText}
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
                  label={contentConfig.auth.login.otpLabel}
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
                    disabled={countdown > 0}
                  >
                    {countdown > 0 
                      ? formatContent(contentConfig.auth.login.countdownText, { seconds: countdown })
                      : contentConfig.auth.login.resendOtpText
                    }
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary-gradient text-white font-bold text-lg py-4"
                  disabled={otp.length !== featureConfig.auth.otpLength}
                >
                  {contentConfig.auth.login.verifyText}
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