import Image from "next/image";
import Link from "next/link";
import BookmarkButton from "./BookmarkButton";

interface CompanionCardProps {
  id: string;
  name: string;
  color: string;
  topic: string;
  subject: string;
  duration: number;
  bookmarks: string[];
}

const CompanionCard = ({
  id,
  name,
  color,
  topic,
  subject,
  duration,
  bookmarks,
}: CompanionCardProps) => {
  return (
    <article className="companion-card" style={{ backgroundColor: color }}>
      <div className="flex items-center justify-between">
        <div className="subject-badge">{subject}</div>
        <BookmarkButton companionId={id} bookmarks={bookmarks} />
      </div>
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/clock.svg"
            alt="duration"
            width={13.5}
            height={13.5}
          />
          <p>{duration} min</p>
        </div>
      </div>
      <Link href={`/companions/${id}`} className="w-full">
        <button className="w-full btn-primary justify-center">
          Launch Lesson
        </button>
      </Link>
    </article>
  );
};

export default CompanionCard;
