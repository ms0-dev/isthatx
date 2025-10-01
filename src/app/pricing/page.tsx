import { PricingComponent } from "@/components/pricing/pricing-component";

export default function PricingPage() {
  return (
    <div className="h-screen flex justify-center items-center w-screen">
      <div className="w-full flex flex-col items-center justify-between">
        <PricingComponent />
      </div>
    </div>
  );
}
