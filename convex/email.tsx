import { Resend, vOnEmailEventArgs } from "@convex-dev/resend";
import { render } from "@react-email/render";
import { components, internal } from "./_generated/api";
import { ActionCtx, internalMutation } from "./_generated/server";
import MagicLinkEmail from "./emails/magicLink";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
  onEmailEvent: internal.email.handleEmailEvent,
});

export const sendMagicLink = async (ctx: ActionCtx, { to, url }: { to: string; url: string }) => {
  await resend.sendEmail(ctx, {
    from: "isthatx <isthatx@resend.dev>",
    to,
    subject: "Sign in to your account",
    html: await render(<MagicLinkEmail url={url} />),
  });
};

export const handleEmailEvent = internalMutation({
  args: vOnEmailEventArgs,
  handler: async (ctx, args) => {
    // Handle however you want
    // args provides { id: EmailId; event: EmailEvent; }
    // see /example/example.ts
    console.log("Got called back!", args.id, args.event);
    return null;
  },
});
