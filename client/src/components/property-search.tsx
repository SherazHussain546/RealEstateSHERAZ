import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PropertyFilters {
  priceRange: [number, number];
  bedrooms: number;
  bathrooms: number;
  searchTerm: string;
}

interface PropertySearchProps {
  onSearch: (filters: PropertyFilters) => void;
  maxPrice?: number;
}

export function PropertySearch({ onSearch, maxPrice = 1000000 }: PropertySearchProps) {
  const [filters, setFilters] = useState<PropertyFilters>({
    priceRange: [0, maxPrice],
    bedrooms: 0,
    bathrooms: 0,
    searchTerm: "",
  });

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              placeholder="Search by location or title..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Price Range: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}</Label>
            <Slider
              min={0}
              max={maxPrice}
              step={10000}
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={handlePriceChange}
              className="pt-4"
            />
          </div>

          <div className="space-y-2">
            <Label>Minimum Bedrooms</Label>
            <Input
              type="number"
              min={0}
              value={filters.bedrooms}
              onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Minimum Bathrooms</Label>
            <Input
              type="number"
              min={0}
              value={filters.bathrooms}
              onChange={(e) => setFilters(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <Button 
          onClick={handleSearch} 
          className="w-full mt-6"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Properties
        </Button>
      </CardContent>
    </Card>
  );
}
