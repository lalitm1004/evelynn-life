import { NextRequest, NextResponse } from 'next/server';

import connectMongo from '@/utils/mongodb/connectMongo';
import User, { IUser } from '@/models/user';
import Regcode, { IRegcode } from '@/models/regcode';

import { hashPassword } from '@/utils/hash';

interface IRequestJson {
  username: string;
  password: string;
  regcode: string;
}

export async function POST(request: NextRequest) {
  const { username, password, regcode }: IRequestJson = await request.json();

  if (!(username && password && regcode)) {
    return NextResponse.json({"error": "Missing parameters"}, {status: 400});
  }

  await connectMongo();

  const regcodeProfile: IRegcode | null = await Regcode.findOne({regcode: regcode});
  if (!regcodeProfile) return NextResponse.json({"error": "invalid regcode"}, {status: 200});
  if (!regcodeProfile.active) return NextResponse.json({"error": "registration code not active"}, {status: 200});

  const userProfile: IUser | null = await User.findOne({username: username});
  if (userProfile) return NextResponse.json({"error": "username taken"}, {status: 200});

  const userDetails: IUser = {
    username: username,
    hashedPassword: await hashPassword(password),
    trust: 100,
    regcodes: [],
    invitedBy: `${regcodeProfile.createdBy} - ${regcodeProfile.regcode}`,
  }
  const newUser = new User(userDetails);
  await newUser.save();

  await Regcode.updateOne({regcode: regcode}, { $set: { active: !regcodeProfile.active }});

  return NextResponse.json(userDetails, {status: 200});
}