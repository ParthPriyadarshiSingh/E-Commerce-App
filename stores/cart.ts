import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item } from "../types/Item";

type CartItem = Item & { quantity: number };

interface CartState {
  cart: CartItem[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  loadCart: () => Promise<void>;
  getTotalCartItems: () => number;
}

const CART_KEY = "user_cart";

const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  // Add item to cart and save to AsyncStorage
  addToCart: async (item: Item) => {
    set((state) => {
      const existingItem = state.cart.find(
        (cartItem) => cartItem.id === item.id
      );
      let updatedCart;

      if (existingItem) {
        updatedCart = state.cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...state.cart, { ...item, quantity: 1 }];
      }

      // Save updated cart to AsyncStorage
      AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));

      return { cart: updatedCart };
    });
  },

  // Remove item from cart and save to AsyncStorage
  removeFromCart: async (itemId: number) => {
    set((state) => {
      const updatedCart = state.cart.filter(
        (cartItem) => cartItem.id !== itemId
      );

      // Save updated cart to AsyncStorage
      AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));

      return { cart: updatedCart };
    });
  },

  // Clear the cart and save to AsyncStorage
  clearCart: () => {
    set({ cart: [] });
    AsyncStorage.removeItem(CART_KEY); // Remove the cart from storage
  },

  // Calculate total price without using set
  getTotalPrice: () => {
    return get().cart.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );
  },

  // Load cart items from AsyncStorage when the app starts
  loadCart: async () => {
    try {
      const storedCart = await AsyncStorage.getItem(CART_KEY);
      if (storedCart) {
        set({ cart: JSON.parse(storedCart) });
      }
    } catch (error) {
      console.log("Error loading cart from storage:", error);
    }
  },
  getTotalCartItems: () => {
    return get().cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  },
}));

export default useCartStore;
