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
import { verifyToken } from '../middleware/verifytoken';

console.log("✅ Company routes registered");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', verifyToken, createCompany);
router.get('/me', verifyToken, getMyCompany);
router.put('/update', verifyToken, updateCompany);
router.delete('/delete', verifyToken, deleteCompany);
router.get('/search', searchCompanies);
router.post('/upload-logo', verifyToken, upload.single('logo'), uploadLogo);

export default router;