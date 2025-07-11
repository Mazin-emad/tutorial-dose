import CompanionForm from "@/components/CompanionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const NewCompanion = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <article className="w-full max-w-lg flex flex-col gap-4 bg-white rounded-lg shadow-md p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Companion builder
        </h1>
        <CompanionForm />
      </article>
    </main>
  );
};

export default NewCompanion;
