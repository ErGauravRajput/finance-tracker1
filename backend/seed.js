import { connectDB, sequelize } from "./config/db.js";
import { User } from "./models/User.js";
import { Transaction } from "./models/Transaction.js";
import bcrypt from "bcryptjs";

const seed = async () => {
  try {
    await connectDB();
    
    // 1. Force Sync (Drops existing tables & recreates them)
    // ⚠️ WARNING: This deletes all data. Use only for setup.
    await sequelize.sync({ force: true });
    console.log("🗑️  Database cleared");

    // 2. Create Password Hash
    const password = await bcrypt.hash("password123", 10);

    // 3. Create Users (Admin, User, Read-only)
    const users = await User.bulkCreate([
      { name: "Admin User", email: "admin@example.com", password, role: "admin" },
      { name: "Regular User", email: "user@example.com", password, role: "user" },
      { name: "Viewer User", email: "viewer@example.com", password, role: "read-only" },
    ]);
    console.log("✅ Users created (Password: password123)");

    // 4. Create Dummy Transactions for "Regular User"
    const userId = users[1].id; // The Regular User
    const transactions = [
      { type: "income", category: "Salary", amount: 50000, date: "2025-10-01", UserId: userId },
      { type: "expense", category: "Rent", amount: 15000, date: "2025-09-05", UserId: userId },
      { type: "expense", category: "Groceries", amount: 4500, date: "2025-08-10", UserId: userId },
      { type: "expense", category: "Utilities", amount: 2000, date: "2025-07-15", UserId: userId },
      { type: "income", category: "Freelance", amount: 12000, date: "2025-05-20", UserId: userId },
      { type: "expense", category: "Entertainment", amount: 3000, date: "2025-04-25", UserId: userId },
    ];

    await Transaction.bulkCreate(transactions);
    console.log("✅ Dummy transactions added");

    // 🟢 5. NEW: Create Dummy Transactions for "Viewer User"
    const viewerId = users[2].id;
    const viewerTransactions = [
      { type: "income", category: "Investments", amount: 80000, date: "2025-10-02", UserId: viewerId },
      { type: "expense", category: "Travel", amount: 25000, date: "2025-09-08", UserId: viewerId },
      { type: "expense", category: "Food", amount: 6000, date: "2025-08-12", UserId: viewerId },
      { type: "income", category: "Bonus", amount: 15000, date: "2025-07-28", UserId: viewerId },
    ];
    await Transaction.bulkCreate(viewerTransactions);
    console.log("✅ Transactions added for Viewer User");

    console.log("\n🎉 Seeding Complete! Use these credentials:");
    console.log("------------------------------------------------");
    console.log("Admin:    admin@example.com   / password123");
    console.log("User:     user@example.com    / password123");
    console.log("Viewer:   viewer@example.com  / password123");
    console.log("------------------------------------------------\n");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();