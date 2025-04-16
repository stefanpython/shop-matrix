import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  // @ts-expect-error - TODO: Fix this type issue later
  const { totalItems } = useAppSelector((state) => state.cart);

  //   const handleSearch  => state.auth);
  //   const { totalItems } = useAppSelector((state) => state.cart);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?keyword=${searchTerm}`);
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          ShopApp
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-4"
        >
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="flex items-center">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="ml-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative group">
              <Button variant="ghost" className="flex items-center">
                <User size={20} className="mr-2" />
                {user?.name}
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  {user?.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-inner">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          <nav className="flex flex-col space-y-2">
            <Link to="/" className="py-2" onClick={toggleMenu}>
              Home
            </Link>
            <Link
              to="/cart"
              className="py-2 flex items-center"
              onClick={toggleMenu}
            >
              <ShoppingCart size={20} className="mr-2" />
              Cart
              {totalItems > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="py-2" onClick={toggleMenu}>
                  Profile
                </Link>
                <Link to="/orders" className="py-2" onClick={toggleMenu}>
                  My Orders
                </Link>
                {user?.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="py-2"
                    onClick={toggleMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="py-2 text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="py-2" onClick={toggleMenu}>
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
