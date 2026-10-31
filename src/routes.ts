import { Router } from 'express';
import usuarioRoutes from './routes/usuario_routes.js';
import babaRoutes from './routes/baba_routes.js';
import filhosRoutes from './routes/filhos_routes.js';
import paisRoutes from './routes/pais_routes.js';

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/babas', babaRoutes);
router.use('/filhos', filhosRoutes);
router.use('/pais', paisRoutes);
router.use('/responsaveis', paisRoutes);
router.use('/auth', usuarioRoutes);

export default router;
