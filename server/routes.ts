import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertViewingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all properties
  app.get("/api/properties", async (_req, res) => {
    const properties = await storage.getProperties();
    res.json(properties);
  });

  // Get single property
  app.get("/api/properties/:id", async (req, res) => {
    const property = await storage.getProperty(Number(req.params.id));
    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }
    res.json(property);
  });

  // Create property
  app.post("/api/properties", async (req, res) => {
    const result = insertPropertySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid property data" });
      return;
    }
    const property = await storage.createProperty(result.data);
    res.status(201).json(property);
  });

  // Create viewing
  app.post("/api/viewings", async (req, res) => {
    const result = insertViewingSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid viewing data" });
      return;
    }
    const viewing = await storage.createViewing(result.data);
    res.status(201).json(viewing);
  });

  const httpServer = createServer(app);
  return httpServer;
}
