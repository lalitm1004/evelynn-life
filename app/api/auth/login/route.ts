import { NextResponse } from 'next/server'

import connectMongo from '@/utils/mongodb/connectMongo';
import User, { IUser } from '@/models/user';

import { comparePassword } from '@/utils/hash';

interface IRequestJson {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  const {username, password}: IRequestJson = await request.json();

  if (!(username && password)) {
    return NextResponse.json({"error": "Missing parameters"}, {status: 400});
  }

  await connectMongo();

  const userProfile : IUser | null = await User.findOne({username: username});
  if (!userProfile) return NextResponse.json({"error": "user not found"}, {status: 200})

  const hashedPassword = userProfile.hashedPassword;
  const valid: boolean = await comparePassword(password, hashedPassword);

  if (!valid) return NextResponse.json({"error": "invalid password"}, {status: 200})

  return NextResponse.json(userProfile, {status: 200});
}