import CompanionList from "@/components/CompanionList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getUserCompanions,
  getUserSessionHistory,
} from "@/lib/actions/companions.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Profile = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userCompanions = await getUserCompanions(user.id);

  const userSessionHistory = await getUserSessionHistory(user.id);

  return (
    <main className="min-lg:w-3/4">
      <section className="flex max-sm:flex-col justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={user.imageUrl!}
            alt={user.fullName!}
            width={110}
            height={110}
            className="rounded-xl"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{user.fullName!}</h1>
            <p className="text-sm text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col rounded-lg border border-black h-fit p-3 gap-2">
            <div className="flex gap-2 items-center">
              <Image src="/icons/cap.svg" alt="cap" width={22} height={22} />
              <p className="font-bold">{userSessionHistory.length}</p>
            </div>
            <p className="text-sm text-muted-foreground">Sessions Completed</p>
          </div>
          <div className="flex flex-col rounded-lg border border-black h-fit p-3 gap-2">
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/check.svg"
                alt="checkmark"
                width={22}
                height={22}
              />
              <p className="font-bold">{userCompanions.length}</p>
            </div>
            <p className="text-sm text-muted-foreground">Companions Created</p>
          </div>
        </div>
      </section>

      <Accordion type="multiple">
        <AccordionItem value="recent-sessions">
          <AccordionTrigger className="text-xl font-bold">
            Recent Sessions
          </AccordionTrigger>
          <AccordionContent>
            <CompanionList
              companions={userSessionHistory}
              title="Recent Sessions"
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="my-companions">
          <AccordionTrigger className="text-xl font-bold">
            My Companions ({userCompanions.length})
          </AccordionTrigger>
          <AccordionContent>
            <CompanionList companions={userCompanions} title="My Companions" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default Profile;
