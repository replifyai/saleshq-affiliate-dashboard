'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ScheduleItemProps {
  date: string;
  title: string;
  subtitle: string;
  time: string;
}

interface ScheduleSectionProps {
  className?: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ date, title, subtitle, time }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#FFFAE6]/50 transition-colors group">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/30 transition-colors">
          <span className="text-lg font-bold text-foreground">{date}</span>
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-foreground"></div>
        <span className="text-sm font-medium text-foreground">{time}</span>
      </div>
    </div>
  );
};

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ className }) => {
  const scheduleItems = [
    {
      date: '05',
      title: 'UX/UI Workshop',
      subtitle: '10 of 45 chapters • Mrs. Wilson',
      time: '14:00',
    },
    {
      date: '06',
      title: 'Interaction Design',
      subtitle: '5 of 30 chapters • Mrs. Wilson',
      time: '15:00',
    },
  ];

  return (
    <div className={cn('bg-gradient-to-br from-[#FFFAE6]/60 to-white rounded-2xl p-6 shadow-md border border-[#FFD100]/40', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Schedule</h2>
        <button className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
          See more
        </button>
      </div>

      <div className="space-y-2">
        {scheduleItems.map((item, index) => (
          <ScheduleItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleSection;
