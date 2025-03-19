import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Property } from "@shared/schema";
import { Link } from "wouter";
import { Bed, Bath, Home } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <p className="text-2xl font-bold text-primary mb-4">
          ${property.price.toLocaleString()}
        </p>
        
        <div className="flex gap-4 text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.bedrooms} beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathrooms} baths  
          </span>
          <span className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            {property.address}
          </span>
        </div>
        
        <p className="text-muted-foreground line-clamp-2">
          {property.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Link href={`/property/${property.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
