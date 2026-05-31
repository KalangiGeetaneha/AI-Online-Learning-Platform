"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Book, Clock, Loader2Icon, PlayCircle, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function CourseInfo({ course,viewCourse }) {
  const courseLayout = course?.courseJson?.course;

  const [loading, setLoading] = useState(false);

  const router=useRouter();

  const GetCourseContent = async () => {
    try {
      setLoading(true);

      const result = await axios.post(
        "/api/generate-course-content",
        {
          courseJson: courseLayout,
          courseTitle: course?.name,
          courseId: course?.cid,
        }
      );

      console.log(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      router.replace('/workspace')
    }
  };

  return (
    <div className="md:flex gap-5 justify-between p-5 rounded-2xl shadow">

      {/* LEFT SIDE */}
      <div className="flex flex-col gap-5 flex-1">

        <div>
          <h2 className="font-bold text-3xl">
            {courseLayout?.name}
          </h2>

          <p className="line-clamp-2 text-gray-500 mt-2">
            {courseLayout?.description}
          </p>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Duration */}
          <div className="flex gap-5 items-center p-3 rounded-lg shadow border">
            <Clock className="text-blue-500" />

            <section>
              <h2 className="font-bold">
                Duration
              </h2>

              <h2>
                2 Hours
              </h2>
            </section>
          </div>

          {/* Chapters */}
          <div className="flex gap-5 items-center p-3 rounded-lg shadow border">
            <Book className="text-green-500" />

            <section>
              <h2 className="font-bold">
                Chapters
              </h2>

              <h2>
                {courseLayout?.chapters?.length}
              </h2>
            </section>
          </div>

          {/* Level */}
          <div className="flex gap-5 items-center p-3 rounded-lg shadow border">
            <TrendingUp className="text-red-500" />

            <section>
              <h2 className="font-bold">
                Difficulty Level
              </h2>

              <h2>
                {course?.level}
              </h2>
            </section>
          </div>
        </div>

        {/* BUTTON */}

       {!viewCourse ? (

  <Button
    onClick={GetCourseContent}
    disabled={loading}
    className="w-fit"
  >
    {loading ? (
      <>
        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        Generating...
      </>
    ) : (
      "Generate Content"
    )}
  </Button>

) : (
<Link href={`/course/${course?.cid}`}>
  <Button className="w-fit">
    <PlayCircle className="mr-2 h-4 w-4" />
    Continue Learning
  </Button>
</Link>

)}
      </div>

      {/* RIGHT SIDE IMAGE */}
      {course?.bannerImageUrl && (
        <Image
          src={course?.bannerImageUrl}
          alt="bannerImage"
          width={400}
          height={400}
          className="w-full md:w-[350px] mt-5 md:mt-0 h-[240px] rounded-xl object-cover"
        />
      )}
    </div>
  );
}

export default CourseInfo;