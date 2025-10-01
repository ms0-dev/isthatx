import agent from "@convex-dev/agent/convex.config";
import resend from "@convex-dev/resend/convex.config";
import autumn from "@useautumn/convex/convex.config";
import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config";

const app = defineApp();
app.use(agent);
app.use(betterAuth);
app.use(resend);
app.use(autumn);

export default app;
