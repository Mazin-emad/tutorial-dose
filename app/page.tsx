import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import Cta from "@/components/Cta";

import {
  getCompanions,
  getSessionHistory,
} from "@/lib/actions/companions.actions";
import { getSubjectColor } from "@/lib/utils";
import { toast } from "sonner";

const Home = async () => {
  let companions;
  let recentSessionsData;
  try {
    companions = await getCompanions({ limit: 3 });
    recentSessionsData = await getSessionHistory();
  } catch (error) {
    toast.error("error: " + error);
  }

  return (
    <main className="pb-8">
      <h1 className="text-2xl">Popular Companions</h1>

      <section className="home-section">
        {companions?.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>

      <section className="home-section">
        <CompanionList
          title="recent sessions"
          classNames="w-2/3 max-lg:w-full"
          companions={recentSessionsData?.map((session) => session.companions)}
        />
        <Cta />
      </section>
    </main>
  );
};

export default Home;
