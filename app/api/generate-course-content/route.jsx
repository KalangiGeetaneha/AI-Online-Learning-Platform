import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import axios from "axios";

import { db } from "@/app/config/db";
import { coursesTable } from "@/app/config/schema";

import { eq } from "drizzle-orm";


const PROMPT = `
Generate detailed course content for the given chapter.

Return ONLY valid JSON.

IMPORTANT RULES:
- Return only JSON.
- Do not use markdown code blocks.
- Do not add \`\`\`json or \`\`\`.
- Make sure the JSON is syntactically valid.
- Escape all double quotes inside JSON string values.
- Use HTML inside the "content" field.
- Use HTML tags such as <h2>, <h3>, <p>, <ul>, <li>, <pre>, and <code>.
- Each topic should contain detailed explanations.
- Each topic should contain at least 2-3 paragraphs.
- Include examples where appropriate.
- Do not put unescaped double quotes inside the content string.

Return exactly this structure:

{
  "chapterName": "Chapter Name",
  "topics": [
    {
      "topic": "Topic Name",
      "content": "<h2>Topic Name</h2><p>Detailed explanation here.</p>"
    }
  ]
}

User Input:
`;


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ========================================
// GENERATE COURSE CONTENT
// ========================================

export async function POST(req) {

  try {

    const {
      courseJson,
      courseTitle,
      courseId,
    } = await req.json();


    if (
      !courseJson?.chapters ||
      courseJson.chapters.length === 0
    ) {

      return NextResponse.json(
        {
          error: "No chapters found",
        },
        {
          status: 400,
        }
      );

    }


    const CourseContent = [];


    // ========================================
    // GENERATE EACH CHAPTER
    // ========================================

    for (
      const chapter
      of courseJson.chapters
    ) {

      console.log(
        "Generating chapter:",
        chapter?.chapterName
      );


      let JSONResp = null;


      // ========================================
      // RETRY AI GENERATION 3 TIMES
      // ========================================

      for (
        let attempt = 1;
        attempt <= 3;
        attempt++
      ) {

        try {

          console.log(
            `Attempt ${attempt} for chapter:`,
            chapter?.chapterName
          );


          const response =
            await groq.chat.completions.create({

              model:
                "llama-3.1-8b-instant",

              messages: [

                {
                  role: "system",

                  content: `
You are an AI course content generator.

Your response must contain ONLY valid JSON.

Never wrap the response in markdown.

Make sure all quotes inside HTML content are properly escaped so the entire response can be parsed using JSON.parse().
                  `,
                },

                {
                  role: "user",

                  content:
                    PROMPT +
                    "\n" +
                    JSON.stringify(
                      chapter
                    ),
                },

              ],

              temperature: 0.3,

            });


          const RawText =
            response
              ?.choices?.[0]
              ?.message
              ?.content;


          if (!RawText) {

            throw new Error(
              "Empty Groq response"
            );

          }


          console.log(
            "Groq Response:",
            RawText
          );


          // ========================================
          // CLEAN RESPONSE
          // ========================================

          const CleanText =
            RawText

              .replace(
                /```json/gi,
                ""
              )

              .replace(
                /```/g,
                ""
              )

              .trim();


          // ========================================
          // PARSE JSON
          // ========================================

          JSONResp =
            JSON.parse(
              CleanText
            );


          // Validate response

          if (
            !JSONResp?.chapterName ||
            !Array.isArray(
              JSONResp?.topics
            )
          ) {

            throw new Error(
              "Invalid course JSON structure"
            );

          }


          console.log(
            "Chapter generated successfully:",
            chapter?.chapterName
          );


          // Successful generation
          // Exit retry loop

          break;


        } catch (error) {

          console.log(
            `Attempt ${attempt} failed for:`,
            chapter?.chapterName
          );

          console.log(
            error?.message ||
            error
          );


          // Wait before retrying

          if (attempt < 3) {

            await new Promise(
              (resolve) =>
                setTimeout(
                  resolve,
                  1500
                )
            );

          }

        }

      }


      // ========================================
      // IF ALL 3 ATTEMPTS FAILED
      // ========================================

      if (!JSONResp) {

        console.log(
          "All attempts failed for:",
          chapter?.chapterName
        );


        JSONResp = {

          chapterName:
            chapter?.chapterName,

          topics: [],

        };

      }


      // ========================================
      // GENERATE YOUTUBE VIDEOS
      // ========================================

      const youtubeData =
        await GetYoutubeVideo(
          chapter?.chapterName
        );


      // ========================================
      // ADD CHAPTER
      // ========================================

      CourseContent.push({

        youtubeVideo:
          youtubeData,

        courseData:
          JSONResp,

      });

    }


    // ========================================
    // SAVE COURSE CONTENT IN DATABASE
    // ========================================

    await db

      .update(
        coursesTable
      )

      .set({

        courseContent:
          CourseContent,

      })

      .where(

        eq(
          coursesTable.cid,
          courseId
        )

      );


    console.log(
      "Course content saved successfully"
    );


    return NextResponse.json({

      courseName:
        courseTitle,

      courseId:
        courseId,

      CourseContent:
        CourseContent,

    });


  } catch (error) {

    console.log(
      "Course Generation Error:",
      error
    );


    return NextResponse.json(

      {
        error:
          "Something went wrong",
      },

      {
        status: 500,
      }

    );

  }

}



// ========================================
// YOUTUBE API
// ========================================

const YOUTUBE_BASE_URL =
  "https://www.googleapis.com/youtube/v3/search";


const GetYoutubeVideo =
  async (topic) => {

    try {

      const params = {

        part:
          "snippet",

        q:
          topic,

        maxResults:
          4,

        type:
          "video",

        key:
          process.env
            .YOUTUBE_API_KEY,

      };


      const resp =
        await axios.get(

          YOUTUBE_BASE_URL,

          {
            params,
          }

        );


      const youtubeVideoListResp =
        resp?.data?.items || [];


      const youtubeVideoList =
        youtubeVideoListResp.map(
          (item) => ({

            videoId:
              item?.id
                ?.videoId,

            title:
              item?.snippet
                ?.title,

          })
        );


      console.log(
        "Youtube Videos:",
        youtubeVideoList
      );


      return youtubeVideoList;


    } catch (error) {

      console.log(
        "Youtube API Error:",
        error?.message ||
        error
      );


      return [];

    }

  };
