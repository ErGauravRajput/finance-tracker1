import express from "express";
import { createTransaction, getTransactions, deleteTransaction, updateTransaction } from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, allowRoles("admin", "user", "read-only"), getTransactions);
router.post("/", protect, allowRoles("admin", "user"), createTransaction);
router.put("/:id", protect, allowRoles("admin", "user"), updateTransaction); // Added Edit Route
router.delete("/:id", protect, allowRoles("admin", "user"), deleteTransaction);

export default router;