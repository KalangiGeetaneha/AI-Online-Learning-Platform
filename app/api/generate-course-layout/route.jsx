
import axios from 'axios';

import { db } from '@/app/config/db';
import { coursesTable } from '@/app/config/schema';

import {
  currentUser,
  auth
} from '@clerk/nextjs/server';

import { GoogleGenAI } from '@google/genai';

import { NextResponse } from 'next/server';

import { eq } from 'drizzle-orm';

const PROMPT = `
Generate Learning Course depends on following details.

Make sure to add:
- Course Name
- Description
- Course Banner Image Prompt
- Chapter Name
- Topics under each chapter
- Duration for each chapter

Return ONLY JSON format.

Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ]
      }
    ]
  }
}

User Input:
`;

export async function POST(req) {

  try {

    const formData =
      await req.json();

    const user =
      await currentUser();

    // Clerk Auth
    const { sessionClaims } =
      await auth();

    const hasPremiumAccess =
      sessionClaims?.metadata?.plan ===
      "starter";

    // Gemini AI
    const ai = new GoogleGenAI({
      apiKey:
        process.env.GEMINI_API_KEY,
    });

    // Free User Course Limit
    if (!hasPremiumAccess) {

      const existingCourses =
        await db
          .select()
          .from(coursesTable)
          .where(
            eq(
              coursesTable.userEmail,
              user?.primaryEmailAddress
                ?.emailAddress
            )
          );

      if (
        existingCourses?.length >= 100
      ) {

        return NextResponse.json(
          {
            resp: "limit exceed"
          },
          {
            status: 403
          }
        );
      }
    }

    // Generate Course Content
    let response;

    try {

      response =
        await ai.models.generateContent({

         model: "gemini-1.5-flash",

          contents: `
            ${PROMPT}
            ${JSON.stringify(formData)}
          `,
        });

    } catch (err) {

      console.log(
        "Gemini Error:",
        err
      );

      return NextResponse.json(
        {
          error:
            "AI quota exceeded"
        },
        {
          status: 429
        }
      );
    }

    // Get AI Response
    const RawText =
      response?.candidates?.[0]
        ?.content?.parts?.[0]?.text;

    if (!RawText) {

      return NextResponse.json(
        {
          error:
            "Empty AI response"
        },
        {
          status: 500
        }
      );
    }

    console.log(
      "RAW AI RESPONSE:",
      RawText
    );

    // Remove Markdown
    const CleanText =
      RawText
        ?.replace(/```json/g, "")
        ?.replace(/```/g, "")
        ?.trim();

    console.log(
      "CLEAN TEXT:",
      CleanText
    );

    // Parse JSON
    let JSONResp;

    try {

      JSONResp =
        JSON.parse(CleanText);

    } catch (err) {

      console.log(
        "JSON Parse Error:",
        err
      );

      return NextResponse.json(
        {
          error:
            "Invalid AI JSON"
        },
        {
          status: 500
        }
      );
    }

    // Generate Banner Image
    const ImagePrompt =
      JSONResp?.course
        ?.bannerImagePrompt;

    const bannerImageUrl =
      await GenerateImage(
        ImagePrompt
      );

    // Save Course
    const result = await db
      .insert(coursesTable)
      .values({

        cid:
          crypto.randomUUID(),

        name:
          JSONResp.course.name,

        description:
          JSONResp.course.description,

        noOfChapters:
          JSONResp.course.noOfChapters,

        includeVideo:
          JSONResp.course.includeVideo,

        level:
          JSONResp.course.level,

        category:
          JSONResp.course.category,

        courseJson:
          JSONResp,

        bannerImageUrl:
          bannerImageUrl,

        userEmail:
          user?.primaryEmailAddress
            ?.emailAddress,

      })
      .returning();

    return NextResponse.json({
      courseId:
        result[0].cid
    });

  } catch (error) {

    console.log(
      "SERVER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong"
      },
      {
        status: 500
      }
    );
  }
}

// Generate Banner Image
const GenerateImage = async (
  imagePrompt
) => {

  try {

    const BASE_URL =
      'https://aigurulab.tech';

    const result =
      await axios.post(

        BASE_URL +
        '/api/generate-image',

        {
          width: 1024,

          height: 1024,

          input: imagePrompt,

          model: 'flux',

          aspectRatio: "16:9"
        },

        {
          headers: {

            'x-api-key':
              process.env
                .AI_GURU_LAB,

            'Content-Type':
              'application/json',
          },
        }
      );

    return result.data.image;

  } catch (error) {

    console.log(
      "Image Generation Error:",
      error
    );

    return null;
  }
};

