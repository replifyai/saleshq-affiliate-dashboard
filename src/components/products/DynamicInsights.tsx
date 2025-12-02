import React from 'react';

const DynamicInsights: React.FC = () => {
  return (
    <div className="mt-12 bg-gradient-to-br from-[#FFFAE6]/60 to-white border border-[#FFD100]/40 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Dynamic Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-4 bg-[#FFFAE6]/40 border border-[#FFD100]/30 rounded-lg">
          <div className="text-2xl">🌿</div>
          <div>
            <div className="font-medium text-foreground">You earned ₹3,200 from Fashion category this week</div>
            <div className="text-sm text-muted-foreground">+15% from last week</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-[#FFFAE6]/40 border border-[#FFD100]/30 rounded-lg">
          <div className="text-2xl">📈</div>
          <div>
            <div className="font-medium text-foreground">Tech products are trending — 8% higher conversion this month!</div>
            <div className="text-sm text-muted-foreground">Consider promoting more tech items</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicInsights;