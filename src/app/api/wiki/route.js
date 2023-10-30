import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request, response) {
  const {query} = await request.json();
  const result = await axios.get(`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&format=json`, {
      params:{
        srsearch:query
      }
    })
  let tempLength = result.data.query.searchinfo.totalhits;
  if(tempLength==0){
    return NextResponse.json("No Hits")
  }
  let tempFirst = result.data.query.search[0].snippet;
    while (tempFirst.includes(`<span class=\"searchmatch\">`) || tempFirst.includes("</span>")) {
      tempFirst = tempFirst.replace(`<span class=\"searchmatch\">`, "")
      tempFirst = tempFirst.replace("</span>", "")
    }
  let returnResult = {'numberOfHits':result.data.query.searchinfo.totalhits, 'firstHit':tempFirst}
  console.log(returnResult)
  return NextResponse.json(returnResult)
}
