import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ShopApp</h3>
            <p className="text-gray-300">
              Your one-stop shop for all your shopping needs. Quality products
              at affordable prices.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p>123 Shop Street</p>
              <p>Shopping District, SP 12345</p>
              <p>Email: info@shopapp.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-300">
          <p>&copy; {currentYear} ShopApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
