/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../services/api";

interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  attributes?: Record<string, any>;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
}

interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (
    { orderData, token }: { orderData: any; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await orderService.createOrder(orderData, token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(id, token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const payOrder = createAsyncThunk(
  "orders/payOrder",
  async (
    {
      id,
      paymentResult,
      token,
    }: { id: string; paymentResult: any; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await orderService.updateOrderToPaid(id, paymentResult, token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const listMyOrders = createAsyncThunk(
  "orders/listMyOrders",
  async (token: string, { rejectWithValue }) => {
    try {
      return await orderService.getMyOrders(token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.order = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Pay order
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // List my orders
      .addCase(listMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(listMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderDetails, clearError, resetSuccess } =
  orderSlice.actions;
export default orderSlice.reducer;
