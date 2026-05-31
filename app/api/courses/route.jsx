import { db } from "@/app/config/db";
import { coursesTable } from "@/app/config/schema";

import { currentUser } from "@clerk/nextjs/server";

import { eq, sql } from "drizzle-orm";

import { NextResponse } from "next/server";

export async function GET(req) {

  try {

    const { searchParams } = new URL(req.url);

    const courseId =
      searchParams.get("courseId");

    const user = await currentUser();

    // Get all generated courses
    if (courseId === "0") {

      const result = await db
        .select()
        .from(coursesTable)
        .where(
          sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`
        );

      return NextResponse.json(result);
    }

    // Get single course
    if (courseId && courseId !== "''") {

      const result = await db
        .select()
        .from(coursesTable)
        .where(
          eq(coursesTable.cid, courseId)
        );

      if (!result.length) {

        return NextResponse.json(
          {
            error: "Course not found"
          },
          {
            status: 404
          }
        );
      }

      return NextResponse.json(result[0]);
    }

    // Check user
    if (!user) {

      return NextResponse.json(
        {
          error: "Unauthorized"
        },
        {
          status: 401
        }
      );
    }

    // Get current user courses
    const result = await db
      .select()
      .from(coursesTable)
      .where(
        eq(
          coursesTable.userEmail,
          user.primaryEmailAddress?.emailAddress
        )
      );

    return NextResponse.json(result);

  } catch (error) {

    console.log("API Error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong"
      },
      {
        status: 500
      }
    );
  }
}