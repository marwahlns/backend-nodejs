import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { getAllPeminjaman, getDataDipinjam, createPeminjaman, updateStatusPeminjaman, exportExcel } from '../controllers/PeminjamanController';

const router = express.Router();

router.use(verifyToken);

router.get('/peminjaman/getAll', getAllPeminjaman);
router.get('/peminjaman/getDataDipinjam', getDataDipinjam);
router.post('/peminjaman/create', createPeminjaman);
router.patch('/peminjaman/update/:id', updateStatusPeminjaman);
router.get('/peminjaman/export', exportExcel);

export default router;
