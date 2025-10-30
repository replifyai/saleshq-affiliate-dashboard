'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, Package, DollarSign, MousePointer } from 'lucide-react';
import LockOverlay from '@/components/LockOverlay';
import { useProfile } from '@/contexts/ProfileContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  date: string;
  clicks: number;
  orders: number;
  revenue: number;
}

interface AnalyticsOverviewSectionProps {
  className?: string;
  data?: AnalyticsData[];
}

type TimePeriod = '7d' | '30d' | '90d';

// Extended historical data for demonstration - in real app this would come from API
const generateHistoricalData = (days: number): AnalyticsData[] => {
  const data: AnalyticsData[] = [];
  const today = new Date();
  
  // Generate data from most recent to oldest (earliest date first, then reverse at the end)
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic data with some variability
    const baseTrend = Math.sin((days - i) / days * Math.PI) * 0.3 + 0.7; // Trending sine wave
    const randomVariation = (Math.random() - 0.5) * 0.4; // Random variation
    const multiplier = Math.max(0.3, baseTrend + randomVariation);
    
    const clicks = Math.round(100 + (150 * multiplier));
    const orderRate = 0.05 + (Math.random() * 0.03); // 5-8% conversion
    const orders = Math.round(clicks * orderRate);
    const avgOrderValue = 200 + Math.random() * 100; // Variable order values
    const revenue = Math.round(orders * avgOrderValue);
    
    data.push({
      date: date.toISOString().split('T')[0],
      clicks,
      orders,
      revenue,
    });
  }
  
  return data;
};

const mockData: AnalyticsData[] = generateHistoricalData(90); // Last 90 days for full historical view

const AnalyticsChart: React.FC<{ data: AnalyticsData[] }> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [visibleCount, setVisibleCount] = React.useState(14); // Show 14 days by default
  const [chartKey, setChartKey] = React.useState(0);
  
  // Prepare chart data with all dates visible
  const formatLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get visible data slice
  const visibleData = data.slice(currentIndex, currentIndex + visibleCount);
  const dataCount = data.length;

  // Debug function to log current state
  React.useEffect(() => {
    console.log('Current index:', currentIndex);
    console.log('Visible data slice:', visibleData.slice(0, 3).map(item => ({
      date: item.date,
      revenue: item.revenue
    })));
  }, [currentIndex, visibleData]);

  const chartData = React.useMemo(() => ({
    labels: visibleData.map(item => formatLabel(item.date)),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: visibleData.map(item => item.revenue),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Orders',
        data: visibleData.map(item => item.orders * 200), // Scale up for visibility
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        yAxisID: 'y1',
      },
    ],
  }), [visibleData, currentIndex]);

  const options: ChartOptions<'bar'> = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: function(context) {
            const index = context[0].dataIndex;
            const date = new Date(visibleData[index].date);
            return date.toLocaleDateString('en-IN', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric' 
            });
          },
          label: function(context) {
            if (context.datasetIndex === 0) {
              return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
            } else {
              const originalValue = context.parsed.y / 200;
              return `Orders: ${originalValue}`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 9,
          },
          maxRotation: 0,
          minRotation: 0,
          callback: function(value: any, index: number) {
            if (index >= 0 && index < visibleData.length) {
              return formatLabel(visibleData[index].date);
            }
            return '';
          }
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y1: {
        type: 'linear',
        display: false,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    },
    elements: {
      bar: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
      }
    },
  }), [visibleData]);

  return (
    <div className="space-y-4">
      <div className="hidden sm:block">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            Daily Performance ({data.length} days)
          </h4>
          <div className="text-xs text-primary font-medium">
            Showing days {currentIndex + 1}-{Math.min(currentIndex + visibleCount, dataCount)}
          </div>
        </div>
        <div className="relative">
          {/* Fixed Chart Container */}
          <div className="h-64 w-full">
            <Bar key={`chart-${chartKey}`} data={chartData} options={options} />
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  const newIndex = Math.max(0, currentIndex - 7);
                  console.log('Previous clicked. Current:', currentIndex, 'New:', newIndex);
                  setCurrentIndex(newIndex);
                  setChartKey(prev => prev + 1);
                }}
                disabled={currentIndex === 0}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="px-3 py-1 bg-card/60 backdrop-blur-sm rounded-lg border border-border/30">
                <span className="text-xs text-muted-foreground">
                  {currentIndex + 1}-{Math.min(currentIndex + visibleCount, dataCount)} of {dataCount}
                </span>
              </div>
              
              <button
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  const newIndex = Math.min(data.length - visibleCount, currentIndex + 7);
                  console.log('Next clicked. Current:', currentIndex, 'New:', newIndex, 'Data length:', data.length, 'Visible count:', visibleCount);
                  setCurrentIndex(newIndex);
                  setChartKey(prev => prev + 1);
                }}
                disabled={currentIndex >= data.length - visibleCount}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs text-white/80 font-medium">
                Latest: {data[0] ? formatLabel(data[0].date) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile-friendly list view */}
      <div className="sm:hidden space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Recent Activity (Latest First)</h4>
        {data.slice(0, 3).map((item, index) => (
          <div key={index} className="bg-card/50 rounded-xl p-3 border border-border/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{item.orders} orders</p>
                <p className="text-xs text-muted-foreground">{item.clicks} clicks</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">₹{item.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  gradient?: 'primary' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, gradient = 'primary', icon }) => {
  const gradientClasses = {
    primary: 'from-primary/20 to-primary/5',
    success: 'from-green-500/20 to-green-500/5',
    warning: 'from-yellow-500/20 to-yellow-500/5',
    info: 'from-blue-500/20 to-blue-500/5',
  };

  const textClasses = {
    primary: 'text-primary',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  return (
    <div className={cn(
      "relative group overflow-hidden rounded-2xl h-full",
      "bg-gradient-to-br", gradientClasses[gradient]
    )}>
      <div className="relative bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col justify-between min-h-[120px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground font-medium">{title}</span>
          {icon && (
            <div className={cn("text-lg", textClasses[gradient])}>
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">{value}</span>
       {/* <｜Assistant｜> */}
        </div>
      </div>
    </div>
  );
};

const AnalyticsOverviewSection: React.FC<AnalyticsOverviewSectionProps> = ({
  className,
  data = mockData,
}) => {
  const { state } = useProfile();
  const completion = state.completionScore;
  const totalSteps = (completion?.completedCount || 0) + (completion?.leftCount || 0);
  const completionPercentage = totalSteps > 0 ? Math.round(((completion?.completedCount || 0) / totalSteps) * 100) : 0;
  const isLocked = completionPercentage < 100;
  const [selectedPeriod, setSelectedPeriod] = React.useState<TimePeriod>('30d');
  
  // Generate data based on selected period - always show most recent data first
  const displayData = React.useMemo(() => {
    const periodDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };
    
    if (data.length <= periodDays[selectedPeriod]) {
      return data; // Data is already sorted with latest first
    }
    
    return data.slice(0, periodDays[selectedPeriod]); // Show first N days (most recent)
  }, [data, selectedPeriod]);
  
  // Calculate summary metrics based on selected period
  const totalClicks = displayData.reduce((sum, item) => sum + item.clicks, 0);
  const totalOrders = displayData.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = displayData.reduce((sum, item) => sum + item.revenue, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate period-over-period growth (mock data for demonstration)
  const compareData = (period: TimePeriod) => {
    const days = { '7d': 7, '30d': 30, '90d': 90 };
    if (data.length <= days[period] * 2) return 450; // Fallback
    // Previous period data (next period in chronological order, since latest is first)
    return data.slice(days[period], days[period] * 2)
      .reduce((sum, it) => sum + it.clicks, 0);
  };
  
  const prevPeriodClicks = compareData(selectedPeriod);
  const currentPeriodClicks = totalClicks;
  const clickGrowth = prevPeriodClicks > 0 ? ((currentPeriodClicks - prevPeriodClicks) / prevPeriodClicks) * 100 : 0;

  return (
    <div className={cn('space-y-8', className)}>
      {/* Metrics Overview */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl"></div>
        <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
          <LockOverlay isLocked={isLocked} message="Complete all profile steps to unlock Analytics Overview." roundedClassName="rounded-3xl" />
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Analytics Overview</h2>
              <p className="text-muted-foreground">Track your affiliate performance trends</p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2 bg-success/10 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
  <span className="text-sm text-success font-medium">Live Data</span>
              </div>
              
              {/* Time Period Selector */}
              <div className="flex items-center space-x-1 bg-card/60 backdrop-blur-sm rounded-xl border border-border/30 p-1">
                {(['7d', '30d', '90d'] as TimePeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
                      selectedPeriod === period
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard 
              title={`${selectedPeriod.toUpperCase()} Clicks`}
              value={totalClicks.toLocaleString()}
              gradient="primary"
              icon={<MousePointer className="w-6 h-6" />}
            />
            <MetricCard 
              title={`${selectedPeriod.toUpperCase()} Orders`}
              value={totalOrders.toString()}
              gradient="success"
              icon={<Package className="w-6 h-6" />}
            />
            <MetricCard 
              title="Avg Order Value"
              value={`₹${Math.round(avgOrderValue).toLocaleString()}`}
              gradient="warning"
              icon={<DollarSign className="w-6 h-6" />}
            />
            <MetricCard 
              title="Growth Rate"
              value={`${clickGrowth.toFixed(1)}%`}
              gradient="info"
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </div>

          {/* Chart Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-6 border border-border/50">
              <AnalyticsChart data={displayData} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl"></div>
        <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
          <LockOverlay isLocked={isLocked} message="Complete all profile steps to unlock Key Insights." roundedClassName="rounded-3xl" />
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Key Insights</h2>
              <p className="text-muted-foreground">Performance highlights and trends</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Top Performing Day */}
            <div className="group relative overflow-hidden rounded-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-400/10 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl"></div>
              <div className="relative bg-card/70 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 shadow-lg hover:shadow-2xl hover:border-green-400/50 transition-all duration-300">
                <div className="absolute top-3 right-3 w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-lg animate-pulse">🏆</span>
                </div>
                <div className="mt-8">
                  <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Best Day</span>
                  <p className="text-2xl font-bold text-foreground mt-2 mb-1">
                    {data[0] ? new Date(data[0].date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ₹{data[0] ? data[0].revenue.toLocaleString() : '0'} revenue
                  </p>
                  <div className="mt-3 h-1 bg-green-500/20 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="group relative overflow-hidden rounded-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl"></div>
              <div className="relative bg-card/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-lg hover:shadow-2xl hover:border-blue-400/50 transition-all duration-300">
                <div className="absolute top-3 right-3 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-lg animate-pulse">🎯</span>
                </div>
                <div className="mt-8">
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Conversion Rate</span>
                  <p className="text-2xl font-bold text-foreground mt-2 mb-1">
                    {totalClicks > 0 ? ((totalOrders / totalClicks) * 100).toFixed(1) : '0'}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Orders per 100 clicks
                  </p>
                  <div className="mt-3 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Trend */}
            <div className="group relative overflow-hidden rounded-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl"></div>
              <div className="relative bg-card/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-lg hover:shadow-2xl hover:border-purple-400/50 transition-all duration-300">
                <div className="absolute top-3 right-3 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-lg animate-pulse">📊</span>
                </div>
                <div className="mt-8">
                  <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Daily Average</span>
                  <p className="text-2xl font-bold text-foreground mt-2 mb-1">
                    ₹{Math.round(totalRevenue / displayData.length).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Per day revenue
                  </p>
                  <div className="mt-3 h-1 bg-purple-500/20 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverviewSection;