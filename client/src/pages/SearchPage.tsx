/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/product/ProductCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Search, SlidersHorizontal } from "lucide-react";

const SearchPage = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const keywordFromUrl = queryParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(keywordFromUrl);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  const { products, loading, error, page, pages } = useAppSelector(
    (state: any) => state.products
  );
  const { categories } = useAppSelector((state: any) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setKeyword(keywordFromUrl);
  }, [keywordFromUrl]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword,
        category: category || undefined,
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        sortBy,
        sortOrder,
        pageNumber: page,
      })
    );
  }, [dispatch, keyword, category, priceRange, sortBy, sortOrder, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      fetchProducts({
        keyword,
        category: category || undefined,
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        sortBy,
        sortOrder,
        pageNumber: 1,
      })
    );
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {keyword ? `Search Results for "${keyword}"` : "All Products"}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Mobile Toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={toggleFilters}
            className="w-full flex items-center justify-center"
          >
            <SlidersHorizontal size={16} className="mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters - Sidebar */}
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } md:block md:w-64 space-y-6 bg-white p-4 rounded-lg shadow`}
        >
          <div>
            <h2 className="font-semibold mb-3">Search</h2>
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products..."
                className="flex-grow"
              />
              <Button type="submit" size="icon" className="ml-2">
                <Search size={16} />
              </Button>
            </form>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Categories</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox
                  id="all-categories"
                  checked={category === ""}
                  onCheckedChange={() => setCategory("")}
                />
                <Label htmlFor="all-categories" className="ml-2">
                  All Categories
                </Label>
              </div>
              {categories.map((cat: { _id: string; name: string }) => (
                <div key={cat._id} className="flex items-center">
                  <Checkbox
                    id={cat._id}
                    checked={category === cat._id}
                    onCheckedChange={() => setCategory(cat._id)}
                  />
                  <Label htmlFor={cat._id} className="ml-2">
                    {cat.name}
                  </Label>
                </div>
              ))}{" "}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Price Range</h2>
            <Slider
              defaultValue={[0, 1000]}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Sort By</h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Newest</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Sort Order</h2>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSearch} className="w-full">
            Apply Filters
          </Button>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-4">
                No products found. Try adjusting your search criteria.
              </p>
              <Button onClick={() => navigate("/")}>Continue Shopping</Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {products.length} results
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(
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

              {pages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    {[...Array(pages).keys()].map((x) => (
                      <Button
                        key={x + 1}
                        variant={x + 1 === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          dispatch(
                            fetchProducts({
                              keyword,
                              category: category || undefined,
                              priceMin: priceRange[0],
                              priceMax: priceRange[1],
                              sortBy,
                              sortOrder,
                              pageNumber: x + 1,
                            })
                          );
                        }}
                      >
                        {x + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default SearchPage;
