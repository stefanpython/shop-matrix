/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addressService } from "../../services/api";

interface Address {
  _id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  address: Address | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AddressState = {
  addresses: [],
  address: null,
  loading: false,
  error: null,
  success: false,
};

export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAddresses",
  async (token: string, { rejectWithValue }) => {
    try {
      return await addressService.getAddresses(token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAddressById = createAsyncThunk(
  "addresses/fetchAddressById",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      return await addressService.getAddressById(id, token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createAddress = createAsyncThunk(
  "addresses/createAddress",
  async (
    { addressData, token }: { addressData: any; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await addressService.createAddress(addressData, token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async (
    { id, addressData, token }: { id: string; addressData: any; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await addressService.updateAddress(id, addressData, token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      return await addressService.deleteAddress(id, token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "addresses/setDefaultAddress",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      return await addressService.setDefaultAddress(id, token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    clearAddressDetails: (state) => {
      state.address = null;
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
      // Fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch address by id
      .addCase(fetchAddressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddressById.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(fetchAddressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create address
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
        state.success = true;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.map((address) =>
          address._id === action.payload._id ? action.payload : address
        );
        state.success = true;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (address) => address._id !== action.meta.arg.id
        );
        state.success = true;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Set default address
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.map((address) => ({
          ...address,
          isDefault: address._id === action.payload._id,
        }));
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAddressDetails, clearError, resetSuccess } =
  addressSlice.actions;
export default addressSlice.reducer;
