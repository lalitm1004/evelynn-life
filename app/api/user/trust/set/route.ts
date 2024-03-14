import { NextRequest, NextResponse } from "next/server";
import {  } from "next";
import connectMongo from "@/utils/mongodb/connectMongo";
import User, { IUser } from "@/models/user";

interface IRequestJson {
  username: string;
  newTrust: number;
}

export async function POST(request: NextRequest) {
  const { username, newTrust }: IRequestJson = await request.json();

  if (!(username && newTrust)) {
    return NextResponse.json({"error": "missing parameters"}, {status: 400});
  }

  await connectMongo();

  const userProfile: IUser | null = await User.findOne({username: username});
  if (!userProfile) return NextResponse.json({"error": "user not found"}, {status: 200});
  const currentTrust = userProfile.trust;

  await User.updateOne({username: username}, {$set: {trust: newTrust}})
  return NextResponse.json({trust: currentTrust + newTrust}, {status: 200});
}