import express from 'express';
import { getUtensils, createUtensil, updateUtensil, deleteUtensil } from '../controllers/utensilController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getUtensils)
    .post(protect, admin, createUtensil);

router.route('/:id')
    .put(protect, admin, updateUtensil)
    .delete(protect, admin, deleteUtensil);

export default router;
