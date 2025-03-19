import "vite";

declare module "vite" {
  export interface ServerOptions {
    // Allow allowedHosts to also be of type boolean
    allowedHosts?: true | string[] | boolean;
  }
}
