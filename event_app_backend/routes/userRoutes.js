import express from 'express';
// import { protect, admin } from '../middlewares/authMiddleware.js';
import { getAllUsers, handlerDeleteUser, handlerEditUser } from '../controllers/userController.js';

const router = express.Router();

router.get("/",getAllUsers);
router.delete("/:id",handlerDeleteUser);
router.put("/:id", handlerEditUser);

export default router;
