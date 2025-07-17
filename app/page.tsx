import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import Cta from "@/components/Cta";

import {
  getCompanions,
  getSessionHistory,
} from "@/lib/actions/companions.actions";
import { getSubjectColor } from "@/lib/utils";

const Home = async () => {
  const companionsResponse = await getCompanions({ limit: 3 });
  const recentSessionsDataResponse = await getSessionHistory();

  const companions = companionsResponse?.data;
  const recentSessionsData = recentSessionsDataResponse?.data;

  return (
    <main className="pb-8">
      <h1 className="text-2xl">Popular Companions</h1>

      <section className="home-section">
        {companionsResponse.success ? (
          companions?.map((companion) => (
            <CompanionCard
              key={companion.id}
              {...companion}
              color={getSubjectColor(companion.subject)}
            />
          ))
        ) : (
          <p className="font-bold text-red-500">{companionsResponse.message}</p>
        )}
      </section>

      <section className="home-section">
        {recentSessionsDataResponse.success ? (
          <CompanionList
            title="recent sessions"
            classNames="w-2/3 max-lg:w-full"
            companions={recentSessionsData}
          />
        ) : (
          <p className="font-bold text-red-500">
            {recentSessionsDataResponse.message}
          </p>
        )}
        <Cta />
      </section>
    </main>
  );
};

export default Home;
