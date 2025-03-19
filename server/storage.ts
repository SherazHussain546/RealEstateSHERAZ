import { type Property, type InsertProperty, type Viewing, type InsertViewing, type User, type InsertUser } from "@shared/schema";

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