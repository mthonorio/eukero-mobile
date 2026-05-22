export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number;
  newOrders: number;
  ordersChange: number;
  totaltoPay: number;
  toPayChange: number;
  totalToReceive: number;
  toReceiveChange: number;
}

export interface ChartDataset {
  label?: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string | string[];
  fill?: string | boolean;
  tension?: number;
  borderWidth?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
}

export interface RevenueOverviewData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface SalesByCategoryData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
}

export interface TopProduct {
  name: string;
  price: number;
  sales: number;
  trend: number;
}

export interface RecentActivity {
  type: 'order' | 'customer' | 'payment' | 'review';
  description: string;
  details: string;
  time: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  revenueOverview: RevenueOverviewData;
  salesByCategory: SalesByCategoryData;
  topProducts: TopProduct[];
  recentActivities: RecentActivity[];
}

export type TimeFilter = 'Week' | 'Month' | 'Quarter' | 'Year';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

export interface TopProductsCardProps {
  list: TopProduct[];
}

export interface RecentActivitiesCardProps {
  list: RecentActivity[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  interaction?: {
    mode: 'index' | 'nearest' | 'point' | 'dataset';
    intersect: boolean;
  };
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'left' | 'bottom' | 'right';
      labels?: {
        usePointStyle?: boolean;
        padding?: number;
      };
    };
    tooltip?: {
      backgroundColor?: string;
      titleColor?: string;
      bodyColor?: string;
      borderColor?: string;
      borderWidth?: number;
      cornerRadius?: number;
      displayColors?: boolean;
      callbacks?: {
        label?: (context: any) => string;
      };
    };
  };
  scales?: {
    x?: {
      grid?: {
        display?: boolean;
      };
      border?: {
        display?: boolean;
      };
      ticks?: {
        color?: string;
        font?: {
          size?: number;
        };
      };
    };
    y?: {
      grid?: {
        color?: string;
        drawBorder?: boolean;
      };
      border?: {
        display?: boolean;
      };
      ticks?: {
        color?: string;
        font?: {
          size?: number;
        };
        callback?: (value: any) => string;
      };
      beginAtZero?: boolean;
    };
  };
  elements?: {
    point?: {
      radius?: number;
      hoverRadius?: number;
      hoverBorderWidth?: number;
      hoverBorderColor?: string;
    };
    line?: {
      tension?: number;
    };
  };
  cutout?: string;
}
