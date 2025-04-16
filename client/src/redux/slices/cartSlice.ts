import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "../../services/api";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    countInStock: number;
  };
  quantity: number;
  price: number;
  attributes: Record<string, string | number | boolean>;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (token: string, { rejectWithValue }) => {
    try {
      return await cartService.getCart(token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue("An unknown error occurred");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      productId,
      quantity,
      attributes,
      token,
    }: {
      productId: string;
      quantity: number;
      attributes?: Record<string, string | number | boolean>;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await cartService.addToCart(
        { productId, quantity, attributes },
        token
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    {
      itemId,
      quantity,
      attributes,
      token,
    }: {
      itemId: string;
      quantity?: number;
      attributes?: Record<string, string | number | boolean>;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await cartService.updateCartItem(
        itemId,
        { quantity, attributes },
        token
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (
    { itemId, token }: { itemId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await cartService.removeCartItem(itemId, token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (token: string, { rejectWithValue }) => {
    try {
      return await cartService.clearCart(token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove cart item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
