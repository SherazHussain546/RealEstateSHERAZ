import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, LogIn, UserPlus, Plus } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold text-primary">RealEstate</a>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant={location === "/" ? "default" : "ghost"}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>

          <Link href="/login">
            <Button variant={location === "/login" ? "default" : "ghost"}>
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>

          <Link href="/signup">
            <Button variant={location === "/signup" ? "default" : "ghost"}>
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}