import { GoogleGenAI } from "@google/genai";
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

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {

    const {
      courseJson,
      courseTitle,
      courseId,
    } = await req.json();

    // Generate Course Content
    const promises = courseJson?.chapters?.map(
      async (chapter) => {

        const response =
          await ai.models.generateContent({
            model: "gemini-2.5-flash",

            contents: [
              {
                role: "user",
                parts: [
                  {
                    text:
                      PROMPT +
                      JSON.stringify(chapter),
                  },
                ],
              },
            ],
          });

        const RawText =
          response.candidates[0].content.parts[0]
            .text;

        console.log(RawText);

        let JSONResp;

        try {

          const CleanText = RawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          JSONResp = JSON.parse(CleanText);

        } catch (error) {

          console.log("Invalid JSON");
          console.log(RawText);

          JSONResp = {
            chapterName:
              chapter?.chapterName,
            topics: [],
          };
        }

        // Generate Youtube Videos
        const youtubeData =
          await GetYoutubeVideo(
            chapter?.chapterName
          );

        return {
          youtubeVideo: youtubeData,
          courseData: JSONResp,
        };
      }
    );

    const CourseContent =
      await Promise.all(promises);

    // Save in Database
    const dbResp = await db
      .update(coursesTable)
      .set({
        courseContent: CourseContent,
      })
      .where(
        eq(coursesTable.cid, courseId)
      );

    console.log(dbResp);

    return NextResponse.json({
      courseName: courseTitle,
      courseId: courseId,
      CourseContent: CourseContent,
    });

  } catch (error) {

    console.log(error);

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
      { params }
    );

    const youtubeVideoListResp =
      resp.data.items;

    const youtubeVideoList = [];

    youtubeVideoListResp.forEach((item) => {

      const data = {
        videoId: item?.id?.videoId,
        title: item?.snippet?.title,
      };

      youtubeVideoList.push(data);
    });

    console.log(youtubeVideoList);

    return youtubeVideoList;

  } catch (error) {

    console.log(
      "Youtube API Error",
      error
    );

    return [];
  }
};