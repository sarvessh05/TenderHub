import { Request, Response } from 'express';
import { pool } from '../config/db';
import { supabase } from '../utils/supabaseClient';

// @desc Create a company profile
export const createCompany = async (req: any, res: Response) => {
  try {
    const { name, industry, description, logo_url } = req.body;
    const userId = req.user.id;

    if (!name || !industry || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const result = await pool.query(
      `
      INSERT INTO companies (user_id, name, industry, description, logo_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [userId, name, industry, description, logo_url || null]
    );

    return res.status(201).json({
      message: 'Company created successfully',
      company: result.rows[0],
    });
  } catch (err) {
    console.error('Create Company Error:', err);
    return res.status(500).json({ message: 'Server error while creating company' });
  }
};

// @desc Get company profile of logged-in user
export const getMyCompany = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM companies WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No company profile found.' });
    }

    return res.status(200).json({ company: result.rows[0] });
  } catch (err) {
    console.error('Get Company Error:', err);
    return res.status(500).json({ message: 'Server error while fetching company.' });
  }
};

// @desc Update company profile
export const updateCompany = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, industry, description, logo_url } = req.body;

    const result = await pool.query(
      `
      UPDATE companies
      SET name = $1, industry = $2, description = $3, logo_url = $4
      WHERE user_id = $5
      RETURNING *
      `,
      [name, industry, description, logo_url, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found or unauthorized.' });
    }

    return res.status(200).json({
      message: 'Company updated successfully',
      company: result.rows[0],
    });
  } catch (err) {
    console.error('Update Company Error:', err);
    return res.status(500).json({ message: 'Server error while updating company.' });
  }
};

// @desc Delete company profile
export const deleteCompany = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM companies WHERE user_id = $1 RETURNING *`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found or already deleted.' });
    }

    return res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error('Delete Company Error:', err);
    return res.status(500).json({ message: 'Server error while deleting company.' });
  }
};

// @desc Search companies based on query
export const searchCompanies = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid query parameter.' });
    }

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

    return res.status(200).json({ companies: result.rows });
  } catch (err) {
    console.error('Search Companies Error:', err);
    return res.status(500).json({ message: 'Search failed. Please try again.' });
  }
};

// @desc Upload company logo to Supabase and store public URL
export const uploadLogo = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const companyRes = await pool.query(`SELECT id FROM companies WHERE user_id = $1`, [userId]);
    if (companyRes.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found.' });
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
      return res.status(500).json({ message: 'Failed to upload logo to Supabase.' });
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

    return res.status(200).json({
      message: 'Logo uploaded successfully',
      logo_url: logoUrl,
    });
  } catch (err) {
    console.error('Upload Logo Error:', err);
    return res.status(500).json({ message: 'Upload failed.' });
  }
};