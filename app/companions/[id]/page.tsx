import { getCompanionById } from "@/lib/actions/companions.actions";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { getSubjectColor } from "@/lib/utils";
import CompanionComponent from "@/components/CompanionComponent";

interface CompanionSessionProps {
  params: Promise<{ id: string }>;
}

const CompanionSession = async ({ params }: CompanionSessionProps) => {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const companion = await getCompanionById(id);

  if (!companion) {
    redirect("/companions");
  }

  return (
    <main>
      <article className="flex rounded-border p-6 justify-between max-md:flex-col">
        <div className="flex items-center gap-4">
          <div
            className="max-md:hidden flex items-center justify-center p-2 rounded-md"
            style={{ backgroundColor: getSubjectColor(companion.subject) }}
          >
            <Image
              src={`/icons/${companion.subject}.svg`}
              alt={companion.name}
              width={32}
              height={32}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="max-sm:text-xl">{companion.name}</h1>
              <div className="subject-badge max-md:hidden">
                {companion.subject}
              </div>
            </div>
            <p>{companion.topic}</p>
          </div>
        </div>
        <p className="max-md:hidden text-xl text-muted-foreground">
          {companion.duration} minutes
        </p>
      </article>
      <CompanionComponent
        {...companion}
        companionId={companion.id}
        userImage={user.imageUrl!}
        userName={user.fullName!}
      />
    </main>
  );
};

export default CompanionSession;
