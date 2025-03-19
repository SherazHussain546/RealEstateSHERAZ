import { type Property, type InsertProperty, type Viewing, type InsertViewing } from "@shared/schema";

export interface IStorage {
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  createViewing(viewing: InsertViewing): Promise<Viewing>;
}

export class MemStorage implements IStorage {
  private properties: Map<number, Property>;
  private viewings: Map<number, Viewing>;
  private propertyId: number;
  private viewingId: number;

  constructor() {
    this.properties = new Map();
    this.viewings = new Map();
    this.propertyId = 1;
    this.viewingId = 1;
  }

  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.propertyId++;
    const newProperty: Property = {
      ...property,
      id,
      createdAt: new Date()
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async createViewing(viewing: InsertViewing): Promise<Viewing> {
    const id = this.viewingId++;
    const newViewing: Viewing = {
      ...viewing,
      id,
      createdAt: new Date()
    };
    this.viewings.set(id, newViewing);
    return newViewing;
  }
}

export const storage = new MemStorage();
