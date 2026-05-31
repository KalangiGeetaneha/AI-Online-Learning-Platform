"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";

import {
  Book,
  Loader2,
  PlayCircle,
  Settings,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

function CourseCard({ course }) {

  const courseJson =
    course?.courseJson?.course;

  const [loading, setLoading] =
    useState(false);

  const onEnrollCourse = async () => {

    try {

      setLoading(true);

      const result = await axios.post(
        "/api/enroll-course",
        {
          courseId: course?.cid,
        }
      );
if (!result.data.success) {

  toast.warning(
    result.data.message
  );

} else {

  toast.success(
    "Course Enrolled Successfully"
  );
}
    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-3 shadow-sm hover:shadow-lg transition-all">

      {/* Image */}
      {course?.bannerImageUrl && (
        <Image
          src={course?.bannerImageUrl}
          alt={courseJson?.name || "course"}
          width={400}
          height={300}
          className="w-full aspect-video rounded-xl object-cover"
        />
      )}

      {/* Content */}
      <div className="mt-3">

        <h2 className="font-bold text-lg line-clamp-2">
          {courseJson?.name}
        </h2>

        <p className="line-clamp-2 text-gray-500 text-sm mt-2">
          {courseJson?.description}
        </p>

        <div className="flex justify-between items-center mt-4">

          <h2 className="flex items-center gap-2 text-sm font-medium">
            <Book className="h-4 w-4" />

            {courseJson?.noOfChapters ||
              courseJson?.chapters?.length} Chapters
          </h2>

          {course?.courseContent?.length ? (

            <Button
              size="sm"
              onClick={onEnrollCourse}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enrolling...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Enroll Course
                </>
              )}
            </Button>

          ) : (

            <Link
              href={`/workspace/edit-course/${course?.cid}`}
            >
              <Button
                size="sm"
                variant="outline"
              >
                <Settings className="mr-2 h-4 w-4" />
                Generate Course
              </Button>
            </Link>

          )}

        </div>
      </div>
    </div>
  );
}

export default CourseCard;