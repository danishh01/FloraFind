import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartApi from "../../api/cartApi";

const initialState = {
  cartItems: [],
  status: "idle",
  error: null,
};

// Every thunk here reads the token from state rather than requiring the
// caller to pass it - the cart only ever acts on the logged-in user's own
// cart, and callers already check auth before dispatching (see
// ProductCard/Cart/Checkout).
export const fetchCart = createAsyncThunk("cart/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    return await cartApi.getCart(getState().auth.token);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addToCart = createAsyncThunk(
  "cart/addItem",
  async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
    try {
      return await cartApi.addItem(getState().auth.token, productId, quantity);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (productId, { getState, rejectWithValue }) => {
    const item = getState().cart.cartItems.find((i) => i.id === productId);
    try {
      return await cartApi.updateItem(getState().auth.token, productId, (item?.quantity || 0) + 1);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (productId, { getState, rejectWithValue }) => {
    const item = getState().cart.cartItems.find((i) => i.id === productId);
    const nextQuantity = (item?.quantity || 1) - 1;
    try {
      if (nextQuantity < 1) {
        return await cartApi.removeItem(getState().auth.token, productId);
      }
      return await cartApi.updateItem(getState().auth.token, productId, nextQuantity);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeItem",
  async (productId, { getState, rejectWithValue }) => {
    try {
      return await cartApi.removeItem(getState().auth.token, productId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearCart = createAsyncThunk("cart/clear", async (_, { getState, rejectWithValue }) => {
  try {
    return await cartApi.clearCart(getState().auth.token);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cartItems = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setItems = (state, action) => {
      state.status = "succeeded";
      state.cartItems = action.payload;
    };
    const setError = (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Something went wrong with your cart.";
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, setItems)
      .addCase(fetchCart.rejected, setError)
      .addCase(addToCart.fulfilled, setItems)
      .addCase(addToCart.rejected, setError)
      .addCase(increaseQuantity.fulfilled, setItems)
      .addCase(increaseQuantity.rejected, setError)
      .addCase(decreaseQuantity.fulfilled, setItems)
      .addCase(decreaseQuantity.rejected, setError)
      .addCase(removeFromCart.fulfilled, setItems)
      .addCase(removeFromCart.rejected, setError)
      .addCase(clearCart.fulfilled, setItems)
      .addCase(clearCart.rejected, setError);
  },
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
