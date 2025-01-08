import express from 'express';
import { getAllBuku, findOneBuku, createBuku, updateBuku, deleteBuku } from '../controllers/BukuController';

const router = express.Router();

router.get('/buku/getAll', getAllBuku);
router.get('/buku/findOne/:id_buku', findOneBuku);
router.post('/buku/create', createBuku);
router.patch('/buku/update/:id_buku', updateBuku);
router.delete('/buku/delete/:id_buku', deleteBuku);

export default router;
