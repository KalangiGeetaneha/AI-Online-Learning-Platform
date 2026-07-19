import axios from "axios";
import Groq from "groq-sdk";

import { db } from "@/app/config/db";
import { coursesTable } from "@/app/config/schema";

import {
  currentUser,
  auth,
} from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

const PROMPT = `
Generate a learning course based on the following user details.

Make sure to add:
- Course Name
- Description
- Course Banner Image Prompt
- Chapter Name
- Topics under each chapter
- Duration for each chapter

Return ONLY valid JSON.

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

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.json();

    const user = await currentUser();

    const { sessionClaims } = await auth();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const hasPremiumAccess =
      sessionClaims?.metadata?.plan === "starter";

    // ==============================
    // FREE USER COURSE LIMIT
    // ==============================

    if (!hasPremiumAccess) {
      const existingCourses = await db
        .select()
        .from(coursesTable)
        .where(
          eq(
            coursesTable.userEmail,
            user?.primaryEmailAddress?.emailAddress
          )
        );

      if (existingCourses?.length >= 100) {
        return NextResponse.json(
          {
            error: "Course limit exceeded",
          },
          {
            status: 403,
          }
        );
      }
    }

    // ==============================
    // GENERATE COURSE USING GROQ
    // ==============================

    let response;

    try {
      response =
        await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",

          messages: [
            {
              role: "system",
              content:
                "You are a course generation assistant. Always return valid JSON only.",
            },
            {
              role: "user",
              content:
                PROMPT +
                "\n" +
                JSON.stringify(formData),
            },
          ],

          response_format: {
            type: "json_object",
          },

          temperature: 0.7,
        });

    } catch (err) {
      console.log("Groq Error:", err);

      return NextResponse.json(
        {
          error:
            "AI server is busy. Please try again.",
        },
        {
          status: 429,
        }
      );
    }

    // ==============================
    // EXTRACT GROQ RESPONSE
    // ==============================

    const RawText =
      response?.choices?.[0]?.message?.content;

    if (!RawText) {
      return NextResponse.json(
        {
          error: "Empty AI response",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "RAW GROQ RESPONSE:",
      RawText
    );

    // ==============================
    // CLEAN RESPONSE
    // ==============================

    const CleanText = RawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log(
      "CLEAN TEXT:",
      CleanText
    );

    // ==============================
    // PARSE JSON
    // ==============================

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
            "Invalid AI JSON format",
        },
        {
          status: 500,
        }
      );
    }

    // ==============================
    // VALIDATE RESPONSE
    // ==============================

    if (!JSONResp?.course) {
      console.log(
        "Invalid Course Structure:",
        JSONResp
      );

      return NextResponse.json(
        {
          error:
            "AI returned invalid course structure",
        },
        {
          status: 500,
        }
      );
    }

    // ==============================
    // GENERATE BANNER IMAGE
    // ==============================

    const ImagePrompt =
      JSONResp?.course
        ?.bannerImagePrompt;

    let bannerImageUrl = null;

    if (ImagePrompt) {
      bannerImageUrl =
        await GenerateImage(
          ImagePrompt
        );
    }

    // ==============================
    // SAVE COURSE IN DATABASE
    // ==============================

    const result = await db
      .insert(coursesTable)
      .values({
        cid: crypto.randomUUID(),

        name:
          JSONResp?.course?.name,

        description:
          JSONResp?.course
            ?.description,

        noOfChapters:
          JSONResp?.course
            ?.noOfChapters,

        includeVideo:
          JSONResp?.course
            ?.includeVideo,

        level:
          JSONResp?.course?.level,

        category:
          JSONResp?.course
            ?.category,

        courseJson:
          JSONResp,

        bannerImageUrl:
          bannerImageUrl,

        userEmail:
          user?.primaryEmailAddress
            ?.emailAddress,
      })
      .returning();

    console.log(
      "Course created successfully:",
      result?.[0]?.cid
    );

    return NextResponse.json({
      courseId:
        result?.[0]?.cid,
    });

  } catch (error) {
    console.log(
      "SERVER ERROR:",
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


// =====================================
// GENERATE BANNER IMAGE
// =====================================

const GenerateImage = async (
  imagePrompt
) => {

  try {

    const BASE_URL =
      "https://aigurulab.tech";

    const result =
      await axios.post(

        BASE_URL +
          "/api/generate-image",

        {
          width: 1024,

          height: 1024,

          input:
            imagePrompt,

          model:
            "flux",

          aspectRatio:
            "16:9",
        },

        {
          headers: {

            "x-api-key":
              process.env
                .AI_GURU_LAB,

            "Content-Type":
              "application/json",
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