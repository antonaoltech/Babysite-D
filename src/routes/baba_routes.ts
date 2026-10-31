import { Router } from 'express';
import BabaController from '../controllers/baba_controller.js';

const router = Router();

router.get('/', BabaController.read);
router.get('/:id', BabaController.readById);
router.post('/', BabaController.create);
router.put('/:id', BabaController.update);
router.delete('/:id', BabaController.remove);

export default router;