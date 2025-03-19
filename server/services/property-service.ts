import { type Property, type InsertProperty } from "@shared/schema";
import { storage } from "../storage";

interface DaftProperty {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  propertyType: string;
  daftUrl: string;
  images: string[];
  // Add more fields as needed
}

export class PropertyService {
  private baseUrl = "https://api.daft.ie/v3";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.DAFT_API_KEY || "";
  }

  async fetchProperties(): Promise<Property[]> {
    try {
      // Note: This is a placeholder as Daft.ie requires partnership/authentication
      const response = await fetch(`${this.baseUrl}/properties`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.statusText}`);
      }

      const data = await response.json();
      const properties = this.transformProperties(data);
      
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

  private transformProperties(daftProperties: DaftProperty[]): InsertProperty[] {
    return daftProperties.map(prop => ({
      title: prop.title,
      description: `${prop.propertyType} property on ${prop.address}. View more details on Daft.ie: ${prop.daftUrl}`,
      price: prop.price,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      address: prop.address,
      location: { lat: 0, lng: 0 }, // Would need to geocode the address
      images: prop.images,
      userId: 1 // Default system user
    }));
  }
}
