import { db } from "@/app/config/db";

import {
  coursesTable,
  enrollCourseTable,
} from "@/app/config/schema";

import { currentUser } from "@clerk/nextjs/server";

import {
  and,
  eq,
  desc,
} from "drizzle-orm";

import { NextResponse } from "next/server";

// ENROLL COURSE
export async function POST(req) {

  try {

    const { courseId } =
      await req.json();

    const user =
      await currentUser();

    // Check already enrolled
    const enrollCourses =
      await db
        .select()
        .from(enrollCourseTable)
        .where(
          and(
            eq(
              enrollCourseTable.userEmail,
              user?.primaryEmailAddress
                ?.emailAddress
            ),

            eq(
              enrollCourseTable.cid,
              courseId
            )
          )
        );

    // If not enrolled
    if (enrollCourses.length === 0) {

      const result =
        await db
          .insert(enrollCourseTable)
          .values({
            cid: courseId,

            userEmail:
              user?.primaryEmailAddress
                ?.emailAddress,

            completedChapters: []
          })
          .returning();

      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    // Already enrolled
    return NextResponse.json({
      success: false,
      message:
        "Already Enrolled",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

// GET ENROLLED COURSE
export async function GET(req) {

  try {

    const user =
      await currentUser();

    const { searchParams } =
      new URL(req.url);

    const courseId =
      searchParams.get('courseId');

    if (courseId) {

      const result = await db
        .select()
        .from(coursesTable)
        .innerJoin(
          enrollCourseTable,
          eq(
            coursesTable.cid,
            enrollCourseTable.cid
          )
        )
        .where(
          and(
            eq(
              enrollCourseTable.userEmail,
              user?.primaryEmailAddress?.emailAddress
            ),

            eq(
              enrollCourseTable.cid,
              courseId
            )
          )
        )
        .orderBy(
          desc(enrollCourseTable.id)
        );

      return NextResponse.json(
        result[0] || {}
      );

    } else {

      const result = await db
        .select()
        .from(coursesTable)
        .innerJoin(
          enrollCourseTable,
          eq(
            coursesTable.cid,
            enrollCourseTable.cid
          )
        )
        .where(
          eq(
            enrollCourseTable.userEmail,
            user?.primaryEmailAddress?.emailAddress
          )
        )
        .orderBy(
          desc(enrollCourseTable.id)
        );

      return NextResponse.json(
        result || []
      );
    }

  } catch (error) {

    console.log(error);

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

// UPDATE COMPLETED CHAPTERS
export async function PUT(req) {

  try {

    const {
      completedChapter,
      courseId
    } = await req.json();

    const user =
      await currentUser();

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

    const result = await db
      .update(enrollCourseTable)
      .set({
        completedChapters:
          completedChapter
      })
      .where(
        and(
          eq(
            enrollCourseTable.cid,
            courseId
          ),

          eq(
            enrollCourseTable.userEmail,
            user?.primaryEmailAddress?.emailAddress
          )
        )
      )
      .returning();

    return NextResponse.json(
      result
    );

  } catch (error) {

    console.log(error);

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