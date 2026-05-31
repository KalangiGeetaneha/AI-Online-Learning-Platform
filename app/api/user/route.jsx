import { db } from "@/app/config/db";
import { usersTable } from "@/app/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {

    const { email, name } = await req.json();

    // check if user exists

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (users?.length == 0) {

        const result = await db
          .insert(usersTable)
          .values({
              name: name,
              email: email
          })
          .returning();

        console.log(result);

        return NextResponse.json(result);
    }

    return NextResponse.json(users[0]);
}