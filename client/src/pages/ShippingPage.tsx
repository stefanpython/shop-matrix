import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAddresses, createAddress } from "../redux/slices/addressSlice";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { RootState } from "@/redux/store";

const ShippingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New address form state
  const [name, setName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const { addresses, loading, error, success } = useAppSelector(
    (state: RootState) => state.addresses
  ) as {
    addresses: {
      _id: string;
      name: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone: string;
      isDefault?: boolean;
    }[];
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.auth
  ) as {
    isAuthenticated: boolean;
    user: { token: string } | null;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=shipping");
    } else if (user?.token) {
      dispatch(fetchAddresses(user.token));
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      // Select default address if available, otherwise select the first address
      const defaultAddress = addresses.find((address) => address.isDefault);
      setSelectedAddressId(
        defaultAddress ? defaultAddress._id : addresses[0]._id
      );
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (success) {
      setShowNewAddressForm(false);
      // Reset form
      setName("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
      setPhone("");
    }
  }, [success]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAddressId) {
      // Save the selected address to localStorage for the next step
      localStorage.setItem("shippingAddress", selectedAddressId);
      navigate("/payment");
    }
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (user?.token) {
      dispatch(
        createAddress({
          addressData: {
            name,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            phone,
            isDefault: addresses.length === 0, // Make it default if it's the first address
          },
          token: user.token,
        })
      );
    }
  };

  if (loading && addresses.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shipping Address</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {addresses.length > 0 ? (
          <div className="mb-6">
            <RadioGroup
              value={selectedAddressId}
              onValueChange={setSelectedAddressId}
              className="space-y-4"
            >
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`border rounded-lg p-4 ${
                    selectedAddressId === address._id
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <RadioGroupItem
                      value={address._id}
                      id={address._id}
                      className="mt-1"
                    />
                    <Label htmlFor={address._id} className="ml-2 flex-1">
                      <div className="font-medium">{address.name}</div>
                      <div className="text-sm text-gray-600">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.postalCode}
                      </div>
                      <div className="text-sm text-gray-600">
                        {address.country}
                      </div>
                      <div className="text-sm text-gray-600">
                        {address.phone}
                      </div>
                      {address.isDefault && (
                        <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <div className="text-center py-4 mb-6 bg-gray-50 rounded-lg">
            <p>You don't have any saved addresses. Please add a new address.</p>
          </div>
        )}

        <Dialog open={showNewAddressForm} onOpenChange={setShowNewAddressForm}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="mb-6">
              <Plus size={16} className="mr-2" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAddress} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Address"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Button
          type="submit"
          className="w-full"
          disabled={!selectedAddressId && addresses.length > 0}
        >
          Continue to Payment
        </Button>
      </form>
    </div>
  );
};
export default ShippingPage;
