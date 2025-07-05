import { Request, Response } from 'express';
import { pool } from '../config/db';
import { supabase } from '../utils/supabaseClient';
import { AuthenticatedRequest } from '../middleware/verifyToken';

/**
 * Create a company profile
 */
export const createCompany = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No user ID.' });
    return;
  }

  const { name, industry, description, logo_url } = req.body;

  if (!name || !industry || !description) {
    res.status(400).json({ message: 'All fields are required.' });
    return;
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO companies (user_id, name, industry, description, logo_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [userId, name, industry, description, logo_url || null]
    );

    res.status(201).json({
      message: 'Company created successfully',
      company: result.rows[0],
    });
  } catch (err) {
    console.error('Create Company Error:', err);
    res.status(500).json({ message: 'Server error while creating company' });
  }
};

/**
 * Get company profile of the logged-in user
 */
export const getMyCompany = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No user ID.' });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT * FROM companies WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'No company profile found.' });
      return;
    }

    res.status(200).json({ company: result.rows[0] });
  } catch (err) {
    console.error('Get Company Error:', err);
    res.status(500).json({ message: 'Server error while fetching company.' });
  }
};

/**
 * Update company profile
 */
export const updateCompany = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No user ID.' });
    return;
  }

  const { name, industry, description, logo_url } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE companies
      SET name = $1, industry = $2, description = $3, logo_url = $4
      WHERE user_id = $5
      RETURNING *
      `,
      [name, industry, description, logo_url || null, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Company not found or unauthorized.' });
      return;
    }

    res.status(200).json({
      message: 'Company updated successfully',
      company: result.rows[0],
    });
  } catch (err) {
    console.error('Update Company Error:', err);
    res.status(500).json({ message: 'Server error while updating company.' });
  }
};

/**
 * Delete company profile
 */
export const deleteCompany = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No user ID.' });
    return;
  }

  try {
    const result = await pool.query(
      `DELETE FROM companies WHERE user_id = $1 RETURNING *`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Company not found or already deleted.' });
      return;
    }

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error('Delete Company Error:', err);
    res.status(500).json({ message: 'Server error while deleting company.' });
  }
};

/**
 * Search companies based on query
 */
export const searchCompanies = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = req.query.query;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ message: 'Missing or invalid query parameter.' });
    return;
  }

  try {
    const result = await pool.query(
      `
      SELECT DISTINCT c.id, c.name, c.industry, c.description
      FROM companies c
      LEFT JOIN goods_and_services g ON c.id = g.company_id
      WHERE LOWER(c.name) LIKE LOWER($1)
         OR LOWER(c.industry) LIKE LOWER($1)
         OR LOWER(g.name) LIKE LOWER($1)
      `,
      [`%${query}%`]
    );

    res.status(200).json({ companies: result.rows });
  } catch (err) {
    console.error('Search Companies Error:', err);
    res.status(500).json({ message: 'Search failed. Please try again.' });
  }
};

/**
 * Upload company logo to Supabase and update DB with public URL
 */
export const uploadLogo = async (
  req: AuthenticatedRequest & { file?: Express.Multer.File },
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const file = req.file;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No user ID.' });
    return;
  }

  if (!file) {
    res.status(400).json({ message: 'No file uploaded.' });
    return;
  }

  try {
    const companyRes = await pool.query(`SELECT id FROM companies WHERE user_id = $1`, [userId]);
    if (companyRes.rows.length === 0) {
      res.status(404).json({ message: 'Company not found.' });
      return;
    }

    const companyId = companyRes.rows[0].id;
    const fileName = `logos/${companyId}-${Date.now()}`;

    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError.message);
      res.status(500).json({ message: 'Failed to upload logo to Supabase.' });
      return;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('company-logos')
      .getPublicUrl(fileName);

    const logoUrl = publicUrlData.publicUrl;

    await pool.query(
      `UPDATE companies SET logo_url = $1 WHERE id = $2`,
      [logoUrl, companyId]
    );

    res.status(200).json({
      message: 'Logo uploaded successfully',
      logo_url: logoUrl,
    });
  } catch (err) {
    console.error('Upload Logo Error:', err);
    res.status(500).json({ message: 'Upload failed.' });
  }
};
