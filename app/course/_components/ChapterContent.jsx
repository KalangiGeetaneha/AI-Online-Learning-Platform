import { Button } from '@/components/ui/button';
import { SelectedChapterIndex } from '@/context/SelectedChapterIndex';

import axios from 'axios';

import {
  CheckCircle,
  X
} from 'lucide-react';

import { useParams } from 'next/navigation';

import React, {
  useContext
} from 'react';

import YouTube from 'react-youtube';

import { toast } from 'sonner';

function ChapterContent({
  courseInfo,
  refreshData
}) {

  const { courseId } = useParams();

  const course =
    courseInfo?.courses;

  const enrollCourse =
    courseInfo?.enrollCourse;

  const courseContent =
    courseInfo?.courses?.courseContent;

  const {
    selectedChapterIndex,
    setSelectedChapterIndex
  } = useContext(
    SelectedChapterIndex
  );

  const videoData =
    courseContent?.[
      selectedChapterIndex
    ]?.youtubeVideo;

  const topics =
    courseContent?.[
      selectedChapterIndex
    ]?.courseData?.topics;

  // Mark Completed
  const markChapterCompleted = async () => {

    try {

      let completedChapters =
        enrollCourse?.completedChapters ?? [];

      // Prevent duplicate
      if (
        !completedChapters.includes(
          selectedChapterIndex
        )
      ) {

        completedChapters.push(
          selectedChapterIndex
        );
      }

      const result = await axios.put(
        '/api/enroll-course',
        {
          courseId: courseId,
          completedChapter:
            completedChapters
        }
      );

      console.log(result);

      refreshData();

      toast.success(
        'Chapter Marked Completed'
      );

    } catch (error) {

      console.log(error);

      toast.error(
        'Something went wrong'
      );
    }
  };

  // Mark Incomplete
  const markChapterIncomplete = async () => {

    try {

      let completedChapters =
        enrollCourse?.completedChapters ?? [];

      // Remove chapter
      completedChapters =
        completedChapters.filter(
          (item) =>
            item !== selectedChapterIndex
        );

      const result = await axios.put(
        '/api/enroll-course',
        {
          courseId: courseId,
          completedChapter:
            completedChapters
        }
      );

      console.log(result);

      refreshData();

      toast.success(
        'Chapter Marked Incomplete'
      );

    } catch (error) {

      console.log(error);

      toast.error(
        'Something went wrong'
      );
    }
  };

  return (

    <div className='p-10'>

      {/* Header */}
      <div className='flex justify-between items-center'>

        <h2 className='font-bold text-2xl'>

          {selectedChapterIndex + 1}.
          {' '}

          {
            courseContent?.[
              selectedChapterIndex
            ]?.courseData?.chapterName
          }

        </h2>

        {
          enrollCourse?.completedChapters?.includes(
            selectedChapterIndex
          ) ? (

            <Button
              variant='outline'
              onClick={
                markChapterIncomplete
              }
            >

              <CheckCircle
                className='mr-2 h-4 w-4 text-green-500'
              />

              Mark as Incomplete

            </Button>

          ) : (

            <Button
              onClick={
                markChapterCompleted
              }
            >

              <CheckCircle
                className='mr-2 h-4 w-4'
              />

              Mark as Completed

            </Button>

          )
        }

      </div>

      {/* Videos */}
      <h2 className='my-2 font-bold text-lg'>
        Related Videos
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

        {videoData?.map(
          (video, index) =>

            index < 2 && (

              <div
  key={index}
  style={{
    width: '100%',
    height: '250px',
  }}
>
  <YouTube
    videoId={video?.videoId}
    opts={{
      width: '100%',
      height: '250',
      playerVars: {
        origin: 'http://localhost:3000',
      },
    }}
  />
</div>
            )
        )}

      </div>

      {/* Topics */}
      <div className='mt-7'>

  {topics?.map(
    (topic, index) => (

      <div
        key={index}
        className='mt-6 p-5 bg-secondary rounded-2xl'
      >

        <h2 className='font-bold text-xl text-primary break-words'>

          {index + 1}.{' '}

          {
            typeof topic === 'string'
              ? topic
              : topic?.topic
          }

        </h2>

        {
          typeof topic !== 'string' &&
          topic?.content && (

            <div
              className='overflow-x-auto break-words [&_pre]:overflow-x-auto [&_img]:max-w-full mt-4'
              dangerouslySetInnerHTML={{
                __html: topic?.content
              }}
              style={{
                lineHeight: '2.2',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            />

          )
        }

      </div>
    )
  )}

</div>
    </div>
  );
}

export default ChapterContent;