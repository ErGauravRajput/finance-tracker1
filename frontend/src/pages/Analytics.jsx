import { useEffect, useState } from "react";
import { api } from "../api/axios";
import CategoryPie from "../charts/CategoryPie";
import TrendLine from "../charts/TrendLine"; // Fixed typo here
import IncomeExpenseBar from "../charts/IncomeExpenseBar";

const Analytics = () => {
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    categoryBreakdown: [],
    monthlyTrends: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/analytics");

        // Format data for charts
        const formattedData = {
          totalIncome: Number(data.totalIncome),
          totalExpense: Number(data.totalExpense),
          // Convert category totals to numbers
          categoryBreakdown: data.categoryBreakdown.map(c => ({
            ...c,
            total: Number(c.total)
          })),
          // Convert trend string values to numbers
          monthlyTrends: data.monthlyTrends.map(t => ({
            ...t,
            income: Number(t.income),
            expense: Number(t.expense)
          }))
        };

        setData(formattedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="page">
      <h2>Analytics</h2>

      <div className="chart-grid">
        <div className="chart-wrapper">
          <h3>Category-wise Expenses</h3>
          <CategoryPie categories={data.categoryBreakdown} />
        </div>

        <div className="chart-wrapper">
          <h3>Monthly Trends</h3>
          <TrendLine trends={data.monthlyTrends} />
        </div>

        <div className="chart-wrapper">
          <h3>Overall Summary</h3>
          <IncomeExpenseBar
            income={data.totalIncome}
            expense={data.totalExpense}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;