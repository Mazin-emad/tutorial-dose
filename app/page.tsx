import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import Cta from "@/components/Cta";
import { recentSessions } from "@/constants";
import React from "react";

const Page = () => {
  return (
    <main>
      <h1 className="text-2xl">Popular Companions</h1>

      <section className="home-section">
        <CompanionCard
          id="123"
          name="Neura the Brainy Explorer"
          color="#BDE7FF"
          topic="Neural Networks"
          subject="Science"
          duration={40}
        />
        <CompanionCard
          id="aawa"
          name="Neura the Brainy Explorer"
          color="#E5D0FF"
          topic="Neural Networks"
          subject="Science"
          duration={40}
        />
        <CompanionCard
          id="aaa"
          name="Neura the Brainy Explorer"
          color="#FFDA6A"
          topic="Neural Networks"
          subject="Science"
          duration={40}
        />
      </section>

      <section className="home-section">
        <CompanionList
          title="recent sessions"
          classNames="w-2/3 max-lg:w-full"
          companions={recentSessions}
        />
        <Cta />
      </section>
    </main>
  );
};

export default Page;
