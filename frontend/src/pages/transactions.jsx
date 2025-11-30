import { useCallback, useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/authContext";

const emptyForm = { type: "expense", category: "", amount: "", date: "" };

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  
  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");      // New State
  const [filterType, setFilterType] = useState("all"); // New State

  const readOnly = user?.role === "read-only";

  const fetchTransactions = useCallback(async () => {
    try {
      // Send search & type to backend
      const { data } = await api.get(
        `/transactions?page=${page}&limit=5&search=${search}&type=${filterType}`
      );
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
  }, [page, search, filterType]); // Re-fetch when these change

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 500); 
    return () => clearTimeout(timer);
  }, [fetchTransactions]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // ... (Keep handleSubmit, handleEdit, handleDelete same as before)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readOnly) return;
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editingId) await api.put(`/transactions/${editingId}`, payload);
      else await api.post("/transactions", payload);
      setForm(emptyForm);
      setEditingId(null);
      fetchTransactions();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (t) => {
    setForm({ type: t.type, category: t.category, amount: t.amount, date: t.date });
    setEditingId(t.id);
  };

  const handleDelete = async (id) => {
    if (readOnly) return;
    try { await api.delete(`/transactions/${id}`); fetchTransactions(); } 
    catch (err) { console.error(err); }
  };

  return (
    <div className="page">
      <h2>Transactions</h2>
      
      {/* Search and Filter Section */}
      <div className="filters" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          placeholder="Search Category..." 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} // Reset to page 1 on search
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <select 
          value={filterType} 
          onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {!readOnly && (
        <form className="form-inline" onSubmit={handleSubmit} style={{marginBottom: '2rem'}}>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
          <button type="submit" className="btn-primary">
            {editingId ? "Update" : "Add"}
          </button>
           {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Type</th><th>Category</th><th>Amount (₹)</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.type}</td><td>{t.category}</td><td>{t.amount}</td><td>{t.date}</td>
              <td>
                <button className="btn-secondary" style={{marginRight: '10px'}} onClick={() => handleEdit(t)} disabled={readOnly}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(t.id)} disabled={readOnly}>Delete</button>
              </td>
            </tr>
          ))}
           {transactions.length === 0 && <tr><td colSpan="5" style={{textAlign:"center"}}>No transactions found</td></tr>}
        </tbody>
      </table>
      
      <div className="pagination" style={{marginTop: '1rem', display: 'flex', gap: '10px', justifyContent: 'center'}}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary">Next</button>
      </div>
    </div>
  );
};

export default Transactions;