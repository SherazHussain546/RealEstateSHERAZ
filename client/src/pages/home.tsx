import { useQuery } from "@tanstack/react-query";
import { type Property } from "@shared/schema";
import { PropertyCard } from "@/components/property-card";

export default function Home() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"]
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted aspect-video rounded-lg mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-4xl font-bold mb-8">Featured Properties</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
