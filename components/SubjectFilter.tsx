"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjects } from "@/constants";

const SubjectFilter = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentSubject = searchParams.get("subject") || "";

  const handleSubjectChange = (subject: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (subject !== "all") {
        params.set("subject", subject);
      } else {
        params.delete("subject");
      }

      // Preserve topic search if it exists
      const topic = searchParams.get("topic");
      if (topic) {
        params.set("topic", topic);
      }

      replace(`/companions?${params.toString()}`);
    });
  };

  return (
    <Select
      value={currentSubject}
      onValueChange={handleSubjectChange}
      disabled={isPending}
    >
      <SelectTrigger className="border-black w-48 max-sm:w-full">
        <SelectValue placeholder="Filter by subject" />
      </SelectTrigger>
      <SelectContent>
        {[null, ...subjects].map((subject: string | null) => (
          <SelectItem key={subject} value={subject || "all"}>
            {subject
              ? subject.charAt(0).toUpperCase() + subject.slice(1)
              : "All Subjects"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;
