import { create } from "zustand";

// Wholesale B2B minimum order quantity per product
const MIN_ORDER_QUANTITY = 5;

const useCartStore = create((set, get) => ({
  // Cart items: { productId, product, quantity }
  items: [],
  minOrderQuantity: MIN_ORDER_QUANTITY,

  // Add item to cart
  addItem: (product, quantity = MIN_ORDER_QUANTITY) => {
    // Enforce minimum quantity for wholesale ordering
    const validQuantity = Math.max(quantity, MIN_ORDER_QUANTITY);

    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === product.id,
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += validQuantity;
        return { items: updatedItems };
      } else {
        // Add new item
        return {
          items: [
            ...state.items,
            {
              productId: product.id,
              product,
              quantity: validQuantity,
            },
          ],
        };
      }
    });
  },

  // Update item quantity
  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return {
          items: state.items.filter((item) => item.productId !== productId),
        };
      }

      // Enforce minimum quantity for wholesale ordering
      const validQuantity = Math.max(quantity, MIN_ORDER_QUANTITY);

      const updatedItems = state.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: validQuantity }
          : item,
      );
      return { items: updatedItems };
    });
  },

  // Remove item from cart
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  // Clear entire cart
  clearCart: () => {
    set({ items: [] });
  },

  // Get total items count
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  // Get total price
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  },

  // Check if product is in cart
  isInCart: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },

  // Get item quantity
  getItemQuantity: (productId) => {
    const item = get().items.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  },
}));

export default useCartStore;
