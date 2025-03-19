import { type Property, type InsertProperty, type Viewing, type InsertViewing, type User, type InsertUser } from "@shared/schema";

// Sample properties data
const sampleProperties: InsertProperty[] = [
  {
    title: "Luxury Penthouse with Sea View",
    description: "Stunning penthouse apartment with panoramic sea views, featuring high-end finishes throughout. Private roof terrace and floor-to-ceiling windows.",
    price: 750000,
    bedrooms: 3,
    bathrooms: 2,
    address: "15 Strand Road, Sandymount, Dublin 4",
    location: { lat: 53.3293, lng: -6.2237 },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      "https://images.unsplash.com/photo-1600607687644-aac76f0862df"
    ],
    userId: 1
  },
  {
    title: "Charming Victorian Family Home",
    description: "Beautiful Victorian residence with period features, modern kitchen, and landscaped garden. Close to schools and transport.",
    price: 895000,
    bedrooms: 4,
    bathrooms: 3,
    address: "42 Temple Road, Blackrock, Co. Dublin",
    location: { lat: 53.3027, lng: -6.1784 },
    images: [
      "https://images.unsplash.com/photo-1600566753851-f0dccb6d2d23",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea"
    ],
    userId: 1
  },
  {
    title: "Modern City Centre Apartment",
    description: "Contemporary 2-bed apartment in the heart of Dublin. High-spec finish, secure parking, and 24-hour concierge.",
    price: 450000,
    bedrooms: 2,
    bathrooms: 2,
    address: "25 Hanover Quay, Grand Canal Dock, Dublin 2",
    location: { lat: 53.3439, lng: -6.2392 },
    images: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
      "https://images.unsplash.com/photo-1600573472357-26b9d17f0425",
      "https://images.unsplash.com/photo-1600573472437-1f9b1f0e7a5a"
    ],
    userId: 1
  },
  {
    title: "Spacious Suburban Semi-Detached",
    description: "Well-maintained 4-bed semi-detached house with large garden. Recently renovated kitchen and bathrooms.",
    price: 525000,
    bedrooms: 4,
    bathrooms: 3,
    address: "123 Whitehall Road, Terenure, Dublin 6W",
    location: { lat: 53.3096, lng: -6.2897 },
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600585154268-0e8b64c8c9f4"
    ],
    userId: 1
  }
];

export interface IStorage {
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  createViewing(viewing: InsertViewing): Promise<Viewing>;
  createUser(user: Omit<InsertUser, "confirmPassword">): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private properties: Map<number, Property>;
  private viewings: Map<number, Viewing>;
  private users: Map<number, User>;
  private propertyId: number;
  private viewingId: number;
  private userId: number;

  constructor() {
    this.properties = new Map();
    this.viewings = new Map();
    this.users = new Map();
    this.propertyId = 1;
    this.viewingId = 1;
    this.userId = 1;

    // Initialize with sample properties
    sampleProperties.forEach(property => {
      const id = this.propertyId++;
      const newProperty: Property = {
        ...property,
        id,
        createdAt: new Date()
      };
      this.properties.set(id, newProperty);
    });
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

  async createUser(user: Omit<InsertUser, "confirmPassword">): Promise<User> {
    const id = this.userId++;
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
}

export const storage = new MemStorage();