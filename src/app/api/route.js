import { NextResponse } from "next/server";

export async function GET(request, response) {
  return NextResponse.json({'creator':'Tanmay Siwach'})
}