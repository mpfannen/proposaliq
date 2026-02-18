import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface AnalyticsStats {
  total_proposals: number;
  won: number;
  lost: number;
  pending: number;
  total_value_won: number;
  win_rate: number;
  closed_win_rate: number;
  loss_rate: number;
}

export interface LossReason {
  loss_reason: string;
  count: number;
}

export interface MonthlyTrend {
  month: string; // 'YYYY-MM'
  won: number;
  lost: number;
  total: number;
}

export interface TopCompetitor {
  competitor_lost_to: string;
  count: number;
}

export interface AnalyticsData {
  stats: AnalyticsStats;
  loss_reasons: LossReason[];
  monthly_trends: MonthlyTrend[];
  top_competitors: TopCompetitor[];
}

const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
};

export default analyticsService;
