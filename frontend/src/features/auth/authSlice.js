import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";

const initialState = {
  user: null,
  token: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  isAuthModalOpen: false,
  authModalMode: "login", // login | register
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      return await authApi.register(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await authApi.login(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Verifies a persisted token is still valid on app load - a stale/expired
// token must not leave the UI stuck thinking it's logged in.
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchMe",
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) return rejectWithValue("Not logged in.");
    try {
      return { user: await authApi.fetchMe(token), token };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
    },
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalMode = action.payload === "register" ? "register" : "login";
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthModalOpen = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed.";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthModalOpen = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed.";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // The persisted token is invalid/expired - clear the stale session.
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, openAuthModal, closeAuthModal } = authSlice.actions;

export const selectIsAuthenticated = (state) => Boolean(state.auth.token && state.auth.user);

export default authSlice.reducer;
