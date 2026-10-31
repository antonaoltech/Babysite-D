import { Router } from 'express';
import PaisController from '../controllers/pais_controller.js';

const router = Router();

router.get('/', PaisController.read);
router.get('/:id', PaisController.readById);
router.post('/', PaisController.create);
router.put('/:id', PaisController.update);
router.delete('/:id', PaisController.remove);

export default router;