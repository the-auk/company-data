import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request, response) {
  const {query} = await request.json();
  const result = await axios.get(`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&format=json`, {
      params:{
        srsearch:query
      }
    })
  return NextResponse.json(result.data.query)
}

