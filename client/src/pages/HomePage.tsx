/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  //   JSXElementConstructor,
  Key,
  //   ReactElement,
  //   ReactNode,
  //   ReactPortal,
  useEffect,
} from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchFeaturedProducts,
  fetchTopProducts,
} from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/product/ProductCard";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { featuredProducts, topProducts, loading } = useAppSelector(
    (state: any) => state.products
  );
  const { categories } = useAppSelector((state: any) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts(0));
    dispatch(fetchTopProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-12 mb-12 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Shop the Latest Products
              </h1>
              <p className="text-lg mb-6">
                Discover amazing products at great prices. Quality items for
                every need.
              </p>
              <Link to="/search">
                <Button size="lg">
                  Shop Now <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img
                src="/hero-image.jpg"
                alt="Shopping"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link
            to="/search"
            className="text-primary hover:underline flex items-center"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(
              (product: {
                _id: string;
                name: string;
                images: string[];
                price: number;
                rating: number;
                numReviews: number;
              }) => (
                <ProductCard key={product._id} product={product} />
              )
            )}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(
            (category: {
              _id: Key | null | undefined;
              image: string;
              name: string;
            }) => (
              <Link
                key={category._id}
                to={`/category/${category._id}`}
                className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 transition-colors"
              >
                {category.image && (
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={String(category.name)}
                    className="w-16 h-16 mx-auto mb-2 object-contain"
                  />
                )}
                <h3 className="font-medium">{category.name}</h3>
              </Link>
            )
          )}{" "}
        </div>
      </section>

      {/* Top Rated Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top Rated Products</h2>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topProducts.map(
              (product: {
                _id: string;
                name: string;
                images: string[];
                price: number;
                rating: number;
                numReviews: number;
              }) => (
                <ProductCard key={product._id} product={product} />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
};
export default HomePage;
