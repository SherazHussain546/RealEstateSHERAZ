import { type InsertProperty } from "@shared/schema";
import { storage } from "../storage";

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  photos?: Array<{
    photo_reference: string;
  }>;
}

export class GooglePlacesService {
  private apiKey: string;
  private baseUrl = "https://maps.googleapis.com/maps/api/place";

  constructor() {
    this.apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY || "";
  }

  async searchProperties(query: string = "real estate agency", location: { lat: number; lng: number }): Promise<InsertProperty[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(query)}&location=${location.lat},${location.lng}&radius=50000&type=real_estate_agency&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.statusText}`);
      }

      const data = await response.json();
      const properties = await this.transformProperties(data.results);

      // Store properties in local database
      for (const property of properties) {
        await storage.createProperty(property);
      }

      return properties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  }

  private async getPlaceDetails(placeId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,photos,website,price_level,rating,reviews&key=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch place details: ${response.statusText}`);
    }

    return response.json();
  }

  private async getPlacePhoto(photoReference: string): Promise<string> {
    return `${this.baseUrl}/photo?maxwidth=800&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  private async transformProperties(places: PlaceResult[]): Promise<InsertProperty[]> {
    const properties: InsertProperty[] = [];

    for (const place of places) {
      const details = await this.getPlaceDetails(place.place_id);
      const photos = place.photos 
        ? await Promise.all(place.photos.slice(0, 5).map(photo => this.getPlacePhoto(photo.photo_reference)))
        : [];

      // Generate random property details since Places API doesn't provide these
      const price = Math.floor(Math.random() * (1000000 - 200000) + 200000);
      const bedrooms = Math.floor(Math.random() * 5) + 1;
      const bathrooms = Math.floor(Math.random() * 3) + 1;

      properties.push({
        title: place.name,
        description: `Beautiful property located at ${place.formatted_address}. Contact us for more details.`,
        price,
        bedrooms,
        bathrooms,
        address: place.formatted_address,
        location: place.geometry.location,
        images: photos,
        userId: 1 // Default system user
      });
    }

    return properties;
  }
}
