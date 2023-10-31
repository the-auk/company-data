import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request, response) {
    const apikey = '061a4c94b8cbd7ff33a9140fb235917a'
    //process.env.NEXT_PUBLIC_APIKEY;
    
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
        const result2 = await axios.get(`https://www.alphavantage.co/query?function=EARNINGS&symbol=${companies[x].symbol}&apikey=7WUZBM2NPI65JS4L`)
        companies[x]["earningsData"]=result.data[0]
        const result3 = await axios.get(`https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual`, {
            params :{ apikey: apikey}
        });
        companies[x]["annualEarnings"]=result3.data[0]

    }
    return NextResponse.json(companies)
}