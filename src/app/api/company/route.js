import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request, response) {
    const apikey = '';
    const { query } = await request.json();
    const generalResult = await axios.get('https://financialmodelingprep.com/api/v3/search?limit=5&exchange=NASDAQ', {
        params: { apikey: apikey,
             query: query }
    });
    let companies = generalResult.data;
    if(companies.length==0){
        return NextResponse.json("No Hits")
    }
    for (let x in companies) {

        const result = await axios.get(`https://financialmodelingprep.com/api/v3/profile/${companies[x].symbol}`, {
            params: { apikey: apikey }
        });
        companies[x]["companyData"]=result.data[0]
    }
    return NextResponse.json(companies)
}