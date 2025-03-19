import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type Property } from "@shared/schema";
import { PropertyCard } from "@/components/property-card";
import { PropertySearch } from "@/components/property-search";

export default function Home() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"]
  });

  const [filteredProperties, setFilteredProperties] = useState<Property[]>();

  const handleSearch = (filters: {
    priceRange: [number, number];
    bedrooms: number;
    bathrooms: number;
    searchTerm: string;
  }) => {
    if (!properties) return;

    const filtered = properties.filter(property => {
      const matchesPrice = property.price >= filters.priceRange[0] && 
                         property.price <= filters.priceRange[1];
      const matchesBedrooms = property.bedrooms >= filters.bedrooms;
      const matchesBathrooms = property.bathrooms >= filters.bathrooms;
      const matchesSearch = filters.searchTerm === "" || 
                          property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          property.address.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return matchesPrice && matchesBedrooms && matchesBathrooms && matchesSearch;
    });

    setFilteredProperties(filtered);
  };

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

  const displayProperties = filteredProperties || properties || [];
  const maxPrice = Math.max(...(properties?.map(p => p.price) || [1000000]));

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-4xl font-bold mb-8">Find Your Perfect Home</h1>

      <PropertySearch 
        onSearch={handleSearch}
        maxPrice={maxPrice}
      />

      {displayProperties.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-600">No properties found</h2>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}