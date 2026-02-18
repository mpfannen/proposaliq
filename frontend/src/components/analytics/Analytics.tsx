import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import analyticsService, { AnalyticsData } from '../../services/analyticsService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, Legend, ResponsiveContainer,
} from 'recharts';
import './Analytics.css';

const LOSS_REASON_LABELS: Record<string, string> = {
  price_too_high:         'Price too high',
  timeline_issues:        'Timeline issues',
  lack_experience:        'Lacked experience',
  late_submission:        'Late submission',
  missing_certifications: 'Missing certifications',
  scope_mismatch:         'Scope mismatch',
  lost_to_incumbent:      'Lost to incumbent',
  no_response:            'No response',
  other:                  'Other',
};

const formatCurrency = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toLocaleString()}`;
};

const formatMonth = (m: string) => {
  const [year, month] = m.split('-');
  return new Date(parseInt(year), parseInt(month) - 1)
    .toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

const winRateClass = (rate: number) =>
  rate >= 50 ? 'rate-high' : rate >= 20 ? 'rate-medium' : 'rate-low';

const Analytics: React.FC = () => {
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // ROI calculator state
  const [hourlyRate,      setHourlyRate]      = useState(75);
  const [monthlyToolCost, setMonthlyToolCost] = useState(99);

  useEffect(() => {
    analyticsService.getAnalytics()
      .then(setData)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  // ── Derived values ───────────────────────────────────────────────
  const stats          = data?.stats;
  const hoursSaved     = (stats?.total_proposals || 0) * 4;
  const timeSavedValue = hoursSaved * hourlyRate;
  const annualCost     = monthlyToolCost * 12;
  const valueCreated   = (stats?.total_value_won || 0) + timeSavedValue;
  const roi            = annualCost > 0 ? Math.round(((valueCreated - annualCost) / annualCost) * 100) : 0;

  // ── Chart data ───────────────────────────────────────────────────
  const lossReasonData = (data?.loss_reasons || []).map(lr => ({
    label: LOSS_REASON_LABELS[lr.loss_reason] || lr.loss_reason,
    count: lr.count,
  }));

  const trendData = (data?.monthly_trends || []).map(mt => ({
    month: formatMonth(mt.month),
    Won:   mt.won,
    Lost:  mt.lost,
  }));

  // ── Nav ──────────────────────────────────────────────────────────
  const Nav = () => (
    <nav className="analytics-nav">
      <div className="nav-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        <h1>ProposalIQ</h1>
      </div>
      <div className="nav-links">
        <button className="nav-link nav-link-home" onClick={() => navigate('/dashboard')}>🏠 Dashboard</button>
        <button className="nav-link" onClick={() => navigate('/upload')}>New Proposal</button>
        <button className="nav-link" onClick={() => navigate('/proposals')}>My Proposals</button>
        <button className="nav-link nav-link-active" onClick={() => navigate('/analytics')}>Analytics</button>
        <button className="nav-link" onClick={() => navigate('/knowledge-base')}>Knowledge Base</button>
        <button className="nav-link" onClick={() => navigate('/settings')}>Settings</button>
        <span className="nav-divider" />
        <span className="nav-user">{user?.name}</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );

  if (loading) {
    return (
      <div className="analytics-container">
        <Nav />
        <div className="analytics-loading">
          <div className="spinner" /><p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <Nav />
        <div className="analytics-error"><p>⚠️ {error}</p></div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <Nav />

      <div className="analytics-content">
        <div className="analytics-header">
          <h2>Analytics</h2>
          <p>Your proposal performance at a glance</p>
        </div>

        {/* ── A: Key Metrics ────────────────────────────────────── */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📋</div>
            <div className="metric-value">{stats?.total_proposals ?? 0}</div>
            <div className="metric-label">Total Proposals</div>
          </div>

          <div className={`metric-card metric-rate ${winRateClass(stats?.closed_win_rate ?? 0)}`}>
            <div className="metric-icon">🎯</div>
            <div className="metric-value">{stats?.closed_win_rate ?? 0}%</div>
            <div className="metric-label">Win Rate (closed)</div>
            <div className="metric-sub">{stats?.win_rate ?? 0}% of all proposals</div>
          </div>

          <div className="metric-card metric-value-won">
            <div className="metric-icon">💰</div>
            <div className="metric-value">{formatCurrency(stats?.total_value_won ?? 0)}</div>
            <div className="metric-label">Contract Value Won</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⏳</div>
            <div className="metric-value">{stats?.pending ?? 0}</div>
            <div className="metric-label">Pending Outcome</div>
            <div className="metric-sub">{stats?.won ?? 0} won · {stats?.lost ?? 0} lost</div>
          </div>
        </div>

        {/* ── B + C: Charts Row ──────────────────────────────────── */}
        <div className="charts-row">

          {/* B: Loss Analysis */}
          <div className="chart-card">
            <h3>📉 Why You're Losing</h3>
            {lossReasonData.length === 0 ? (
              <div className="chart-empty">
                <p>No loss reasons recorded yet.</p>
                <p className="chart-empty-sub">Mark proposals as "Lost" with a reason in My Proposals to see this chart.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart layout="vertical" data={lossReasonData} margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="label" width={160} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(val: any) => [val, 'Losses']}
                    contentStyle={{ borderRadius: 8, fontSize: 13 }}
                  />
                  <Bar dataKey="count" fill="#ef5350" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* C: Win/Loss Trend */}
          <div className="chart-card">
            <h3>📈 Win/Loss Trend (12 Months)</h3>
            {trendData.length === 0 ? (
              <div className="chart-empty">
                <p>Not enough data yet.</p>
                <p className="chart-empty-sub">Trends appear after you have proposals with recorded outcomes.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData} margin={{ left: 0, right: 24, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                  <Legend />
                  <Line type="monotone" dataKey="Won"  stroke="#4caf50" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Lost" stroke="#ef5350" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

        {/* ── D + E: ROI + Competitors Row ───────────────────────── */}
        <div className="charts-row">

          {/* D: ROI Calculator */}
          <div className="chart-card roi-card">
            <h3>💡 ROI Calculator</h3>
            <p className="roi-subtitle">Estimate the value ProposalIQ delivers</p>

            <div className="roi-inputs">
              <div className="roi-input-group">
                <label>Your hourly rate ($/hr)</label>
                <input
                  type="number"
                  min={1}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Math.max(1, parseInt(e.target.value) || 0))}
                />
              </div>
              <div className="roi-input-group">
                <label>ProposalIQ cost ($/mo)</label>
                <input
                  type="number"
                  min={0}
                  value={monthlyToolCost}
                  onChange={(e) => setMonthlyToolCost(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            </div>

            <div className="roi-breakdown">
              <div className="roi-row">
                <span>Proposals created</span>
                <strong>{stats?.total_proposals ?? 0}</strong>
              </div>
              <div className="roi-row">
                <span>Est. hours saved <em>(4 hrs/proposal)</em></span>
                <strong>{hoursSaved} hrs</strong>
              </div>
              <div className="roi-row">
                <span>Value of time saved</span>
                <strong>{formatCurrency(timeSavedValue)}</strong>
              </div>
              <div className="roi-row">
                <span>Contracts won</span>
                <strong>{formatCurrency(stats?.total_value_won ?? 0)}</strong>
              </div>
              <div className="roi-row roi-row-divider">
                <span>Annual tool cost</span>
                <strong className="roi-cost">−{formatCurrency(annualCost)}</strong>
              </div>
              <div className="roi-row roi-total">
                <span>Estimated ROI</span>
                <strong className={roi >= 0 ? 'roi-positive' : 'roi-negative'}>
                  {roi >= 0 ? '+' : ''}{roi}%
                </strong>
              </div>
            </div>
          </div>

          {/* E: Top Competitors */}
          <div className="chart-card">
            <h3>🏁 Top Competitors</h3>
            {(data?.top_competitors || []).length === 0 ? (
              <div className="chart-empty">
                <p>No competitors recorded yet.</p>
                <p className="chart-empty-sub">Add a competitor name when marking proposals as "Lost".</p>
              </div>
            ) : (
              <table className="competitors-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Competitor</th>
                    <th>Times Lost To</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.top_competitors || []).map((c, i) => (
                    <tr key={c.competitor_lost_to}>
                      <td className="rank-cell">{i + 1}</td>
                      <td>{c.competitor_lost_to}</td>
                      <td>
                        <span className="competitor-count">{c.count}</span>
                        <span className="competitor-bar" style={{ width: `${Math.min(100, c.count * 20)}px` }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;
