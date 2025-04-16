/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../redux/slices/cartSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Trash2, AlertCircle, ShoppingBag } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    items = [],
    totalQuantity = 0,
    totalPrice = 0,
    loading,
    error,
  } = useAppSelector((state: any) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      dispatch(getCart(user.token));
    }
  }, [dispatch, isAuthenticated, user]);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (user?.token) {
      dispatch(updateCartItem({ itemId, quantity, token: user.token }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (user?.token) {
      dispatch(removeCartItem({ itemId, token: user.token }));
    }
  };

  const handleCheckout = () => {
    navigate("/shipping");
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="mb-6">Please sign in to view your cart</p>
        <Link to="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

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

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="mb-6">
          Looks like you haven't added any products to your cart yet
        </p>
        <Link to="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* @ts-expect-error - Explain why you expect an error here */}
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          <img
                            src={item.product.images[0] || "/placeholder.jpg"}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="text-sm font-medium text-gray-900 hover:text-primary"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-24">
                        <Input
                          type="number"
                          min="1"
                          max={item.product.countInStock}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item._id,
                              parseInt(e.target.value)
                            )
                          }
                          className="text-center"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Link to="/">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Items ({totalQuantity}):</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full"
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
