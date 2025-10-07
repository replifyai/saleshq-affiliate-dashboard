import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import Button from '@/components/common/Button';
import { Product } from './types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

interface PerformanceChartModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const PerformanceChartModal: React.FC<PerformanceChartModalProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  if (!product || !isOpen || !product.salesData) return null;

  const [selectedMetric, setSelectedMetric] = useState<'sales' | 'clicks' | 'conversions'>('sales');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const getFilteredData = () => {
    const data = product.salesData || [];
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return data.slice(-days);
  };

  const getMaxValue = () => {
    const data = getFilteredData();
    return Math.max(...data.map(d => d[selectedMetric]));
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'sales': return 'Sales (₹)';
      case 'clicks': return 'Clicks';
      case 'conversions': return 'Conversions';
      default: return 'Sales (₹)';
    }
  };

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'sales': return 'text-primary';
      case 'clicks': return 'text-primary';
      case 'conversions': return 'text-accent';
      default: return 'text-primary';
    }
  };

  const data = getFilteredData();
  const maxValue = getMaxValue();

  // Chart.js configuration
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: getMetricLabel(),
        data: data.map(d => d[selectedMetric]),
        backgroundColor: chartType === 'bar' ? (
          selectedMetric === 'sales' 
            ? 'rgba(251, 191, 36, 0.8)' // Primary color
            : selectedMetric === 'clicks' 
            ? 'rgba(6, 182, 212, 0.8)' // Secondary color
            : 'rgba(244, 114, 182, 0.8)' // Accent color
        ) : 'transparent',
        borderColor: selectedMetric === 'sales' 
          ? 'rgba(251, 191, 36, 1)'
          : selectedMetric === 'clicks' 
          ? 'rgba(6, 182, 212, 1)'
          : 'rgba(244, 114, 182, 1)',
        borderWidth: chartType === 'line' ? 3 : 2,
        borderRadius: chartType === 'bar' ? 6 : 0,
        borderSkipped: false,
        fill: chartType === 'line',
        tension: chartType === 'line' ? 0.4 : 0,
        pointBackgroundColor: chartType === 'line' ? (
          selectedMetric === 'sales' 
            ? 'rgba(251, 191, 36, 1)'
            : selectedMetric === 'clicks' 
            ? 'rgba(6, 182, 212, 1)'
            : 'rgba(244, 114, 182, 1)'
        ) : undefined,
        pointBorderColor: chartType === 'line' ? '#1E293B' : undefined,
        pointBorderWidth: chartType === 'line' ? 2 : undefined,
        pointRadius: chartType === 'line' ? 4 : undefined,
        pointHoverRadius: chartType === 'line' ? 6 : undefined,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#F8FAFC',
        borderColor: 'rgba(6, 182, 212, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            const value = context.parsed.y;
            return selectedMetric === 'sales' 
              ? `Sales: ₹${value.toLocaleString()}`
              : `${getMetricLabel()}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return selectedMetric === 'sales' 
              ? `₹${value.toLocaleString()}`
              : value.toLocaleString();
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{product.image}</div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{product.name} - Performance Chart</h2>
              <p className="text-muted-foreground">{product.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex space-x-2">
            {(['sales', 'clicks', 'conversions'] as const).map((metric) => (
              <Button
                key={metric}
                variant={selectedMetric === metric ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedMetric(metric)}
                className="capitalize"
              >
                {metric}
              </Button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>

          <div className="flex space-x-2">
            {(['bar', 'line'] as const).map((type) => (
              <Button
                key={type}
                variant={chartType === type ? 'accent' : 'ghost'}
                size="sm"
                onClick={() => setChartType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-background/50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{getMetricLabel()}</h3>
            <div className={`text-sm font-medium ${getMetricColor()}`}>
              Max: {selectedMetric === 'sales' ? `₹${maxValue.toLocaleString()}` : maxValue.toLocaleString()}
            </div>
          </div>
          
          <div className="h-80 w-full">
            {chartType === 'bar' ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-background/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Total {selectedMetric === 'sales' ? 'Sales' : selectedMetric === 'clicks' ? 'Clicks' : 'Conversions'}</div>
            <div className={`text-xl font-bold ${getMetricColor()}`}>
              {selectedMetric === 'sales' 
                ? `₹${data.reduce((sum, d) => sum + d[selectedMetric], 0).toLocaleString()}`
                : data.reduce((sum, d) => sum + d[selectedMetric], 0).toLocaleString()
              }
            </div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Average per Day</div>
            <div className={`text-xl font-bold ${getMetricColor()}`}>
              {selectedMetric === 'sales' 
                ? `₹${Math.round(data.reduce((sum, d) => sum + d[selectedMetric], 0) / data.length).toLocaleString()}`
                : Math.round(data.reduce((sum, d) => sum + d[selectedMetric], 0) / data.length).toLocaleString()
              }
            </div>
          </div>
          
          <div className="bg-background/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Best Day</div>
            <div className={`text-xl font-bold ${getMetricColor()}`}>
              {selectedMetric === 'sales' 
                ? `₹${Math.max(...data.map(d => d[selectedMetric])).toLocaleString()}`
                : Math.max(...data.map(d => d[selectedMetric])).toLocaleString()
              }
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        {selectedMetric === 'sales' && (
          <div className="bg-background/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Overall Conversion Rate</div>
            <div className="text-xl font-bold text-accent">
              {((data.reduce((sum, d) => sum + d.conversions, 0) / data.reduce((sum, d) => sum + d.clicks, 0)) * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChartModal;