import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { CreditCard, Landmark, Banknote } from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const shippingAddress = localStorage.getItem("shippingAddress");

    if (!isAuthenticated) {
      navigate("/login?redirect=payment");
    } else if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save payment method to localStorage
    localStorage.setItem("paymentMethod", paymentMethod);

    // Navigate to place order page
    navigate("/placeorder");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment Method</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="space-y-4"
          >
            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-start">
                <RadioGroupItem
                  value="Credit Card"
                  id="credit-card"
                  className="mt-1"
                />
                <Label htmlFor="credit-card" className="ml-2 flex-1">
                  <div className="flex items-center">
                    <CreditCard size={20} className="mr-2" />
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Pay securely with your credit card
                  </div>
                </Label>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-start">
                <RadioGroupItem
                  value="Bank Transfer"
                  id="bank-transfer"
                  className="mt-1"
                />
                <Label htmlFor="bank-transfer" className="ml-2 flex-1">
                  <div className="flex items-center">
                    <Landmark size={20} className="mr-2" />
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Pay directly from your bank account
                  </div>
                </Label>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-start">
                <RadioGroupItem
                  value="Cash on Delivery"
                  id="cash-on-delivery"
                  className="mt-1"
                />
                <Label htmlFor="cash-on-delivery" className="ml-2 flex-1">
                  <div className="flex items-center">
                    <Banknote size={20} className="mr-2" />
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Pay when you receive your order
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/shipping")}
          >
            Back
          </Button>

          <Button type="submit">Continue</Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
