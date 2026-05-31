"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

import AddNewCourseDialog from "./AddNewCourseDialog";
import CourseCard from "../edit-course/[courseId]/_components/CourseCard";


function CourseList() {

  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {

    if (user) {
      GetCourseList();
    }

  }, [user]);

  const GetCourseList = async () => {

    try {

      setLoading(true);

      const result = await axios.get(
        "/api/courses"
      );

      console.log(result.data);

      setCourseList(result.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="mt-10">

      {/* Heading */}
      <h2 className="font-bold text-xl">
        Course List
      </h2>

      {/* Loading */}
      {loading ? (

        <div className="mt-10 text-center">
          <h2 className="text-lg font-medium">
            Loading Courses...
          </h2>
        </div>

      ) : courseList?.length === 0 ? (

        /* Empty State */
        <div className="flex p-7 items-center justify-center flex-col border rounded-xl mt-5 bg-secondary">

          <Image
            src="/online-education.png"
            alt="edu"
            width={80}
            height={100}
          />

          <h2 className="my-2 text-xl font-bold text-center">
            Looks like you haven't created any
            courses yet
          </h2>

          <AddNewCourseDialog>
            <Button>
              + Create your first course
            </Button>
          </AddNewCourseDialog>
        </div>

      ) : (

        /* Course Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">

          {courseList?.map((course, index) => (
            <CourseCard
              course={course}
              key={index}
            />
          ))}

        </div>
      )}
    </div>
  );
}

export default CourseList;