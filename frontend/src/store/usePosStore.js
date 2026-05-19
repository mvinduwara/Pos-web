import { create } from 'zustand';

const usePosStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  cart: [],

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, cart: [] });
  },

  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.product_id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    return {
      cart: [...state.cart, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }],
    };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.product_id !== productId),
  })),

  clearCart: () => set({ cart: [] }),
}));

export default usePosStore;