import React, { useContext } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { SelectedChapterIndex } from '@/context/SelectedChapterIndex';

function ChapterListSidebar({ courseInfo }) {

  const course =
    courseInfo?.courses;

  const enrollCourse =
    courseInfo?.enrollCourse;

  // Use courseJson instead of courseContent
  const chapters =
    course?.courseJson?.course
      ?.chapters;

  const {
    selectedChapterIndex,
    setSelectedChapterIndex
  } = useContext(
    SelectedChapterIndex
  );

  return (

    <div className='min-w-[250px] bg-secondary h-screen p-5'>

      <h2 className='my-3 font-bold text-xl'>

        Chapters ({chapters?.length})

      </h2>

      <Accordion
        type="single"
        collapsible
      >

        {chapters?.map(
          (chapter, index) => (

            <AccordionItem
              key={index}
              value={chapter?.chapterName}
              onClick={() =>
                setSelectedChapterIndex(index)
              }
            >

              <AccordionTrigger
                className='text-lg font-medium text-left'
              >

                {index + 1}.{' '}

                {chapter?.chapterName}

              </AccordionTrigger>

              <AccordionContent asChild>

                <div>

                  {chapter?.topics?.map(
                    (topic, topicIndex) => (

                      <h2
                        key={topicIndex}
                        className='p-3 bg-white my-2 rounded-lg text-sm'
                      >

                        {
                          typeof topic === 'string'
                            ? topic
                            : topic?.topic
                        }

                      </h2>
                    )
                  )}

                </div>

              </AccordionContent>

            </AccordionItem>
          )
        )}

      </Accordion>

    </div>
  );
}

export default ChapterListSidebar;