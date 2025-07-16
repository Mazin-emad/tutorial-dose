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
import { Companion } from "@/types";
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
    <main className="max-lg:w3/4">
      <section className="flex max-sm:flex-col justify-between items-center gap-4">
        <Image
          src={user.imageUrl!}
          alt={user.fullName!}
          width={100}
          height={100}
        />
        <h1>{user.fullName!}</h1>
      </section>
      <section>
        <h2>My Companions</h2>
        <div>
          {userCompanions.map((companion) => (
            <div key={companion.id}>
              <h3>{companion.name}</h3>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>My Session History</h2>
        <div>
          {userSessionHistory.map((session: Companion) => (
            <div key={session.id}>
              <h3>{session.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Profile;
{
  /* <Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion> */
}
