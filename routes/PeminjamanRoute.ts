import express from 'express';
import { getAllPeminjaman, createPeminjaman, updateStatusPeminjaman } from '../controllers/PeminjamanController';

const router = express.Router();

router.get('/peminjaman/getAll', getAllPeminjaman);
router.post('/peminjaman/create', createPeminjaman);
router.patch('/peminjaman/update/:id', updateStatusPeminjaman);

export default router;
