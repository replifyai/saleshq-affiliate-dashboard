'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import Button from './common/Button';
import TextField from './common/TextField';
import { useProfile } from '@/contexts/ProfileContext';
import { SocialMediaHandle } from '@/types/api';

interface OnboardingData {
  creatorName: string;
  email: string;
  socialHandles: {
    platform: string;
    handle: string;
  }[];
}

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

  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalSteps = 3;

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

  useEffect(() => {
    // Animate container entrance
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    // Animate step transitions
    const currentStepElement = stepRefs.current[currentStep - 1];
    const previousStepElement = stepRefs.current[currentStep - 2];

    if (currentStepElement) {
      gsap.fromTo(currentStepElement,
        { opacity: 0, x: 100, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: "power2.out" }
      );
    }

    if (previousStepElement && currentStep > 1) {
      gsap.to(previousStepElement, {
        opacity: 0.3,
        x: -50,
        scale: 0.95,
        duration: 0.4,
        ease: "power2.inOut"
      });
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Convert social handles to API format
      const socialMediaHandles: SocialMediaHandle[] = data.socialHandles
        .filter(handle => handle.platform && handle.handle)
        .map(handle => ({
          platform: handle.platform.toLowerCase() as SocialMediaHandle['platform'],
          handle: handle.handle
        }));

      // Update profile with onboarding data
      await updateProfile({
        name: data.creatorName || state.profile?.name,
        email: data.email || null,
        socialMediaHandles: socialMediaHandles.length > 0 ? socialMediaHandles : undefined
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still redirect on error to avoid blocking the user
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CreatorNameStep data={data} setData={setData} onNext={nextStep} onSkip={skipStep} />;
      case 2:
        return <EmailStep data={data} setData={setData} onNext={nextStep} onPrev={prevStep} onSkip={skipStep} />;
      case 3:
        return (
          <SocialHandlesStep
            data={data}
            setData={setData}
            onComplete={handleComplete}
            onPrev={prevStep}
            onSkip={skipStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Top navigation (back + skip) */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-lg leading-none">←</span>
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={skipStep}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Title + step info + segmented progress */}
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Profile Setup
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                {currentStep === 1
                  ? 'Tell us about you'
                  : currentStep === 2
                  ? 'Add your email'
                  : 'Connect your socials'}
              </h1>
              <span className="text-xs text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
            </div>

            {/* Segmented progress bar */}
            <div className="mt-4 flex gap-1">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
          {renderStep()}
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
  onSkip: () => void;
}> = ({ data, setData, onNext, onSkip }) => {
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(stepRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const handleNext = () => {
    if (data.creatorName.trim()) {
      onNext();
    }
  };

  return (
    <div ref={stepRef} className="space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">What&apos;s your creator name?</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          This is how you&apos;ll be known in our affiliate program.
        </p>
      </div>

      <div className="space-y-6">
        <TextField
          label="Creator Name"
          placeholder="Enter your creator name"
          value={data.creatorName}
          onChange={(value) => setData(prev => ({ ...prev, creatorName: value }))}
          className="w-full text-lg"
        />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={onSkip}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            className="flex-1 bg-primary-gradient font-bold text-lg py-4"
            disabled={!data.creatorName.trim()}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step 2: Email Address
const EmailStep: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}> = ({ data, setData, onNext, onPrev, onSkip }) => {
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(stepRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = () => {
    if (data.email && isValidEmail(data.email)) {
      onNext();
    }
  };

  return (
    <div ref={stepRef} className="space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">What&apos;s your email address?</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          We&apos;ll use this to send you important updates and earnings reports.
        </p>
      </div>

      <div className="space-y-6">
        <TextField
          label="Email Address"
          placeholder="your.email@example.com"
          value={data.email}
          onChange={(value) => setData(prev => ({ ...prev, email: value }))}
          className="w-full text-lg"
          type="email"
        />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={onPrev}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={onSkip}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            className="flex-1 bg-primary-gradient font-bold text-lg py-4"
            disabled={!data.email || !isValidEmail(data.email)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Social Media Handles
const SocialHandlesStep: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onComplete: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isSubmitting: boolean;
}> = ({ data, setData, onComplete, onPrev, onSkip, isSubmitting }) => {
  const stepRef = useRef<HTMLDivElement>(null);
  const [newHandle, setNewHandle] = useState({ platform: '', handle: '' });

  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(stepRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const platforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Facebook', 'LinkedIn'];

  const addHandle = () => {
    if (newHandle.platform && newHandle.handle) {
      setData(prev => ({
        ...prev,
        socialHandles: [...prev.socialHandles, { ...newHandle }]
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

  return (
    <div ref={stepRef} className="space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Add your social media handles</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Share your social media presence to help us connect with you.
        </p>
      </div>

      <div className="space-y-6">
        {/* Add New Handle Form */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Add Social Media Handle</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Platform</label>
              <select
                value={newHandle.platform}
                onChange={(e) => setNewHandle(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Platform</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Handle/Username</label>
              <input
                type="text"
                placeholder="@username or profile link"
                value={newHandle.handle}
                onChange={(e) => setNewHandle(prev => ({ ...prev, handle: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <Button
            onClick={addHandle}
            variant="outline"
            className="w-full"
            disabled={!newHandle.platform || !newHandle.handle}
          >
            Add Handle
          </Button>
        </div>

        {/* Existing Handles */}
        {data.socialHandles.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Your Social Media Handles</h3>
            {data.socialHandles.map((handle, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{handle.platform[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{handle.platform}</div>
                    <div className="text-sm text-muted-foreground">{handle.handle}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeHandle(index)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={onPrev}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={onSkip}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Skip for now
          </Button>
          <Button
            onClick={onComplete}
            size="lg"
            className="flex-1 bg-primary-gradient font-bold text-lg py-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Complete Setup'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;