'use client';

import React, { useState } from 'react';
import { OTPInput } from 'input-otp';
import { cn } from '@/lib/utils';
import { getContentConfig } from '@/lib/constants';
import { useProfileOperations } from '@/hooks/useProfileOperations';
import { useSnackbar } from '@/components/snackbar/use-snackbar';

export interface LoginProps {
  className?: string;
}

const Login: React.FC<LoginProps> = ({ className }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const contentConfig = getContentConfig();
  const { sendOtp, verifyOtp } = useProfileOperations();
  const { showSnackbar } = useSnackbar();

  const OTP_LENGTH = 6;

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
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 10);
  };

  const handleMobileChange = (value: string) => {
    setMobileNumber(formatMobileNumber(value));
  };

  const handleSendOtp = async () => {
    if (mobileNumber.length === 10) {
      if (isSendingOtp) return;

      setIsSendingOtp(true);
      try {
        const phoneNumber = `+91${mobileNumber}`;
        await sendOtp(phoneNumber);
        setIsOtpSent(true);
        startCountdown();
        showSnackbar('OTP sent successfully!', 'success');
      } catch (error: any) {
        console.error("sendOtp error:", error);
        const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to send OTP');
        
        if (errorMessage.includes('User is not created') || errorMessage.includes('not registered')) {
          showSnackbar('User not found. Redirecting to sign up...', 'info');
          setTimeout(() => {
            window.location.href = `/signup?mobile=${mobileNumber}`;
          }, 1500);
        } else {
          showSnackbar(errorMessage, 'error');
        }
      } finally {
        setIsSendingOtp(false);
      }
    } else {
      showSnackbar(contentConfig.auth.login.errors.invalidMobile, 'error');
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

    if (otp.length !== OTP_LENGTH) {
      showSnackbar('Please enter a valid OTP', 'error');
      return;
    }

    if (isVerifying) return;

    setIsVerifying(true);
    try {
      const phoneNumber = `+91${mobileNumber}`;
      await verifyOtp(phoneNumber, parseInt(otp));
      showSnackbar('Login successful!', 'success');
      window.location.href = '/dashboard';
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Login failed', 'error');
      setIsVerifying(false);
    }
  };

  // Footer Component
  const renderFooter = () => (
    <div className="space-y-4 pt-6">
      <div className="border-t border-[#E5E5E5]" />
      <p className="text-center text-sm text-[#BCBCBC]">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-[#131313] underline underline-offset-2 hover:no-underline">
          Terms of service
        </a>
        {' '}&{' '}
        <a href="/privacy" className="text-[#131313] underline underline-offset-2 hover:no-underline">
          Privacy policy
        </a>
      </p>
    </div>
  );

  // Powered By Footer
  const renderPoweredBy = () => (
    <p className="text-center text-sm text-[#BCBCBC] mt-8">
      Powered by SalesHQ
    </p>
  );

  // ============ LOGIN SCREEN (Mobile Number Input) ============
  if (!isOtpSent) {
    return (
      <div className={cn('min-h-screen', className)}>
        {/* Desktop Layout */}
        <div className="hidden lg:flex min-h-screen">
          {/* Left Yellow Panel */}
          <div className="w-[45%] bg-[#FFE887] rounded-r-[40px] flex items-center justify-center">
            <span className="text-[#C4B87A] text-xl font-medium">Image</span>
          </div>

          {/* Right White Panel */}
          <div className="flex-1 bg-white flex flex-col justify-center items-center px-12">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="mb-8">
                <p className="text-[#BCBCBC] text-base mb-2">Let&apos;s get started</p>
                <h1 className="text-3xl font-bold text-[#131313]">Login/Sign up</h1>
              </div>

              {/* Form */}
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-6">
                  {/* Label */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#131313]">
                      Mobile Number <span className="text-[#BCBCBC]">*</span>
                    </label>

                    {/* Input with country code */}
                    <div className="flex items-center border border-[#E5E5E5] rounded-xl overflow-hidden bg-white">
                      <div className="flex items-center gap-2 px-4 py-4 border-r border-[#E5E5E5] bg-white cursor-pointer hover:bg-gray-50">
                        <span className="text-lg">🇮🇳</span>
                        <span className="text-[#131313] font-medium">+91</span>
                        <svg className="w-4 h-4 text-[#BCBCBC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="Enter 10 digit mobile number"
                        value={mobileNumber}
                        onChange={(e) => handleMobileChange(e.target.value)}
                        className="flex-1 px-4 py-4 text-[#131313] placeholder:text-[#BCBCBC] focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={mobileNumber.length !== 10 || isSendingOtp}
                    className={cn(
                      "w-full py-4 rounded-full font-semibold text-base transition-all duration-200",
                      "bg-[#131313] text-white hover:bg-[#2a2a2a]",
                      (mobileNumber.length !== 10 || isSendingOtp) && "opacity-90"
                    )}
                  >
                    {isSendingOtp ? 'Sending...' : 'Continue'}
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-[#131313]">
                    Don&apos;t have an account?{' '}
                    <a 
                      href="/signup" 
                      className="text-[#131313] font-semibold underline underline-offset-2 hover:no-underline"
                    >
                      Sign Up
                    </a>
                  </p>
                </div>

                {renderFooter()}
              </form>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden min-h-screen flex flex-col">
          {/* Top Yellow Section */}
          <div className="flex-1 min-h-[40vh] bg-[#FFE887]" />

          {/* Bottom White Card */}
          <div className="bg-white rounded-t-[32px] -mt-8 flex flex-col px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <p className="text-[#BCBCBC] text-base mb-2">Let&apos;s get started</p>
              <h1 className="text-2xl font-bold text-[#131313]">Login/Sign up</h1>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                {/* Label */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#131313]">
                    Mobile Number <span className="text-[#BCBCBC]">*</span>
                  </label>

                  {/* Input with country code */}
                  <div className="flex items-center border border-[#E5E5E5] rounded-xl overflow-hidden bg-white">
                    <div className="flex items-center gap-2 px-3 py-4 border-r border-[#E5E5E5] bg-white">
                      <span className="text-base">🇮🇳</span>
                      <span className="text-[#131313] font-medium text-sm">+91</span>
                      <svg className="w-3 h-3 text-[#BCBCBC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter 10 digit mobile number"
                      value={mobileNumber}
                      onChange={(e) => handleMobileChange(e.target.value)}
                      className="flex-1 px-3 py-4 text-[#131313] placeholder:text-[#BCBCBC] text-sm focus:outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={mobileNumber.length !== 10 || isSendingOtp}
                  className={cn(
                    "w-full py-4 rounded-full font-semibold text-base transition-all duration-200",
                    "bg-[#131313] text-white hover:bg-[#2a2a2a]",
                    (mobileNumber.length !== 10 || isSendingOtp) && "opacity-90"
                  )}
                >
                  {isSendingOtp ? 'Sending...' : 'Continue'}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-[#131313]">
                  Don&apos;t have an account?{' '}
                  <a 
                    href="/signup" 
                    className="text-[#131313] font-semibold underline underline-offset-2 hover:no-underline"
                  >
                    Sign Up
                  </a>
                </p>
              </div>

              {renderFooter()}
            </form>

            {renderPoweredBy()}
          </div>
        </div>
      </div>
    );
  }

  // ============ OTP VERIFICATION SCREEN ============
  return (
    <div className={cn('min-h-screen', className)}>
      {/* Desktop Layout - Centered Card on Gray Background */}
      <div className="hidden lg:flex min-h-screen bg-[#F5F5F5] items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-lg p-12 w-full max-w-lg">
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#131313]">
                  Enter verification code
                </h2>
                <p className="text-sm text-[#BCBCBC]">
                  We have sent a verification code to
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#131313]">
                    +91 {mobileNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false);
                      setOtp('');
                    }}
                    className="text-sm font-medium text-blue-500 hover:text-blue-600"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* OTP Input Boxes */}
              <OTPInput
                maxLength={OTP_LENGTH}
                value={otp}
                onChange={setOtp}
                containerClassName="flex justify-start gap-3"
                render={({ slots }) => (
                  <>
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-12 h-14 rounded-xl border-2 text-center text-xl font-semibold transition-all duration-200 flex items-center justify-center bg-white",
                          slot.isActive ? "border-[#131313]" : slot.char ? "border-[#131313]" : "border-[#E5E5E5]"
                        )}
                      >
                        {slot.char ?? (slot.isActive && <span className="animate-pulse">|</span>)}
                      </div>
                    ))}
                  </>
                )}
              />

              {/* Timer */}
              <div className="flex items-center gap-2 text-sm text-[#BCBCBC]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
                </svg>
                <span>00:{countdown.toString().padStart(2, '0')}</span>
                {countdown === 0 && (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isSendingOtp}
                    className="ml-2 text-blue-500 hover:text-blue-600 font-medium"
                  >
                    {isSendingOtp ? 'Sending...' : 'Resend'}
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={otp.length !== OTP_LENGTH || isVerifying}
                className={cn(
                  "w-full py-4 rounded-full font-semibold text-base transition-all duration-200",
                  otp.length === OTP_LENGTH && !isVerifying
                    ? "bg-[#131313] text-white hover:bg-[#2a2a2a]"
                    : "bg-[#D1D1D1] text-white cursor-not-allowed"
                )}
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>

            {renderFooter()}
          </form>

          {renderPoweredBy()}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col bg-white">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#F5F5F5]">
          <button
            type="button"
            onClick={() => {
              setIsOtpSent(false);
              setOtp('');
            }}
            className="p-2 -ml-2"
          >
            <svg className="w-6 h-6 text-[#131313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className="text-sm font-medium text-[#131313] px-3 py-1 rounded-full border border-[#E5E5E5]"
          >
            Skip
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6">
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#131313]">
                  Enter verification code
                </h2>
                <p className="text-sm text-[#BCBCBC]">
                  We have sent a verification code to
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#131313]">
                    +91 {mobileNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false);
                      setOtp('');
                    }}
                    className="text-sm font-medium text-blue-500 hover:text-blue-600"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* OTP Input Boxes */}
              <OTPInput
                maxLength={OTP_LENGTH}
                value={otp}
                onChange={setOtp}
                containerClassName="flex justify-start gap-2"
                render={({ slots }) => (
                  <>
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-11 h-12 rounded-xl border-2 text-center text-lg font-semibold transition-all duration-200 flex items-center justify-center bg-white",
                          slot.isActive ? "border-[#131313]" : slot.char ? "border-[#131313]" : "border-[#E5E5E5]"
                        )}
                      >
                        {slot.char ?? (slot.isActive && <span className="animate-pulse">|</span>)}
                      </div>
                    ))}
                  </>
                )}
              />

              {/* Timer */}
              <div className="flex items-center gap-2 text-sm text-[#BCBCBC]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
                </svg>
                <span>00:{countdown.toString().padStart(2, '0')}</span>
                {countdown === 0 && (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isSendingOtp}
                    className="ml-2 text-blue-500 hover:text-blue-600 font-medium"
                  >
                    {isSendingOtp ? 'Sending...' : 'Resend'}
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={otp.length !== OTP_LENGTH || isVerifying}
                className={cn(
                  "w-full py-4 rounded-full font-semibold text-base transition-all duration-200",
                  otp.length === OTP_LENGTH && !isVerifying
                    ? "bg-[#131313] text-white hover:bg-[#2a2a2a]"
                    : "bg-[#D1D1D1] text-white cursor-not-allowed"
                )}
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
