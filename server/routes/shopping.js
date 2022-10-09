import express from 'express';
import { get } from '../controllers/shopping.js';

const router = express.Router();

router.get('/', get);

export default router;
