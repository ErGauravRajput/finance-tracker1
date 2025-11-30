
import { Transaction } from "../models/Transaction.js";
import { Op } from "sequelize";
export const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await Transaction.create({
      type, category, amount, date, UserId: req.user.id
    });

    return res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Updated with Pagination
export const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const type = req.query.type || "all";
    const offset = (page - 1) * limit;

    // Build the query object
    const whereClause = { UserId: req.user.id };

    // Add Search Filter (Case-insensitive search on Category)
    if (search) {
      whereClause.category = { [Op.iLike]: `%${search}%` }; // Use Op.like for MySQL/SQLite
    }

    // Add Type Filter
    if (type !== "all") {
      whereClause.type = type;
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where: whereClause,
      order: [["date", "DESC"], ["id", "DESC"]],
      limit,
      offset
    });

    return res.json({
      transactions: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// New Update Method
export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, category, amount, date } = req.body;

        const transaction = await Transaction.findOne({ where: { id, UserId: req.user.id } });
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        transaction.type = type || transaction.type;
        transaction.category = category || transaction.category;
        transaction.amount = amount || transaction.amount;
        transaction.date = date || transaction.date;

        await transaction.save();

        res.json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.destroy({ where: { id, UserId: req.user.id } });

    if (!deleted) return res.status(404).json({ message: "Transaction not found" });

    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};