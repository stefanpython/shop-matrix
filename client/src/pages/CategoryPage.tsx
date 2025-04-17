/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchCategoryById } from "../redux/slices/categorySlice";
import ProductCard from "../components/product/ProductCard";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { RootState } from "@/redux/store";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useAppSelector((state: RootState) => state.products);
  const {
    category,
    loading: categoryLoading,
    error: categoryError,
  } = useAppSelector(
    (state: RootState) =>
      state.categories as {
        category: any;
        loading: boolean;
        error: string | null;
      }
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(id));
      dispatch(fetchProducts({ category: id }));
    }
  }, [dispatch, id]);

  const loading = productsLoading || categoryLoading;
  const error = productsError || categoryError;

  if (loading && !category) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!category) {
    return <div className="text-center py-8">Category not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        <h1 className="text-2xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </div>

      {productsLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">No products found in this category</p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
export default CategoryPage;
