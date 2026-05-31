import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";

import {
  Book,
  PlayCircle,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import React from "react";

function EnrollCourseCard({
  course,
  enrollCourse,
}) {

  const courseJson =
    course?.courseJson?.course;

  const CalculatePerProgress = () => {

    const completed =
      enrollCourse?.completedChapters
        ?.length || 0;

    const total =
      course?.courseContent?.length || 1;

    return Math.round(
      (completed / total) * 100
    );
  };

  return (

    <div className="shadow rounded-xl border overflow-hidden hover:shadow-lg transition-all">

      {/* Image */}
      <Image
        src={course?.bannerImageUrl}
        alt={courseJson?.name}
        width={400}
        height={300}
        className="w-full h-[200px] object-cover"
      />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">

        {/* Title */}
        <h2 className="font-bold text-lg line-clamp-2">
          {courseJson?.name}
        </h2>

        {/* Description */}
        <p className="line-clamp-3 text-gray-500 text-sm">
          {courseJson?.description}
        </p>

        {/* Chapters */}
        <div className="flex items-center gap-2 text-sm font-medium">

          <Book className="h-4 w-4 text-primary" />

          <span>
            {courseJson?.chapters?.length} Chapters
          </span>

        </div>

        {/* Progress */}
        <div>

          <h2 className="flex justify-between text-sm text-primary mb-2">

            <span>Progress</span>

            <span>
              {CalculatePerProgress()}%
            </span>

          </h2>

          <Progress
            value={CalculatePerProgress()}
          />

          {/* Button */}
          <Link href={'/workspace/view-course/'+course?.cid}>
          <Button className="mt-4 w-full">

            <PlayCircle className="mr-2 h-4 w-4" />

            Continue Learning

          </Button>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default EnrollCourseCard;