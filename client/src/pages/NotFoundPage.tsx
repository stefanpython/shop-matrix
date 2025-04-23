import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <AlertTriangle size={64} className="text-yellow-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button size="lg">Return to Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
