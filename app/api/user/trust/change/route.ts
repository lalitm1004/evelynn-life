import { NextRequest, NextResponse } from "next/server";
import {  } from "next";
import connectMongo from "@/utils/mongodb/connectMongo";
import User, { IUser } from "@/models/user";

interface IRequestJson {
  username: string;
  changeInTrust: number;
}

export async function POST(request: NextRequest) {
  const { username, changeInTrust }: IRequestJson = await request.json();

  if (!(username && changeInTrust)) {
    return NextResponse.json({"error": "missing parameters"}, {status: 400});
  }

  await connectMongo();

  const userProfile: IUser | null = await User.findOne({username: username});
  if (!userProfile) return NextResponse.json({"error": "user not found"}, {status: 200});
  const currentTrust = userProfile.trust;

  await User.updateOne({username: username}, {$set: {trust: currentTrust + changeInTrust}})
  return NextResponse.json({trust: currentTrust + changeInTrust}, {status: 200});
}