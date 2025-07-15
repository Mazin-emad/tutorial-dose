import CompanionCard from "@/components/CompanionCard";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { getCompanions } from "@/lib/actions/companions.actions";
import { getSubjectColor } from "@/lib/utils";
import { Companion, SearchParams } from "@/types";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
  let companions: Companion[] = [];
  const filters = await searchParams;
  const topic = Array.isArray(filters.topic)
    ? filters.topic[0]
    : filters.topic || "";
  const subject = Array.isArray(filters.subject)
    ? filters.subject[0]
    : filters.subject || "";

  try {
    companions = await getCompanions({ subject, topic });
  } catch (error) {
    return (
      <div className="flex justify-center text-center text-red-500 items-center min-h-full text-2xl">
        Error loading companions:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <main>
      <section className="flex justify-between items-center max-sm:flex-col gap-4">
        <h1>Companions Library</h1>
        <div className="flex gap-4">
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>
      <section className="companions-grid mb-10">
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>
    </main>
  );
};

export default CompanionsLibrary;
