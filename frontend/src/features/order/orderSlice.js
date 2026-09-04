import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderApi from "../../api/orderApi";
import paymentApi from "../../api/paymentApi";
import { resetCart } from "../cart/cartSlice";

const initialState = {
  orders: [],
  status: "idle",
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      return await orderApi.getOrders(getState().auth.token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  "orders/place",
  async (orderDetails, { getState, dispatch, rejectWithValue }) => {
    try {
      const order = await orderApi.createOrder(getState().auth.token, orderDetails);
      // The backend already cleared the cart server-side when it created
      // the order - mirror that locally instead of re-fetching.
      dispatch(resetCart());
      return order;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Same idea as placeOrder, but for the Razorpay flow - this runs AFTER the
// user has already paid in the Razorpay popup. The backend only creates the
// order (and clears the cart) if it can verify the payment is genuine.
export const verifyRazorpayPayment = createAsyncThunk(
  "orders/verifyPayment",
  async (paymentData, { getState, dispatch, rejectWithValue }) => {
    try {
      const order = await paymentApi.verifyPayment(getState().auth.token, paymentData);
      dispatch(resetCart());
      return order;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.orders = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Could not load your orders.";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Could not place your order.";
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders.unshift(action.payload);
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Payment verification failed.";
      });
  },
});

export const { resetOrders } = orderSlice.actions;

export default orderSlice.reducer;
