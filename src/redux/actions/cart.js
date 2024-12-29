// add to cart
export const addTocart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addToCart",
    payload: data,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};

// remove from cart
export const removeFromCart = (data, removeAll = false) => async (dispatch, getState) => {
  // Prepare payload based on the removeAll flag
  const payload = removeAll
    ? { _id: data._id, removeAll: true } // Remove all variations if removeAll is true
    : { _id: data._id, color: data.color, size: data.size, removeAll: false }; // Remove specific variation

  // Dispatch action to remove the item
  dispatch({
    type: "removeFromCart",
    payload: payload,
  });

  // Update localStorage with the new cart state
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));

  return data;
};

