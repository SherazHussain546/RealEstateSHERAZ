import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/firebase";
import { Home, LogIn, LogOut, Plus } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  const { user, signIn, signOut } = useAuth();

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
          
          {user ? (
            <>
              <Link href="/admin">
                <Button variant={location === "/admin" ? "default" : "ghost"}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn()}>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
