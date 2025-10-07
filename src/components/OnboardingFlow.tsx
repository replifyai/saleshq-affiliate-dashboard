'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Button from './common/Button';
import TextField from './common/TextField';
import { cn } from '@/lib/utils';

interface OnboardingData {
  creatorName: string;
  socialHandles: {
    platform: string;
    handle: string;
    followers: string;
  }[];
  background: string;
  categories: string[];
}

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    creatorName: '',
    socialHandles: [],
    background: '',
    categories: []
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalSteps = 3;

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

  const handleComplete = () => {
    console.log('Onboarding completed:', data);
    // Redirect to dashboard or main app
    window.location.href = '/dashboard';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CreatorNameStep data={data} setData={setData} onNext={nextStep} />;
      case 2:
        return <SocialHandlesStep data={data} setData={setData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <BackgroundStep data={data} setData={setData} onComplete={handleComplete} onPrev={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary-gradient h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
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
}> = ({ data, setData, onNext }) => {
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
    <div ref={stepRef} className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">👤</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">What's your creator name?</h2>
        <p className="text-lg text-muted-foreground">
          This is how you'll be known in our affiliate program
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

        <Button
          onClick={handleNext}
          size="lg"
          className="w-full bg-primary-gradient font-bold text-lg py-4"
          disabled={!data.creatorName.trim()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

// Step 2: Social Media Handles
const SocialHandlesStep: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  onPrev: () => void;
}> = ({ data, setData, onNext, onPrev }) => {
  const stepRef = useRef<HTMLDivElement>(null);
  const [newHandle, setNewHandle] = useState({ platform: '', handle: '', followers: '' });

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
    if (newHandle.platform && newHandle.handle && newHandle.followers) {
      setData(prev => ({
        ...prev,
        socialHandles: [...prev.socialHandles, { ...newHandle }]
      }));
      setNewHandle({ platform: '', handle: '', followers: '' });
    }
  };

  const removeHandle = (index: number) => {
    setData(prev => ({
      ...prev,
      socialHandles: prev.socialHandles.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div ref={stepRef} className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">📱</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Add your social media handles</h2>
        <p className="text-lg text-muted-foreground">
          Share your social media presence to help us understand your reach
        </p>
      </div>

      <div className="space-y-6">
        {/* Add New Handle Form */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Add Social Media Handle</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="block text-sm font-medium text-foreground mb-2">Handle</label>
              <input
                type="text"
                placeholder="@username"
                value={newHandle.handle}
                onChange={(e) => setNewHandle(prev => ({ ...prev, handle: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Followers</label>
              <input
                type="text"
                placeholder="e.g., 10K, 1M"
                value={newHandle.followers}
                onChange={(e) => setNewHandle(prev => ({ ...prev, followers: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <Button
            onClick={addHandle}
            variant="outline"
            className="w-full"
            disabled={!newHandle.platform || !newHandle.handle || !newHandle.followers}
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
                    <span className="text-sm font-bold text-white">{handle.platform[0]}ss</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{handle.platform}</div>
                    <div className="text-sm text-muted-foreground">{handle.handle} • {handle.followers} followers</div>
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
        <div className="flex gap-4">
          <Button
            onClick={onPrev}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            className="flex-1 bg-primary-gradient font-bold text-lg py-4"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Background & Categories
const BackgroundStep: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onComplete: () => void;
  onPrev: () => void;
}> = ({ data, setData, onComplete, onPrev }) => {
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(stepRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const categories = [
    'Technology', 'Fashion', 'Beauty', 'Fitness', 'Food', 'Travel',
    'Gaming', 'Education', 'Business', 'Lifestyle', 'Health', 'Entertainment'
  ];

  const toggleCategory = (category: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div ref={stepRef} className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">🎯</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Tell us about your background</h2>
        <p className="text-lg text-muted-foreground">
          Help us understand your expertise and interests
        </p>
      </div>

      <div className="space-y-6">
        {/* Background */}
        <div>
          <label className="block text-lg font-semibold text-foreground mb-4">Background</label>
          <textarea
            placeholder="Tell us about your background, experience, and what makes you unique..."
            value={data.background}
            onChange={(e) => setData(prev => ({ ...prev, background: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-lg font-semibold text-foreground mb-4">Categories (Select all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={cn(
                  "px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium",
                  data.categories.includes(category)
                    ? "bg-primary-gradient text-black border-primary"
                    : "bg-card text-foreground border-border hover:border-primary"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            onClick={onPrev}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleComplete}
            size="lg"
            className="flex-1 bg-primary-gradient font-bold text-lg py-4"
            disabled={!data.background.trim() || data.categories.length === 0}
          >
            Complete Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;