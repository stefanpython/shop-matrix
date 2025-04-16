/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/api";

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  images: string[];
  reviews?: any[];
}

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  topProducts: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  page: number;
  pages: number;
  success: boolean;
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  topProducts: [],
  product: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  success: false,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: any = {}, { rejectWithValue }) => {
    try {
      return await productService.getProducts(params);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      return await productService.getProductById(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  "products/fetchTopProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getTopProducts();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (count: number = 8, { rejectWithValue }) => {
    try {
      return await productService.getFeaturedProducts(count);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProductReview = createAsyncThunk(
  "products/createProductReview",
  async (
    {
      productId,
      review,
      token,
    }: { productId: string; review: any; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await productService.createProductReview(productId, review, token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.product = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch top products
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch featured products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create product review
      .addCase(createProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProductReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearProductDetails, clearError } = productSlice.actions;
export default productSlice.reducer;
