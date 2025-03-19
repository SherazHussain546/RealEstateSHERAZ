import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertViewingSchema, insertUserSchema, loginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production" }
    })
  );

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    const result = insertUserSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid user data" });
      return;
    }

    try {
      const { email, password, name } = result.data;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ email, password: hashedPassword, name });
      res.status(201).json({ message: "User created successfully" });
    } catch (error: any) {
      if (error.code === "23505") { // PostgreSQL unique violation
        res.status(400).json({ message: "Email already exists" });
      } else {
        res.status(500).json({ message: "Error creating user" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid login data" });
      return;
    }

    try {
      const { email, password } = result.data;
      const user = await storage.getUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Store user in session
      req.session.user = {
        id: user.id,
        email: user.email,
        name: user.name
      };
      res.json({ message: "Logged in successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Error logging out" });
        return;
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Existing routes
  app.get("/api/properties", async (_req, res) => {
    const properties = await storage.getProperties();
    res.json(properties);
  });

  app.get("/api/properties/:id", async (req, res) => {
    const property = await storage.getProperty(Number(req.params.id));
    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }
    res.json(property);
  });

  app.post("/api/properties", async (req, res) => {
    const result = insertPropertySchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid property data" });
      return;
    }
    const property = await storage.createProperty(result.data);
    res.status(201).json(property);
  });

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