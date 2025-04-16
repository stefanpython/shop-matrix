/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, SetStateAction } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchProductDetails,
  createProductReview,
  clearError,
} from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import Rating from "../components/product/Rating";
import { AlertCircle, Minus, Plus, ShoppingCart } from "lucide-react";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  interface Product {
    name: string;
    images: string[];
    rating: number;
    numReviews: number;
    price: number;
    description: string;
    richDescription?: string;
    countInStock: number;
    attributes?: Record<string, string>;
    reviews?: Array<{
      _id: string;
      user: { name: string };
      createdAt: string;
      rating: number;
      title: string;
      comment: string;
    }>;
  }

  interface ProductState {
    product: Product | null;
    loading: boolean;
    error: string | null;
    success: boolean;
  }

  const { product, loading, error, success } = useAppSelector(
    (state: {
      auth: { isAuthenticated: boolean; user: { token: string } | null };
      cart: unknown;
      products: unknown;
      categories: unknown;
      orders: unknown;
      addresses: unknown;
    }) => state.products as ProductState
  );
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }

    if (success) {
      setRating(0);
      setTitle("");
      setComment("");
      dispatch(clearError());
    }
  }, [dispatch, id, success]);

  const handleAddToCart = () => {
    if (id) {
      dispatch(
        addToCart({
          productId: id,
          quantity,
          token: user?.token || "",
        })
      );
      navigate("/cart");
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (id && user?.token) {
      dispatch(
        createProductReview({
          productId: id,
          review: { rating, title, comment },
          token: user.token,
        })
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.countInStock) {
      setQuantity(quantity + 1);
    }
  };

  if (loading) {
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

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.images[selectedImage] || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image: any, index: number) => (
                <div
                  key={index}
                  className={`aspect-square border rounded cursor-pointer ${
                    selectedImage === index ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}{" "}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="mb-4">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>

          <div className="text-2xl font-bold mb-4">
            ${product.price.toFixed(2)}
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Stock and Quantity */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="mr-2">Status:</span>
              {product.countInStock > 0 ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>

            {product.countInStock > 0 && (
              <div className="flex items-center">
                <span className="mr-2">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.countInStock}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="w-full"
          >
            <ShoppingCart size={16} className="mr-2" />
            {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Product Details and Reviews */}
      <Tabs defaultValue="details" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: product.richDescription || product.description,
              }}
            />

            {product.attributes &&
              Object.keys(product.attributes).length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mt-6 mb-4">
                    Specifications
                  </h3>
                  <table className="w-full border-collapse">
                    <tbody>
                      {Object.entries(product.attributes).map(
                        ([key, value]) => (
                          <tr key={key} className="border-b">
                            <td className="py-2 font-medium">{key}</td>
                            <td className="py-2">{value as string}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </>
              )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>

          {product.reviews && product.reviews.length === 0 && (
            <p>No reviews yet</p>
          )}

          {product.reviews && product.reviews.length > 0 && (
            <div className="space-y-4 mb-8">
              {product.reviews.map(
                (review: {
                  _id: string;
                  user: { name: string };
                  createdAt: string;
                  rating: number;
                  title: string;
                  comment: string;
                }) => (
                  <div key={review._id} className="border p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <strong>{review.user.name}</strong>
                      <span className="text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Rating value={review.rating} />
                    <h4 className="font-medium mt-2">{review.title}</h4>
                    <p className="mt-1">{review.comment}</p>
                  </div>
                )
              )}{" "}
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">Write a Review</h4>

            {!isAuthenticated ? (
              <p>
                Please{" "}
                <a href="/login" className="text-primary hover:underline">
                  sign in
                </a>{" "}
                to write a review
              </p>
            ) : (
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium mb-1"
                  >
                    Rating
                  </label>
                  <Select
                    value={rating.toString()}
                    onValueChange={(value: string) => setRating(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Poor</SelectItem>
                      <SelectItem value="2">2 - Fair</SelectItem>
                      <SelectItem value="3">3 - Good</SelectItem>
                      <SelectItem value="4">4 - Very Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-1"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium mb-1"
                  >
                    Comment
                  </label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e: {
                      target: { value: SetStateAction<string> };
                    }) => setComment(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit">Submit Review</Button>
              </form>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ProductPage;
