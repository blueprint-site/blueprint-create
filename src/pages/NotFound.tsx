import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-minecraft">Page Not Found</h2>
        <div className="text-foreground-muted max-w-lg">
          <p>
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p>
            If you believe this is a bug email us at{" "}
            <a href="mailto:blueprint-site@proton.me">
              blueprint-site@proton.me
            </a>
          </p>
        </div>
        <Link to="/">
          <Button className="mt-4">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
