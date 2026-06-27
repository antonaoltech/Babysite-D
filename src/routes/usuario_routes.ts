import { Router } from 'express';
import UsuarioController from '../controllers/Usuario_controller.js';

const router = Router();

router.get('/', UsuarioController.read);
router.get('/:id', UsuarioController.readById);
router.post('/', UsuarioController.create);
router.post('/login', UsuarioController.login);
router.put('/:id', UsuarioController.update);
router.delete('/:id', UsuarioController.remove);

export default router;