import express from "express";
import { getAllUsers,deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only Admins can view all users
router.get("/", protect, allowRoles("admin"), getAllUsers);
router.delete("/:id", protect, allowRoles("admin"), deleteUser);
export default router;


