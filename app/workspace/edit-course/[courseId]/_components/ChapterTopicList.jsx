import { Gift } from "lucide-react";
import React from "react";

function ChapterTopicList({ course }) {
  const courseLayout = course?.courseJson?.course;

  return (
    <div className="mt-16">
      {/* Heading */}
      <h2 className="font-bold text-3xl mb-14">
        Chapters & Topics
      </h2>

      {/* Main Container */}
      <div className="flex flex-col items-center">

        {courseLayout?.chapters?.map((chapter, chapterIndex) => (
          <div
            key={chapterIndex}
            className="flex flex-col items-center"
          >

            {/* Chapter Card */}
            <div className="bg-primary text-white p-6 rounded-2xl shadow-xl min-w-[450px] text-center">
              
              <h2 className="text-lg">
                Chapter {chapterIndex + 1}
              </h2>

              <h2 className="font-bold text-3xl mt-2">
                {chapter?.chapterName}
              </h2>

              <div className="flex justify-between mt-4 text-sm">
                <span>
                  Duration: {chapter?.duration}
                </span>

                <span>
                  No. Of Topics: {chapter?.topics?.length}
                </span>
              </div>
            </div>

            {/* Topics */}
            {chapter?.topics?.map((topic, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
              >

                {/* Vertical Line */}
                <div className="h-16 w-[4px] bg-gray-300"></div>

                {/* Topic Row */}
                <div className="grid grid-cols-[1fr_80px_1fr] items-center w-full min-w-[1000px] gap-6">

                  {/* Left Topic */}
                  <div className="flex justify-end pr-8">
                    {index % 2 !== 0 && (
                      <h2 className="text-right text-gray-700 text-base font-medium leading-8 w-[350px]">
                        {topic}
                      </h2>
                    )}
                  </div>

                  {/* Center Circle */}
                  <div className="flex justify-center">
                    <div className="rounded-full bg-gray-300 h-16 w-16 flex items-center justify-center font-bold text-lg shadow-md">
                      {index + 1}
                    </div>
                  </div>

                  {/* Right Topic */}
                  <div className="flex justify-start pl-8">
                    {index % 2 === 0 && (
                      <h2 className="text-gray-700 text-base font-medium leading-8 w-[350px]">
                        {topic}
                      </h2>
                    )}
                  </div>

                </div>

                {/* Last Topic */}
                {index === chapter?.topics?.length - 1 && (
                  <>
                    {/* Bottom Line */}
                    <div className="h-16 w-[4px] bg-gray-300"></div>

                    {/* Gift Icon */}
                    <div className="bg-gray-300 rounded-full p-4 shadow-md">
                      <Gift className="h-6 w-6" />
                    </div>
                  </>
                )}
              </div>
            ))}

          </div>
        ))}

        {/* Finish Card */}
        <div className="bg-green-600 text-white p-5 rounded-2xl shadow-xl mt-10">
          <h2 className="font-bold text-xl">
            Finish
          </h2>
        </div>

      </div>
    </div>
  );
}

export default ChapterTopicList;