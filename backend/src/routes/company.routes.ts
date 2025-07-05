// routes/company.routes.ts

import express from 'express';
import multer from 'multer';
import {
  createCompany,
  getMyCompany,
  updateCompany,
  deleteCompany,
  searchCompanies,
  uploadLogo
} from '../controllers/company.controller';
import { verifyToken } from '../middleware/verifyToken'; // ✅ Correct casing
import { AuthenticatedRequest } from '../middleware/verifyToken';

console.log('✅ Company routes registered');

const router = express.Router();

// Set up multer with memory storage for logo uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', verifyToken, createCompany);
router.get('/me', verifyToken, getMyCompany);
router.put('/update', verifyToken, updateCompany);
router.delete('/delete', verifyToken, deleteCompany);
router.get('/search', searchCompanies);

// Logo upload route: expects multipart/form-data with field name `logo`
router.post('/upload-logo', verifyToken, upload.single('logo'), uploadLogo);

export default router;
