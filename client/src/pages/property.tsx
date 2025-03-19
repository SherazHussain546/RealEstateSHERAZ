import { useQuery } from "@tanstack/react-query";
import { type Property } from "@shared/schema";
import { BookingForm } from "@/components/booking-form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bed, Bath, Home, MapPin } from "lucide-react";
import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface PropertyPageProps {
  params: {
    id: string;
  }
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { data: property, isLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${params.id}`]
  });

  useEffect(() => {
    if (property && window.google) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: property.location,
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: property.location,
        map,
      });
    }
  }, [property]);

  if (isLoading || !property) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="animate-pulse space-y-4">
          <div className="h-[400px] bg-muted rounded-lg" />
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
            <img 
              src={property.images[0]}
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
          <p className="text-3xl font-bold text-primary mb-6">
            ${property.price.toLocaleString()}
          </p>

          <div className="flex gap-6 text-muted-foreground mb-8">
            <span className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              {property.bedrooms} bedrooms
            </span>
            <span className="flex items-center gap-2">
              <Bath className="h-5 w-5" />
              {property.bathrooms} bathrooms
            </span>
            <span className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              {property.address}
            </span>
          </div>

          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <Card className="p-6">
                <p className="whitespace-pre-wrap">{property.description}</p>
              </Card>
            </TabsContent>
            <TabsContent value="location">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  {property.address}
                </div>
                <div id="map" className="h-[400px] rounded-lg" />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Book a Viewing</h2>
            <BookingForm propertyId={property.id} />
          </Card>
        </div>
      </div>
    </div>
  );
}
