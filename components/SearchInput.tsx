"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

const SearchInput = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "";

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("topic", value.trim());
    } else {
      params.delete("topic");
    }

    // Preserve subject filter if it exists
    const subject = searchParams.get("subject");
    if (subject) {
      params.set("subject", subject);
    }

    replace(`/companions?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={16}
          height={16}
          className="opacity-50"
        />
      </div>
      <Input
        type="text"
        placeholder="Search companions..."
        defaultValue={topic}
        onChange={(e) => handleSearch(e.target.value)}
        className="input pl-10 pr-4 w-64 max-sm:w-full"
      />
    </div>
  );
};

export default SearchInput;
