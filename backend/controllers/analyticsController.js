import { Transaction } from "../models/Transaction.js";
import { Op } from "sequelize";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch all transactions for this user
    const transactions = await Transaction.findAll({
      where: { UserId: userId },
      raw: true
    });

    // 2. Calculate Totals
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = {};
    const monthsMap = {};

    // Helper for Month Names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    transactions.forEach(t => {
      const amount = parseFloat(t.amount);
      const date = new Date(t.date);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      // Totals
      if (t.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        // Category Breakdown (Expenses only)
        if (!categoryMap[t.category]) categoryMap[t.category] = 0;
        categoryMap[t.category] += amount;
      }

      // Monthly Trends
      if (!monthsMap[monthKey]) monthsMap[monthKey] = { income: 0, expense: 0, date: date };
      if (t.type === 'income') monthsMap[monthKey].income += amount;
      else monthsMap[monthKey].expense += amount;
    });

    // 3. Format Data for Frontend
    const categoryBreakdown = Object.keys(categoryMap).map(cat => ({
      category: cat,
      total: categoryMap[cat]
    }));

    // Sort months chronologically and take last 6
    const monthlyTrends = Object.keys(monthsMap)
      .map(key => ({
        month: key.split(" ")[0], // Just the month name (e.g., "Jan")
        fullDate: monthsMap[key].date,
        income: monthsMap[key].income,
        expense: monthsMap[key].expense
      }))
      .sort((a, b) => a.fullDate - b.fullDate)
      .slice(-6);

    return res.json({
      totalIncome,
      totalExpense,
      categoryBreakdown,
      monthlyTrends
    });

  } catch (err) {
    console.error("Analytics Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};