import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Layout components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import ProductListPage from "./pages/ProductListPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin pages
import AdminDashboardPage from "./pages/admin/DashboardPage";
import AdminProductListPage from "./pages/admin/ProductListPage";
import AdminProductEditPage from "./pages/admin/ProductEditPage";
import AdminOrderListPage from "./pages/admin/OrderListPage";
import AdminUserListPage from "./pages/admin/UserListPage";
import AdminCategoryListPage from "./pages/admin/CategoryListPage";

// Protected route component
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <ShippingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placeorder"
                element={
                  <ProtectedRoute>
                    <PlaceOrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/productlist"
                element={
                  <AdminRoute>
                    <AdminProductListPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/product/:id/edit"
                element={
                  <AdminRoute>
                    <AdminProductEditPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orderlist"
                element={
                  <AdminRoute>
                    <AdminOrderListPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/userlist"
                element={
                  <AdminRoute>
                    <AdminUserListPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categorylist"
                element={
                  <AdminRoute>
                    <AdminCategoryListPage />
                  </AdminRoute>
                }
              />

              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
