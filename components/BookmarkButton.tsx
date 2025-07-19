"use client";
import { addBookmark, removeBookmark } from "@/lib/actions/companions.actions";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BookmarkButton = ({
  companionId,
  bookmarks,
}: {
  companionId: string;
  bookmarks: string[];
}) => {
  const path = usePathname();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(
    bookmarks?.includes(userId!)
  );

  useEffect(() => {
    setIsBookmarked(bookmarks?.includes(userId!));
  }, [bookmarks, userId]);

  const handleBookmark = async () => {
    setLoading(true);
    if (isBookmarked) {
      const removeRes = await removeBookmark(companionId, path);
      if (removeRes.success) {
        setIsBookmarked(false);
        setLoading(false);
        toast.success("Bookmark removed");
      } else {
        toast.error(removeRes.error);
        setLoading(false);
      }
    } else {
      const addRes = await addBookmark(companionId, path);
      if (addRes.success) {
        setIsBookmarked(true);
        setLoading(false);
        toast.success("Bookmark added");
      } else {
        toast.error(addRes.error);
        setLoading(false);
      }
    }
  };

  return (
    <button
      disabled={!userId || loading}
      className={cn(
        "p-1.5 rounded-md bg-primary cursor-pointer",
        !userId ? "cursor-not-allowed" : "",
        loading ? "opacity-50 cursor-progress" : ""
      )}
      onClick={handleBookmark}
    >
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
