/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createOrder, resetSuccess } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { fetchAddressById } from "../redux/slices/addressSlice";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [shippingAddressDetails, setShippingAddressDetails] =
    useState<any>(null);

  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { loading, error, success, order } = useAppSelector(
    (state: any) => state.orders
  );

  // Calculate prices
  const itemsPrice = totalPrice;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalOrderPrice = (itemsPrice + taxPrice + shippingPrice).toFixed(2);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=placeorder");
      return;
    }

    const shippingAddressId = localStorage.getItem("shippingAddress");
    const paymentMethod = localStorage.getItem("paymentMethod");

    if (!shippingAddressId) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    } else if (user?.token) {
      // Fetch shipping address details
      dispatch(fetchAddressById({ id: shippingAddressId, token: user.token }))
        .unwrap()
        .then((address) => {
          setShippingAddressDetails(address);
        })
        .catch(() => {
          navigate("/shipping");
        });
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order._id}`);
      dispatch(resetSuccess());

      // Clear cart after successful order
      if (user?.token) {
        dispatch(clearCart(user.token));
      }
    }
  }, [dispatch, navigate, order, success, user]);

  const placeOrderHandler = () => {
    if (user?.token && shippingAddressDetails) {
      const paymentMethod =
        localStorage.getItem("paymentMethod") || "Credit Card";

      dispatch(
        createOrder({
          orderData: {
            orderItems: items.map((item) => ({
              product: item.product._id,
              name: item.product.name,
              image: item.product.images[0],
              price: item.price,
              quantity: item.quantity,
              attributes: item.attributes,
            })),
            shippingAddress: shippingAddressDetails._id,
            billingAddress: shippingAddressDetails._id, // Using same address for billing
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice: Number(totalOrderPrice),
          },
          token: user.token,
        })
      );
    }
  };

  if (!shippingAddressDetails) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Place Order</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping</h2>
            <p className="mb-1">
              <strong>Name:</strong> {shippingAddressDetails.name}
            </p>
            <p className="mb-1">
              <strong>Address:</strong> {shippingAddressDetails.addressLine1}
              {shippingAddressDetails.addressLine2 &&
                `, ${shippingAddressDetails.addressLine2}`}
              , {shippingAddressDetails.city}, {shippingAddressDetails.state}{" "}
              {shippingAddressDetails.postalCode},{" "}
              {shippingAddressDetails.country}
            </p>
            <p>
              <strong>Phone:</strong> {shippingAddressDetails.phone}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <p>
              <strong>Method:</strong> {localStorage.getItem("paymentMethod")}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>

            {items.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center border-b pb-4"
                  >
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={item.product.images[0] || "/placeholder.jpg"}
                        alt={item.product.name}
                        className="h-full w-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x ${item.price.toFixed(2)} = $
                        {(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${totalOrderPrice}</span>
              </div>
            </div>

            <Button
              onClick={placeOrderHandler}
              className="w-full"
              disabled={items.length === 0 || loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaceOrderPage;
