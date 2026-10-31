import { Router } from 'express';
import FilhosController from '@/controllers/FilhosController.ts';

const router = Router();

router.get('/', FilhosController.read);
router.get('/:id', FilhosController.readById);
router.post('/', FilhosController.create);
router.put('/:id', FilhosController.update);
router.delete('/:id', FilhosController.remove);

export default router;