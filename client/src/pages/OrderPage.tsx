/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getOrderDetails, payOrder } from "../redux/slices/orderSlice";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { order, loading, error } = useAppSelector(
    (state: any) => state.orders
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id && user?.token) {
      dispatch(getOrderDetails({ id, token: user.token }));
    }
  }, [dispatch, id, user]);

  const handlePayment = () => {
    // In a real application, you would integrate with a payment gateway here
    // For this example, we'll simulate a successful payment
    if (id && user?.token) {
      const paymentResult = {
        id: "PAYMENT_" + Date.now(),
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        payer: { email_address: user.email },
      };

      dispatch(payOrder({ id, paymentResult, token: user.token }));
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

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Order {order._id}</h1>
      <p className="text-gray-600 mb-6">
        Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping</h2>
            <p className="mb-1">
              <strong>Name:</strong> {order.shippingAddress.name}
            </p>
            <p className="mb-1">
              <strong>Address:</strong> {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 &&
                `, ${order.shippingAddress.addressLine2}`}
              , {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
            <p className="mb-1">
              <strong>Phone:</strong> {order.shippingAddress.phone}
            </p>

            {order.isDelivered ? (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Delivered on{" "}
                  {new Date(order.deliveredAt).toLocaleDateString()}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-600">
                  Not Delivered
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Payment</h2>
            <p className="mb-1">
              <strong>Method:</strong> {order.paymentMethod}
            </p>

            {order.isPaid ? (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-600">
                  Not Paid
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>

            <div className="space-y-4">
              {order.orderItems.map(
                (item: {
                  _id: string;
                  image: string;
                  name: string;
                  product: string;
                  quantity: number;
                  price: number;
                }) => (
                  <div
                    key={item._id}
                    className="flex items-center border-b pb-4"
                  >
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="h-full w-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <Link
                        to={`/product/${item.product}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x ${item.price.toFixed(2)} = $
                        {(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>
                  ${order.totalPrice - order.taxPrice - order.shippingPrice}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {!order.isPaid && (
              <Button onClick={handlePayment} className="w-full mb-4">
                Pay Now
              </Button>
            )}

            <div className="mt-4">
              <h3 className="font-medium mb-2">Order Status</h3>
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-center font-medium">{order.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderPage;
