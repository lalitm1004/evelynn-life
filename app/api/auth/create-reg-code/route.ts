import { NextRequest, NextResponse } from "next/server";

import connectMongo from "@/utils/mongodb/connectMongo";
import User, { IUser } from "@/models/user";
import Regcode from "@/models/regcode";
import { IRegcode } from "@/models/regcode";
import { generateRegcode } from "@/utils/regcode";

interface IRequestJson {
  username: string;
}

export async function POST(request: NextRequest) {
  const { username }: IRequestJson = await request.json();

  if (!username) {
    return NextResponse.json({"error": "Missing Parameters"}, {status: 400});
  }

  await connectMongo();

  const userProfile: IUser | null = await User.findOne({username: username});
  if (!userProfile) return NextResponse.json({"error": "user not found"}, {status: 200})

  const trust = userProfile.trust;
  if (trust < 800) return NextResponse.json({"error": "insufficient trust: 800 required"}, {status: 200});
  if (userProfile.regcodes.length > 2) return NextResponse.json({"error": "maximum number of regcodes created"}, {status: 200});

  let regcode:string | null = null;
  while (!regcode) {
    const possibleRegcode = generateRegcode();
    const match: IRegcode|null = await  Regcode.findOne({regcode: possibleRegcode});
    if (!match) regcode = possibleRegcode;
  }

  const regcodeDetails: IRegcode = {
    regcode: regcode,
    active: true,
    createdBy: username,
  }
  const newRegcode = new Regcode(regcodeDetails);
  await newRegcode.save();

  await User.updateOne({username: username}, { $push: { regcodes: regcode }});

  return NextResponse.json(regcodeDetails, {status: 200});
}