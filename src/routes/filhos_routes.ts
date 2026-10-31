import { Router } from 'express';
import FilhosController from '../controllers/filhos_controller.js';

const router = Router();

router.get('/', FilhosController.read);
router.get('/:id', FilhosController.readById);
router.post('/', FilhosController.create);
router.put('/:id', FilhosController.update);
router.delete('/:id', FilhosController.remove);

export default router;