import express from 'express';
import { getAllMahasiswa, findOneMahasiswa, createMahasiswa, updateMahasiswa, deleteMahasiswa } from '../controllers/MahasiswaController';

const router = express.Router();

router.get('/mahasiswa/getAll', getAllMahasiswa);
router.get('/mahasiswa/findOne/:nim', findOneMahasiswa);
router.post('/mahasiswa/create', createMahasiswa);
router.patch('/mahasiswa/update/:nim', updateMahasiswa);
router.delete('/mahasiswa/delete/:nim', deleteMahasiswa);

export default router;
