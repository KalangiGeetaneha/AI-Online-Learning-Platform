"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../edit-course/[courseId]/_components/CourseCard";

const Explore = () => {
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
        "/api/courses?courseId=0"
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
    <div>
      <h2 className="font-bold text-3xl mb-6">
        Explore More Courses
      </h2>

      <div className="flex gap-5 max-w-md">
        <Input placeholder="Search" />

        <Button>
          <Search />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">

        {courseList?.map((course, index) => (
          <CourseCard
            course={course}
            key={index}
          />
        ))}

      </div>
    </div>
  );
};

export default Explore;