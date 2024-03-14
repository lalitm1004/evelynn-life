import User, { IUser } from "@/models/user";
import connectMongo from "@/utils/mongodb/connectMongo";
import { NextRequest, NextResponse } from "next/server";

interface IRequestJson {
  username: string;
}

export async function POST(request: NextRequest) {
  const { username }: IRequestJson = await request.json();

  if (!(username)) {
    return NextResponse.json({"error": "missing parameters"}, {status: 400});
  }

  await connectMongo();

  const userProfile: IUser | null = await User.findOne({username: username});
  if (!userProfile) return NextResponse.json({"error": "user not found"}, {status: 200});
  return NextResponse.json(userProfile, {status: 200});
}