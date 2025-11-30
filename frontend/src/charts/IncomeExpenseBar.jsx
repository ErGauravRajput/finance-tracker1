import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

const IncomeExpenseBar = ({ income, expense }) => {
  const data = [{ name: "Overview", income, expense }];

  const colors = {
    income: "url(#incomeGradient)",
    expense: "url(#expenseGradient)",
  };

  const isDark = document.body.getAttribute("data-theme") === "dark";

  return (
    <div className="income-expense-wrapper">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart 
          data={data} 
          barSize={70} 
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          barGap={30}
        >
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>

            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" stroke="#555" />
          <YAxis stroke="#555" />

          {/* 🟢 UPDATE: Added cursor={false} to remove the hover background */}
          <Tooltip
            cursor={false} 
            contentStyle={{
              background: isDark ? "#161b22" : "#fff",
              color: isDark ? "#f8fafc" : "#0f172a",
              border: isDark ? "1px solid #2d333b" : "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 8px 28px rgba(0, 0, 0, 0.06)"
            }}
          />

          <Legend />

          <Bar dataKey="income" radius={[10, 10, 10, 10]} fill={colors.income} name="Income" />
          <Bar dataKey="expense" radius={[10, 10, 10, 10]} fill={colors.expense} name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseBar;