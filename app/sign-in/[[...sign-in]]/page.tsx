import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex justify-center items-center h-[calc(100vh-100px)]">
      <SignIn />
    </main>
  );
}
