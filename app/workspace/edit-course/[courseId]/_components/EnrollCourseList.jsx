"use client";

import axios from "axios";

import React, {
  useEffect,
  useState,
} from "react";

import EnrollCourseCard from "./EnrollCourseCard";

const EnrollCourseList = () => {

  const [
    enrolledCourseList,
    setEnrolledCourseList,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    GetEnrollCourse();

  }, []);

  const GetEnrollCourse = async () => {

    try {

      setLoading(true);

      const result = await axios.get(
        "/api/enroll-course"
      );

      console.log(result.data);

      setEnrolledCourseList(
        result.data
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  if (loading) {

    return (
      <div className="mt-10">
        <h2 className="font-bold text-2xl">
          Loading Courses...
        </h2>
      </div>
    );
  }

  return (

    enrolledCourseList?.length > 0 && (

      <div className="mt-10">

        {/* Heading */}
        <h2 className="font-bold text-2xl mb-5">

          Continue Learning your Courses

        </h2>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {enrolledCourseList?.map(
            (item, index) => (

              <EnrollCourseCard
                key={index}

                course={item?.courses}

                enrollCourse={
                  item?.enrollCourse
                }
              />
            )
          )}

        </div>
      </div>
    )
  );
};

export default EnrollCourseList;