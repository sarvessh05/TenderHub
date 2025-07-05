import { Response } from 'express';
import { pool } from '../config/db';
import { AuthenticatedRequest } from '../middleware/verifyToken';

export const applyToTender = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { tender_id, proposal, proposed_budget, proposed_timeline } = req.body;

    const companyRes = await pool.query(
      `SELECT id FROM companies WHERE user_id = $1`,
      [userId]
    );

    if (companyRes.rows.length === 0) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    const companyId = companyRes.rows[0].id;

    const result = await pool.query(
      `INSERT INTO applications (company_id, tender_id, proposal, proposed_budget, proposed_timeline)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [companyId, tender_id, proposal, proposed_budget, proposed_timeline]
    );

    res.status(201).json({ application: result.rows[0] });
  } catch (err) {
    console.error('Apply Error:', err);
    res.status(500).json({ message: 'Error submitting proposal' });
  }
};

export const getProposalsForTender = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { tenderId } = req.params;

    const result = await pool.query(
      `SELECT a.id, c.name AS company_name, a.proposal, a.proposed_budget, a.proposed_timeline, a.created_at
       FROM applications a
       JOIN companies c ON a.company_id = c.id
       WHERE a.tender_id = $1
       ORDER BY a.created_at DESC`,
      [tenderId]
    );

    res.status(200).json({ proposals: result.rows });
  } catch (err) {
    console.error('Error fetching proposals:', err);
    res.status(500).json({ message: 'Failed to fetch proposals' });
  }
};

export const getProposalsByCompany = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const companyRes = await pool.query(
      `SELECT id FROM companies WHERE user_id = $1`,
      [userId]
    );

    if (companyRes.rows.length === 0) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    const companyId = companyRes.rows[0].id;

    const result = await pool.query(
      `SELECT a.id, t.title AS tender_title, a.proposal, a.proposed_budget, a.proposed_timeline, a.created_at
       FROM applications a
       JOIN tenders t ON a.tender_id = t.id
       WHERE a.company_id = $1
       ORDER BY a.created_at DESC`,
      [companyId]
    );

    res.status(200).json({ proposals: result.rows });
  } catch (err) {
    console.error('Error fetching company proposals:', err);
    res.status(500).json({ message: 'Failed to fetch your proposals' });
  }
};
