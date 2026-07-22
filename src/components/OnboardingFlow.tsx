'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Plus, X } from 'lucide-react';
import Button from './common/Button';
import TextField from './common/TextField';
import { useProfile } from '@/contexts/ProfileContext';
import { SocialMediaHandle } from '@/types/api';
import apiClient from '@/services/apiClient';

interface OnboardingData {
  creatorName: string;
  email: string;
  socialHandles: {
    platform: string;
    handle: string;
  }[];
}

const STEP_TITLES = ['Tell us about you', 'Add your email', 'Connect your socials'] as const;
const TOTAL_STEPS = STEP_TITLES.length;

const OnboardingFlow: React.FC = () => {
  const router = useRouter();
  const { state, updateProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    creatorName: '',
    email: '',
    socialHandles: []
  });

  // Pre-populate data from existing profile
  useEffect(() => {
    if (state.profile) {
      setData({
        creatorName: state.profile.name || '',
        email: state.profile.email || '',
        socialHandles: state.profile.socialMediaHandles?.map(handle => ({
          platform: handle.platform,
          handle: handle.handle
        })) || []
      });
    }
  }, [state.profile]);

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  // Header back: step back if mid-flow, otherwise leave onboarding
  const handleBack = () => {
    if (currentStep > 1) prevStep();
    else router.back();
  };

  const skipStep = () => {
    if (currentStep < TOTAL_STEPS) nextStep();
    else handleComplete();
  };

  const handleComplete = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    // Approval status won't change from a profile update, so capture it up front
    const isPending = state.profile?.approved === 'pending';

    try {
      const socialMediaHandles: SocialMediaHandle[] = data.socialHandles
        .filter(handle => handle.platform && handle.handle)
        .map(handle => ({
          platform: handle.platform.toLowerCase() as SocialMediaHandle['platform'],
          handle: handle.handle
        }));

      await updateProfile({
        name: data.creatorName || state.profile?.name,
        email: data.email || null,
        socialMediaHandles: socialMediaHandles.length > 0 ? socialMediaHandles : undefined
      });

      router.push(isPending ? '/profile' : '/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still redirect on error to avoid blocking the user
      router.push(isPending ? '/profile' : '/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CreatorNameStep data={data} setData={setData} onNext={nextStep} />;
      case 2:
        return <EmailStep data={data} setData={setData} onNext={nextStep} />;
      case 3:
        return (
          <SocialHandlesStep
            data={data}
            setData={setData}
            onComplete={handleComplete}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F0F0F0] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FFFAE6]/70 to-white border-b border-[#FFD100]/40">
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-lg leading-none">←</span>
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={skipStep}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Skip
            </button>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#131313]/50">
              Profile Setup · Step {currentStep} of {TOTAL_STEPS}
            </p>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-semibold text-foreground">
              {STEP_TITLES[currentStep - 1]}
            </h1>

            {/* Segmented progress */}
            <div className="mt-4 flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    index < currentStep ? 'bg-[#FFD100]' : 'bg-[#FFD100]/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          {/* key forces the snappy fade on each step change */}
          <div key={currentStep} className="animate-fade-in bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-8 shadow-sm">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 1: Creator Name
const CreatorNameStep: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
}> = ({ data, setData, onNext }) => {
  const handleNext = () => {
    if (data.creatorName.trim()) onNext();
  };

  return (
    <div className="space-y-7">
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">What&apos;s your creator name?</h2>
        <p className="text-sm text-muted-foreground">
          This is how you&apos;ll be known in our affiliate program.
        </p>
      </div>

      <TextField
        label="Creator Name"
        placeholder="Enter your creator name"
        value={data.creatorName}
        onChange={(value) => setData(prev => ({ ...prev, creatorName: value }))}
        className="w-full"
      />

      <Button
        onClick={handleNext}
        size="lg"
        className="w-full"
        disabled={!data.creatorName.trim()}
      >
        Continue
      </Button>
    </div>
  );
};

// Step 2: Email Address
const EmailStep: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
}> = ({ data, setData, onNext }) => {
  const [emailError, setEmailError] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (value: string) => {
    setData(prev => ({ ...prev, email: value }));
    if (emailError) setEmailError('');
  };

  const handleNext = async () => {
    if (!data.email.trim()) {
      setEmailError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(data.email)) {
      setEmailError('Please enter a valid email address (e.g., name@example.com).');
      return;
    }

    setIsChecking(true);
    setEmailError('');

    try {
      const result = await apiClient.checkCreatorEmail(data.email.trim());
      if (result.exists) {
        setEmailError('This email is already registered with another creator account. Please use a different email.');
        return;
      }
      onNext();
    } catch (error) {
      console.error('Error checking email:', error);
      // On API error, still allow proceeding to avoid blocking the user
      onNext();
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">What&apos;s your email address?</h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll use this to send you important updates and earnings reports.
        </p>
      </div>

      <TextField
        label="Email Address"
        placeholder="your.email@example.com"
        value={data.email}
        onChange={handleEmailChange}
        className="w-full"
        type="email"
        error={emailError}
      />

      <Button
        onClick={handleNext}
        size="lg"
        className="w-full"
        disabled={!data.email || !isValidEmail(data.email) || isChecking}
      >
        {isChecking ? 'Checking…' : 'Continue'}
      </Button>
    </div>
  );
};

// Step 3: Social Media Handles
const PLATFORMS = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Facebook', 'LinkedIn'];

const SocialHandlesStep: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onComplete: () => void;
  isSubmitting: boolean;
}> = ({ data, setData, onComplete, isSubmitting }) => {
  const [newHandle, setNewHandle] = useState({ platform: '', handle: '' });

  const addHandle = () => {
    if (newHandle.platform && newHandle.handle.trim()) {
      setData(prev => ({
        ...prev,
        socialHandles: [...prev.socialHandles, { platform: newHandle.platform, handle: newHandle.handle.trim() }]
      }));
      setNewHandle({ platform: '', handle: '' });
    }
  };

  const removeHandle = (index: number) => {
    setData(prev => ({
      ...prev,
      socialHandles: prev.socialHandles.filter((_, i) => i !== index)
    }));
  };

  const inputClasses =
    'w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-white text-foreground text-sm focus:outline-none focus:border-[#FFD100] focus:ring-2 focus:ring-[#FFD100]/30 transition-colors';

  return (
    <div className="space-y-7">
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">Add your social handles</h2>
        <p className="text-sm text-muted-foreground">
          Optional, but it helps us verify your creator presence faster.
        </p>
      </div>

      {/* Add row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <select
          value={newHandle.platform}
          onChange={(e) => setNewHandle(prev => ({ ...prev, platform: e.target.value }))}
          className={`${inputClasses} sm:w-40 shrink-0`}
        >
          <option value="">Platform</option>
          {PLATFORMS.map(platform => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="@username or link"
          value={newHandle.handle}
          onChange={(e) => setNewHandle(prev => ({ ...prev, handle: e.target.value }))}
          onKeyDown={(e) => { if (e.key === 'Enter') addHandle(); }}
          className={`${inputClasses} flex-1`}
        />
        <button
          type="button"
          onClick={addHandle}
          disabled={!newHandle.platform || !newHandle.handle.trim()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFE887] text-[#131313] text-sm font-semibold hover:bg-[#FFD54F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Chips */}
      {data.socialHandles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.socialHandles.map((handle, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-[#FFFAE6] border border-[#FFD100]/40 text-sm text-foreground"
            >
              <span className="font-medium capitalize">{handle.platform}</span>
              <span className="text-muted-foreground max-w-[160px] truncate">{handle.handle}</span>
              <button
                type="button"
                onClick={() => removeHandle(index)}
                className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-[#FFD100]/30 hover:text-foreground transition-colors"
                aria-label={`Remove ${handle.platform}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Button
        onClick={onComplete}
        size="lg"
        className="w-full gap-2"
        disabled={isSubmitting}
      >
        {!isSubmitting && <Check className="h-5 w-5" />}
        {isSubmitting ? 'Saving…' : 'Complete Setup'}
      </Button>
    </div>
  );
};

export default OnboardingFlow;
