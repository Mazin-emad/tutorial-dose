import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Companion } from "@/types";
import { cn, getSubjectColor } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface CompanionListProps {
  title: string;
  companions?: Companion[];
  classNames?: string;
}

const CompanionList = ({
  title,
  companions,
  classNames,
}: CompanionListProps) => {
  return (
    <article className={cn("companion-list", classNames)}>
      <h2 className="text-3xl font-bold">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/3 text-lg">Lessons</TableHead>
            <TableHead className="text-lg">Subject</TableHead>
            <TableHead className="text-lg text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companions?.map(({ id, name, subject, duration, topic }) => (
            <TableRow key={id}>
              <TableCell>
                <Link href={`/companions/${id}`}>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
                      style={{
                        backgroundColor: getSubjectColor(subject),
                      }}
                    >
                      <Image
                        src={`/icons/${subject?.toLowerCase()}.svg`}
                        alt={subject}
                        width={35}
                        height={36}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-2xl font-bold">{name}</p>
                      <p className="text-lg">{topic}</p>
                    </div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <div
                  className="subject-badge w-fit max-md:hidden"
                  style={{ backgroundColor: getSubjectColor(subject) }}
                >
                  {subject}
                </div>
                <div
                  className="flex items-center justify-center rounded-lg p-2 w-fit md:hidden"
                  style={{ backgroundColor: getSubjectColor(subject) }}
                >
                  <Image
                    src={`/icons/${subject?.toLowerCase()}.svg`}
                    alt={subject}
                    width={18}
                    height={18}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="w-full flex gap-2 items-center">
                  <p className="text-2xl">{duration}</p>
                  <span className="max-md:hidden">mins</span>
                  <Image
                    className="md:hidden"
                    src="/icons/clock.svg"
                    alt="duration"
                    width={14}
                    height={14}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default CompanionList;
