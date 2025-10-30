'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProfile } from '@/contexts/ProfileContext';

interface StepItemProps {
  step: string;
  isCompleted: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ step, isCompleted }) => {
  const getStepLabel = (step: string): string => {
    const stepMap: Record<string, string> = {
      email: 'Email Address',
      socialMediaHandles: 'Social Media Handles',
      phoneNumberVerified: 'Phone Verification',
      name: 'Full Name',
      approved: 'Account Approval',
    };
    return stepMap[step] || step;
  };

  const getStepIcon = (step: string): JSX.Element => {
    const iconMap: Record<string, JSX.Element> = {
      email: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      socialMediaHandles: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      phoneNumberVerified: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      name: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      approved: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    };
    return iconMap[step] || (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    );
  };

  return (
    <div className="flex items-center gap-3 group">
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
        ${isCompleted 
          ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30' 
          : 'bg-secondary/50 border border-border/50 group-hover:border-primary/30'
        }
      `}>
        {isCompleted ? (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        )}
      </div>
      <div className="flex items-center gap-2 flex-1">
        <div className={`transition-colors duration-300 ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
          {getStepIcon(step)}
        </div>
        <span className={`text-sm font-medium transition-colors duration-300 ${
          isCompleted 
            ? 'text-foreground/80 line-through' 
            : 'text-foreground group-hover:text-primary'
        }`}>
          {getStepLabel(step)}
        </span>
      </div>
    </div>
  );
};

export default function ProfileCompletionSection() {
  const { state } = useProfile();
  const { completionScore, profile } = state;

  if (!completionScore) {
    return null;
  }

  const { completed, left, completedCount, leftCount } = completionScore;
  const totalSteps = completedCount + leftCount;
  const completionPercentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const isFullyCompleted = completionPercentage === 100;

  // Auto-expand if there are remaining steps, collapse if complete
  const [isExpanded, setIsExpanded] = useState(leftCount > 0);

  // Update isExpanded when leftCount changes
  useEffect(() => {
    setIsExpanded(leftCount > 0);
  }, [leftCount]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative bg-gradient-to-br from-card/80 via-card/90 to-card backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden transition-all duration-300">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        {/* Accordion Header - Always Visible */}
        <button
          onClick={toggleExpanded}
          className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-secondary/5 transition-colors duration-200"
          aria-expanded={isExpanded}
          aria-label="Toggle profile completion details"
        >
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-gradient-to-b from-primary to-purple-500 rounded-full" />
                Profile Completion
              </h2>
              <p className="text-sm text-muted-foreground">
                {isFullyCompleted 
                  ? '🎉 Your profile is complete!' 
                  : `Complete your profile to unlock all features`
                }
              </p>
            </div>

            {/* Compact Progress Display */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">
                  {completionPercentage}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {completedCount}/{totalSteps} steps
                </div>
              </div>
            </div>
          </div>

          {/* Chevron Icon */}
          <div className="ml-4">
            <svg 
              className={`w-6 h-6 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Collapsible Content */}
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            {/* Complete Now Button - Only show when expanded and incomplete */}
            {!isFullyCompleted && (
              <div className="mb-6 flex gap-3">
                <Link 
                  href="/onboarding"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Setup
                </Link>
                <Link 
                  href="/profile"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground text-sm font-medium rounded-xl hover:bg-secondary/20 transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Full Profile
                </Link>
              </div>
            )}

            {/* Progress Circle and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Circular Progress */}
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90 w-40 h-40">
                    {/* Background circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-secondary/30"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - completionPercentage / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className="text-primary" stopColor="currentColor" />
                        <stop offset="100%" className="text-purple-500" stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Percentage text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">
                      {completionPercentage}%
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">Complete</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col justify-center gap-4">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl p-4 border border-orange-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Remaining</span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{leftCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar (linear) */}
            <div className="mb-6">
              <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Steps List */}
            {(completed.length > 0 || left.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Completed Steps */}
                {completed.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Completed Steps
                    </h3>
                    <div className="space-y-3">
                      {completed.map((step) => (
                        <StepItem key={step} step={step} isCompleted={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Steps */}
                {left.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pending Steps
                    </h3>
                    <div className="space-y-3">
                      {left.map((step) => (
                        <StepItem key={step} step={step} isCompleted={false} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Motivational message */}
            {!isFullyCompleted && left.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-xl border border-primary/20">
                <p className="text-sm text-foreground/80 text-center">
                  💡 <span className="font-medium">Just {leftCount} more {leftCount === 1 ? 'step' : 'steps'} to go!</span> Complete your profile to get better opportunities.
                </p>
              </div>
            )}

            {/* Success message */}
            {isFullyCompleted && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-xl border border-green-500/20">
                <p className="text-sm text-foreground/80 text-center">
                  ✨ <span className="font-medium">Awesome!</span> Your profile is fully set up. You're ready to maximize your earnings!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

