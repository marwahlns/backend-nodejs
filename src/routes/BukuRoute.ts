import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { getAllBuku, findOneBuku, createBuku, updateBuku, deleteBuku } from '../controllers/BukuController';

const router = express.Router();

router.use(verifyToken);

router.get('/buku/getAll', getAllBuku);
router.get('/buku/findOne/:id_buku', findOneBuku);
router.post('/buku/create', createBuku);
router.patch('/buku/update/:id_buku', updateBuku);
router.delete('/buku/delete/:id_buku', deleteBuku);

export default router;
