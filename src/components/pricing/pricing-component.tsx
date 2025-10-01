"use client";

import { useCustomer } from "autumn-js/react";
import { useRouter } from "next/navigation";
import { PricingCard, PricingTable } from "./pricing-table";

// thanks ai, my pricing table isnt 1 item :)
const products = {
  $schema: "https://www.pricecn.com/schemas/pricing.schema.json",
  products: [
    {
      id: "free",
      name: "Free",
      description: "For casual chatters and hobby conversations.",
      price: { primaryText: "Free", secondaryText: "up to 10 messages/month" },
      buttonText: "Start chatting",
      items: [
        { primaryText: "Send 10 messages per month" },
        { primaryText: "Unlimited reading" },
        { primaryText: "Complimentary typing noises ⌨️🎶" },
        { primaryText: "Lifetime supply of virtual confetti 🎉" },
        { primaryText: "Light/Dark mode (of course)" },
        { primaryText: "Occasional motivational quotes from us ✨" },
      ],
    },
    {
      id: "professional",
      name: "Pro",
      description: "For engaged users and nonstop talkers.",
      recommendedText: "Best Value",
      price: {
        primaryText: "$5",
        secondaryText: "per month",
      },
      priceAnnual: {
        primaryText: "$50",
        secondaryText: "per year",
      },
      buttonText: "Go unlimited",
      everythingFrom: "Free",
      items: [
        { primaryText: "Unlimited messages (chat away!)" },
        { primaryText: "Complimentary imaginary high-five 🙌" },
        { primaryText: "Guaranteed vibes 😎" },
        { primaryText: "Early access to our bad jokes 🤡" },
        { primaryText: "One free pass to blame the Wi-Fi 🔌" },
        { primaryText: "Bragging rights as a Pro user 🏆" },
        { primaryText: "Our eternal gratitude 🙏" },
      ],
    },
  ],
};

export const PricingComponent = () => {
  const router = useRouter();
  const { customer, checkout } = useCustomer();

  return (
    <div className="pt-128 md:pt-0">
      <PricingTable products={products.products} showFeatures={true}>
        <PricingCard
          productId="free"
          onButtonClick={async () => {
            router.push("/login");
          }}
        />
        <PricingCard
          productId="professional"
          onButtonClick={async (event, isAnnual) => {
            if (customer) {
              checkout({ productId: isAnnual ? "professional_annual" : "professional" });
            } else {
              //router.push("/login?plan=" + (isAnnual ? "pro_annual" : "pro"));
              router.push("/login?redirect=" + encodeURIComponent(window.location.href));
            }
          }}
        />
      </PricingTable>
    </div>
  );
};
