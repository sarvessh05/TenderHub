import { Request, Response } from 'express';
import { pool } from '../config/db';

export const createTender = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    // Step 1: Find company ID for this user
    const companyRes = await pool.query(
      `SELECT id FROM companies WHERE user_id = $1`,
      [userId]
    );

    if (companyRes.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const companyId = companyRes.rows[0].id;
    const { title, description, deadline, budget } = req.body;

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

export const getAllTenders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT * FROM tenders ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({ tenders: result.rows, page });
  } catch (err) {
    console.error('Error fetching tenders:', err);
    res.status(500).json({ message: 'Server error while fetching tenders' });
  }
};