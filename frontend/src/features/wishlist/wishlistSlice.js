import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import wishlistApi from "../../api/wishlistApi";

const initialState = {
  wishlistItems: [],
  status: "idle",
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      return await wishlistApi.getWishlist(getState().auth.token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add/remove/toggle all resolve to the same server call shape and simply
// replace the list from the server response - the backend is the source
// of truth for a logged-in user's wishlist.
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (product, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    const alreadyWishlisted = getState().wishlist.wishlistItems.some(
      (item) => item.id === product.id
    );
    try {
      return alreadyWishlisted
        ? await wishlistApi.removeProduct(token, product.id)
        : await wishlistApi.addProduct(token, product.id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, { getState, rejectWithValue }) => {
    try {
      return await wishlistApi.removeProduct(getState().auth.token, productId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.wishlistItems = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setItems = (state, action) => {
      state.status = "succeeded";
      state.wishlistItems = action.payload;
    };
    const setError = (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Something went wrong with your wishlist.";
    };

    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, setItems)
      .addCase(fetchWishlist.rejected, setError)
      .addCase(toggleWishlist.fulfilled, setItems)
      .addCase(toggleWishlist.rejected, setError)
      .addCase(removeFromWishlist.fulfilled, setItems)
      .addCase(removeFromWishlist.rejected, setError);
  },
});

export const { resetWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
