import "server-only";
import { Polar } from "@polar-sh/sdk";

// Which Polar environment to talk to. Defaults to sandbox so we never hit
// production by accident in development.
export const POLAR_SERVER: "sandbox" | "production" =
  process.env.POLAR_SERVER === "production" ? "production" : "sandbox";

// Server-side Polar client. Never import this from a Client Component —
// it carries the organization access token.
export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
  server: POLAR_SERVER,
});
