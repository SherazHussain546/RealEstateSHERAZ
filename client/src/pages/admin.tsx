import { PropertyForm } from "@/components/property-form";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/firebase";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
        <PropertyForm />
      </Card>
    </div>
  );
}