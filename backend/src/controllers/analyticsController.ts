import { Request, Response } from 'express';
import pool from '../config/database';

// @desc    Get analytics data for current user
// @route   GET /api/analytics
// @access  Private
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;

  try {
    // Overall proposal stats
    const statsResult = await pool.query(`
      SELECT
        COUNT(*)::int                                                            AS total_proposals,
        COUNT(CASE WHEN outcome = 'won'     THEN 1 END)::int                    AS won,
        COUNT(CASE WHEN outcome = 'lost'    THEN 1 END)::int                    AS lost,
        COUNT(CASE WHEN outcome = 'pending' THEN 1 END)::int                    AS pending,
        COALESCE(SUM(CASE WHEN outcome = 'won' THEN contract_value ELSE 0 END), 0)::float AS total_value_won
      FROM proposals
      WHERE user_id = $1
    `, [userId]);

    // Loss reasons breakdown
    const lossReasonsResult = await pool.query(`
      SELECT loss_reason, COUNT(*)::int AS count
      FROM proposals
      WHERE user_id = $1
        AND outcome = 'lost'
        AND loss_reason IS NOT NULL
      GROUP BY loss_reason
      ORDER BY count DESC
    `, [userId]);

    // Monthly win/loss trend (last 12 months)
    const monthlyResult = await pool.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM')          AS month,
        COUNT(CASE WHEN outcome = 'won'  THEN 1 END)::int             AS won,
        COUNT(CASE WHEN outcome = 'lost' THEN 1 END)::int             AS lost,
        COUNT(*)::int                                                  AS total
      FROM proposals
      WHERE user_id = $1
        AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `, [userId]);

    // Top competitors lost to
    const competitorsResult = await pool.query(`
      SELECT competitor_lost_to, COUNT(*)::int AS count
      FROM proposals
      WHERE user_id = $1
        AND outcome = 'lost'
        AND competitor_lost_to IS NOT NULL
        AND competitor_lost_to != ''
      GROUP BY competitor_lost_to
      ORDER BY count DESC
      LIMIT 10
    `, [userId]);

    const s = statsResult.rows[0];
    const total = s.total_proposals;
    const won   = s.won;
    const lost  = s.lost;
    const closed = won + lost;

    res.json({
      success: true,
      data: {
        stats: {
          total_proposals:  total,
          won,
          lost,
          pending:          s.pending,
          total_value_won:  parseFloat(s.total_value_won) || 0,
          win_rate:         total  > 0 ? Math.round((won / total)  * 100) : 0,
          closed_win_rate:  closed > 0 ? Math.round((won / closed) * 100) : 0,
          loss_rate:        total  > 0 ? Math.round((lost / total) * 100) : 0,
        },
        loss_reasons:    lossReasonsResult.rows,
        monthly_trends:  monthlyResult.rows,
        top_competitors: competitorsResult.rows,
      },
    });
  } catch (error: any) {
    console.error('❌ Analytics error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to load analytics' });
  }
};
