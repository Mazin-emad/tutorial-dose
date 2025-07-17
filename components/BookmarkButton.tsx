"use client";
import { addBookmark, removeBookmark } from "@/lib/actions/companions.actions";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const BookmarkButton = ({
  companionId,
  bookmarks,
}: {
  companionId: string;
  bookmarks: string[];
}) => {
  const path = usePathname();
  const { userId } = useAuth();
  console.log(userId, bookmarks);
  const [isBookmarked, setIsBookmarked] = useState(
    bookmarks?.includes(userId!)
  );

  useEffect(() => {
    setIsBookmarked(bookmarks?.includes(userId!));
  }, [bookmarks, userId]);

  const handleBookmark = () => {
    if (isBookmarked) {
      const {} = removeBookmark(companionId, path);
      setIsBookmarked(false);
    } else {
      addBookmark(companionId, path);
      setIsBookmarked(true);
    }
  };

  return (
    <button className="p-1.5 rounded-md bg-primary" onClick={handleBookmark}>
      <Image
        src={
          isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"
        }
        alt="bookmark"
        width={12.5}
        height={15}
      />
    </button>
  );
};

export default BookmarkButton;
