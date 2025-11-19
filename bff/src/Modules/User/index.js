import { Router } from 'express';
const router = Router();
router.get('/test', (req, res) => res.json({ message: 'Routes work' }));
export default router;
