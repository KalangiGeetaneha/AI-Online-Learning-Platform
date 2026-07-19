import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import axios from "axios";

import { db } from "@/app/config/db";
import { coursesTable } from "@/app/config/schema";

import { eq } from "drizzle-orm";

const PROMPT = `
Generate course content in valid JSON format only.

Rules:
- Return ONLY valid JSON
- Do not add markdown
- Do not add \`\`\`
- content must be detailed HTML format
- Include headings, paragraphs, bullet points and examples
- Each topic should contain at least 2-3 paragraphs

Schema:
{
  "chapterName": "",
  "topics": [
    {
      "topic": "",
      "content": ""
    }
  ]
}

User Input:
`;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const {
      courseJson,
      courseTitle,
      courseId,
    } = await req.json();

    if (!courseJson?.chapters) {
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

    for (const chapter of courseJson.chapters) {
      try {
        console.log(
          "Generating chapter:",
          chapter?.chapterName
        );

        const response =
          await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",

            messages: [
              {
                role: "user",
                content:
                  PROMPT +
                  JSON.stringify(chapter),
              },
            ],

            response_format: {
              type: "json_object",
            },

            temperature: 0.7,
          });

        const RawText =
          response.choices[0]?.message
            ?.content;

        console.log("Groq Response:");
        console.log(RawText);

        let JSONResp;

        try {
          JSONResp = JSON.parse(RawText);
        } catch (error) {
          console.log(
            "Invalid JSON Response"
          );

          console.log(RawText);

          JSONResp = {
            chapterName:
              chapter?.chapterName,
            topics: [],
          };
        }

        const youtubeData =
          await GetYoutubeVideo(
            chapter?.chapterName
          );

        CourseContent.push({
          youtubeVideo: youtubeData,
          courseData: JSONResp,
        });

      } catch (error) {
        console.log(
          "Error generating chapter:",
          chapter?.chapterName
        );

        console.log(error);

        CourseContent.push({
          youtubeVideo: [],
          courseData: {
            chapterName:
              chapter?.chapterName,
            topics: [],
          },
        });
      }
    }

    await db
      .update(coursesTable)
      .set({
        courseContent: CourseContent,
      })
      .where(
        eq(coursesTable.cid, courseId)
      );

    console.log(
      "Course content saved successfully"
    );

    return NextResponse.json({
      courseName: courseTitle,
      courseId: courseId,
      CourseContent: CourseContent,
    });

  } catch (error) {
    console.log(
      "Course Generation Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}


// ================= YOUTUBE API =================

const YOUTUBE_BASE_URL =
  "https://www.googleapis.com/youtube/v3/search";


const GetYoutubeVideo = async (topic) => {
  try {

    const params = {
      part: "snippet",
      q: topic,
      maxResults: 4,
      type: "video",
      key: process.env.YOUTUBE_API_KEY,
    };

    const resp = await axios.get(
      YOUTUBE_BASE_URL,
      {
        params,
      }
    );

    const youtubeVideoListResp =
      resp.data.items;

    const youtubeVideoList = [];

    youtubeVideoListResp.forEach(
      (item) => {

        const data = {
          videoId:
            item?.id?.videoId,

          title:
            item?.snippet?.title,
        };

        youtubeVideoList.push(data);
      }
    );

    console.log(
      "Youtube Videos:",
      youtubeVideoList
    );

    return youtubeVideoList;

  } catch (error) {

    console.log(
      "Youtube API Error:",
      error
    );

    return [];
  }
};