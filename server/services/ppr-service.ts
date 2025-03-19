import { type Property, type InsertProperty } from "@shared/schema";
import { storage } from "../storage";

interface PPRProperty {
  date_of_sale: string;
  address: string;
  county: string;
  price: string;
  not_full_market_price: string;
  vat_exclusive: string;
  property_description: string;
}

export class PPRService {
  private baseUrl = "https://api.propertypriceregister.ie/v1";
  
  async fetchProperties(): Promise<Property[]> {
    try {
      // Note: This is a placeholder as PPR data might need to be downloaded
      // Consider using their CSV data dumps instead of API
      const response = await fetch(`${this.baseUrl}/properties`);

      if (!response.ok) {
        throw new Error(`Failed to fetch PPR data: ${response.statusText}`);
      }

      const data: PPRProperty[] = await response.json();
      const properties = this.transformProperties(data);
      
      // Store properties in local database
      for (const property of properties) {
        await storage.createProperty(property);
      }

      return properties;
    } catch (error) {
      console.error("Error fetching PPR data:", error);
      throw error;
    }
  }

  private transformProperties(pprProperties: PPRProperty[]): InsertProperty[] {
    return pprProperties.map(prop => ({
      title: `Property in ${prop.county}`,
      description: `${prop.property_description} - Sold on ${prop.date_of_sale}`,
      price: parseInt(prop.price.replace(/[^0-9]/g, "")),
      bedrooms: 0, // PPR doesn't provide this info
      bathrooms: 0, // PPR doesn't provide this info
      address: prop.address,
      location: { lat: 0, lng: 0 }, // Would need to geocode the address
      images: [], // PPR doesn't provide images
      userId: 1 // Default system user
    }));
  }
}
