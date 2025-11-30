import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

const TrendLine = ({ trends }) => {
  if (!trends || !trends.length) return <p style={{textAlign: "center", padding: "2rem"}}>No trend data available</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={trends} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#82ca9d" strokeWidth={2} name="Income" />
        <Line type="monotone" dataKey="expense" stroke="#ff7f7f" strokeWidth={2} name="Expense" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendLine;