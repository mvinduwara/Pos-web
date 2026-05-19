import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import usePosStore from '../store/usePosStore';

export default function PosTerminal() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState(null); // Tracks the completed order
  const { cart, addToCart, removeFromCart, clearCart } = usePosStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      const payload = {
        payment_method: 'cash',
        items: cart
      };
      const response = await API.post('/transactions', payload);
      
      // Capture the cart state BEFORE clearing it so we can print it
      setReceiptData({
        orderId: response.data.id || Math.floor(Math.random() * 100000),
        items: [...cart],
        total: cartTotal,
        date: new Date().toLocaleString()
      });

      clearCart();
      fetchProducts();
    } catch (error) {
      alert('Checkout failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      {/* We add print:hidden to the main application wrapper. 
        When the browser prints, this entire screen disappears!
      */}
      <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden print:hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="bg-white shadow-sm z-10 px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">TechPOS</h1>
              <p className="text-sm text-slate-500 font-medium">Terminal Active</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-all shadow-sm"
            >
              Exit Terminal
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-bold text-slate-800">Menu</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    onClick={() => product.stock > 0 && addToCart(product)}
                    className={`group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between h-48 relative overflow-hidden ${product.stock <= 0 ? 'opacity-60 grayscale cursor-not-allowed' : ''}`}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">{product.name}</h3>
                      <span className="text-xs font-bold tracking-wider uppercase text-slate-400">{product.category}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-2xl font-extrabold text-blue-600">${parseFloat(product.price).toFixed(2)}</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Sidebar Cart */}
        <div className="w-[400px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-20">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Current Order</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                <p className="font-medium text-lg">No items selected</p>
                <p className="text-sm text-center">Tap a product to add it to the order.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 truncate pr-2">{item.name}</p>
                      <p className="text-sm font-medium text-slate-500">
                        ${parseFloat(item.price).toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-extrabold text-slate-800">${(item.quantity * item.price).toFixed(2)}</p>
                      <button 
                        onClick={() => removeFromCart(item.product_id)}
                        className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center font-bold transition-all"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <div className="flex justify-between text-xl font-extrabold text-slate-900 mb-6">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 transition-all flex items-center justify-center gap-2"
            >
              Charge ${cartTotal.toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* RECEIPT MODAL 
        This is normally hidden, but displays as a popup after checkout.
        When printed, the print: block makes it take up the whole page.
      */}
      {receiptData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:bg-white print:p-0 print:block">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm print:shadow-none print:w-full print:max-w-full print:p-4 print:m-0 font-mono text-slate-900">
            
            <div className="text-center mb-6 border-b border-dashed border-slate-300 pb-6">
              <h2 className="text-2xl font-black uppercase tracking-widest mb-1">TechPOS</h2>
              <p className="text-xs text-slate-500">123 Retail Avenue<br/>City, State 12345</p>
              <p className="text-xs text-slate-500 mt-2">Tel: (555) 123-4567</p>
            </div>

            <div className="mb-4 text-sm flex justify-between">
              <span>Order: #{String(receiptData.orderId).padStart(5, '0')}</span>
              <span>{receiptData.date.split(',')[0]}</span>
            </div>

            <div className="border-b border-dashed border-slate-300 pb-4 mb-4">
              <div className="flex justify-between text-xs font-bold mb-2 uppercase">
                <span>Item</span>
                <span>Amount</span>
              </div>
              {receiptData.items.map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm mb-1">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xl font-black mb-8">
              <span>TOTAL</span>
              <span>${receiptData.total.toFixed(2)}</span>
            </div>

            <div className="text-center text-xs text-slate-500 uppercase tracking-widest mb-8">
              <p>Thank you for your purchase!</p>
              <p>Please come again.</p>
            </div>

            {/* Print & Close Buttons (Hidden during actual physical print) */}
            <div className="flex gap-3 print:hidden">
              <button 
                onClick={() => window.print()} 
                className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
              >
                Print Receipt
              </button>
              <button 
                onClick={() => setReceiptData(null)} 
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors"
              >
                New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}