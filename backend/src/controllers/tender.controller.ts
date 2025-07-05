import { Request, Response } from 'express';
import { pool } from '../config/db';
import { AuthenticatedRequest } from '../middleware/verifyToken';

/**
 * Create a new tender
 */
export const createTender = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: No user ID.' });
      return;
    }

    // Step 1: Find company ID for this user
    const companyRes = await pool.query(
      `SELECT id FROM companies WHERE user_id = $1`,
      [userId]
    );

    if (companyRes.rows.length === 0) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    const companyId = companyRes.rows[0].id;
    const { title, description, deadline, budget } = req.body;

    if (!title || !description || !deadline || !budget) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    // Step 2: Insert tender
    const result = await pool.query(
      `INSERT INTO tenders (title, description, deadline, budget, company_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, deadline, budget, companyId]
    );

    res.status(201).json({ tender: result.rows[0] });
  } catch (err) {
    console.error('Create Tender Error:', err);
    res.status(500).json({ message: 'Server error while creating tender' });
  }
};

/**
 * Get all tenders with pagination
 */
export const getAllTenders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    if (page < 1 || limit < 1) {
      res.status(400).json({ message: 'Invalid pagination parameters.' });
      return;
    }

    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM tenders ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({
      tenders: result.rows,
      pagination: {
        page,
        limit,
        hasMore: result.rows.length === limit,
      },
    });
  } catch (err) {
    console.error('Error fetching tenders:', err);
    res.status(500).json({ message: 'Server error while fetching tenders' });
  }
};
