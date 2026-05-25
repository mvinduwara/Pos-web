import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import usePosStore from '../store/usePosStore';

export default function Dashboard() {
    const [metrics, setMetrics] = useState({ revenue: 0, orders: 0, lowStock: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const logout = usePosStore((state) => state.logout);
    const user = usePosStore((state) => state.user);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [txResponse, prodResponse] = await Promise.all([
                API.get('/transactions'),
                API.get('/products')
            ]);

            const transactions = txResponse.data;
            const products = prodResponse.data;

            const totalRevenue = transactions.reduce((sum, tx) => sum + parseFloat(tx.total), 0);
            const lowStockCount = products.filter(p => p.stock < 10).length;

            setMetrics({
                revenue: totalRevenue,
                orders: transactions.length,
                lowStock: lowStockCount
            });

            setRecentTransactions(transactions.slice(-5).reverse());
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">TechPOS Admin</h1>
                    <p className="text-sm text-slate-500 font-medium">Welcome back, {user?.name || 'Admin'}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/inventory')}
                        className="border border-slate-200 text-slate-600 px-5 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => navigate('/users')}
                        className="border border-slate-200 text-slate-600 px-5 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                    >
                        Staff
                    </button>
                    <button
                        onClick={() => navigate('/pos')}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm transition-all"
                    >
                        Launch POS
                    </button>
                    <button
                        onClick={() => navigate('/transactions')}
                        className="border border-slate-200 text-slate-600 px-5 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                    >
                        History
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 px-5 py-2 rounded-lg font-semibold hover:bg-red-100 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Revenue</p>
                                <p className="text-4xl font-extrabold text-slate-900">${metrics.revenue.toFixed(2)}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Orders</p>
                                <p className="text-4xl font-extrabold text-slate-900">{metrics.orders}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Low Stock Alerts</p>
                                <p className={`text-4xl font-extrabold ${metrics.lowStock > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {metrics.lowStock} items
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-100">
                                        <th className="p-4 font-semibold">Order ID</th>
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold">Payment</th>
                                        <th className="p-4 font-semibold">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentTransactions.length > 0 ? (
                                        recentTransactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 font-medium text-slate-900">#{String(tx.id).padStart(5, '0')}</td>
                                                <td className="p-4 text-slate-500">{new Date(tx.created_at).toLocaleString()}</td>
                                                <td className="p-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 capitalize">
                                                        {tx.payment_method}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-bold text-slate-800">${parseFloat(tx.total).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-slate-500">No transactions recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}