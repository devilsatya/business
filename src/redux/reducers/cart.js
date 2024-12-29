import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartReducer = createReducer(initialState, {
  addToCart: (state, action) => {
    const item = action.payload;

    // Check if the product is a saree (you can use a property like `subcategory`)
    const isSaree = item.subcategory === "Saree";

    // Logic to check if the item already exists in the cart
    const existingItemIndex = state.cart.findIndex((i) => {
      if (isSaree) {
        // For sarees, match only by _id and color
        return i._id === item._id && i.color === item.color;
      } else {
        // For other products, match by _id, size, and color
        return i._id === item._id && i.size === item.size && i.color === item.color;
      }
    });

    if (existingItemIndex >= 0) {
      // If the same item exists, update it (overwrite the old item)
      const updatedCart = [...state.cart];
      updatedCart[existingItemIndex] = item;
      return {
        ...state,
        cart: updatedCart,
      };
    } else {
      // If the item is new, add it to the cart
      return {
        ...state,
        cart: [...state.cart, item],
      };
    }
  },

  removeFromCart: (state, action) => {
    const { _id, color, size, removeAll } = action.payload;

    if (removeAll) {
      // If removeAll is true, remove the entire product with all variations
      return {
        ...state,
        cart: state.cart.filter((i) => i._id !== _id),
      };
    } else {
      // Remove only the specific variation of the product
      return {
        ...state,
        cart: state.cart.filter((i) => {
          // Check if it's a saree, and remove based on _id and color
          if (i.subcategory === "Saree") {
            return !(i._id === _id && i.color === color);
          }
          // For other products, remove based on _id, size, and color
          return !(i._id === _id && i.color === color && i.size === size);
        }),
      };
    }
  },
});