import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await API.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sales Ledger</h1>
          <p className="text-sm text-slate-500 font-medium">Full transaction history</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="border border-slate-200 text-slate-600 px-5 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-all"
        >
          Back to Dashboard
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">#{String(tx.id).padStart(5, '0')}</td>
                    <td className="p-4 text-slate-600">{new Date(tx.created_at).toLocaleString()}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold capitalize">
                        {tx.payment_method}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">${parseFloat(tx.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}