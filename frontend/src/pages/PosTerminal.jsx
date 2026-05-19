import { useState, useEffect } from 'react';
import API from '../services/api';
import usePosStore from '../store/usePosStore';

export default function PosTerminal() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart, clearCart } = usePosStore();

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
    if (cart.length === 0) return alert('Cart is empty');
    
    try {
      const payload = {
        payment_method: 'cash',
        items: cart
      };
      await API.post('/transactions', payload);
      alert('Checkout successful!');
      clearCart();
      fetchProducts();
    } catch (error) {
      alert('Checkout failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Point of Sale</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-md min-h-[70vh]">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Products</h2>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border p-4 rounded hover:shadow-lg transition flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-gray-600">${parseFloat(product.price).toFixed(2)}</p>
                    <p className="text-sm text-gray-400 mb-4">Stock: {product.stock}</p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col min-h-[70vh]">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Current Order</h2>
          <div className="flex-grow overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.product_id} className="flex justify-between items-center mb-4 p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x ${parseFloat(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold">${(item.quantity * item.price).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-red-500 font-bold hover:text-red-700"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4 text-xl font-bold">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              Pay / Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}