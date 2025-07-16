import { PricingTable } from "@clerk/nextjs";

const Subscription = () => {
  return (
    <main className="flex justify-center items-center h-[calc(100vh-100px)]">
      <PricingTable />
    </main>
  );
};

export default Subscription;
