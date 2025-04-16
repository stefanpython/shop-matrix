import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    rating: number;
    numReviews: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>

      <CardContent className="p-4 flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">
                {i < Math.floor(product.rating) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.numReviews}{" "}
            {product.numReviews === 1 ? "review" : "reviews"})
          </span>
        </div>

        <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/product/${product._id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <ShoppingCart size={16} className="mr-2" />
            View Product
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
