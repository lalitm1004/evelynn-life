import Regcode, { IRegcode } from "@/models/regcode";
import User, { IUser } from "@/models/user";
import connectMongo from "@/utils/mongodb/connectMongo";
import { NextRequest, NextResponse } from "next/server";

interface IRequestJson {
  username: string;
}

interface IResponseJson {
  regcodes: Array<string>
}

export async function POST(request: NextRequest) {
  const { username }: IRequestJson = await request.json();

  if (!(username)) {
    return NextResponse.json({"error": "missing parameters"}, {status: 200})
  }

  await connectMongo();

  const userProfile: IUser | null = await User.findOne({username: username});
  if (!userProfile) return NextResponse.json({"error": "user not found"});


  interface IResponse {

  }

  let response: IResponseJson = {
    regcodes: []
  }
  for (const currentRegcode of userProfile.regcodes) {
    const regcodeProfile: IRegcode | null = await Regcode.findOne({regcode: currentRegcode});
    response.regcodes.push(`${regcodeProfile!.regcode}-${regcodeProfile!.active ? "active" : "inactive"}`)
  }
  return NextResponse.json(response, {status: 200});
}