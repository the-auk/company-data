import axios from "axios";
import { NextResponse } from "next/server";

const apikey = '061a4c94b8cbd7ff33a9140fb235917a'
const alphavantageKey = 'PP9CBRTP0RPFLFRJ';
const industries = {
    'Travel Services':1,
    'Department Stores':1,
    'Entertainment':1,
    'Airlines':1,
    'Auto & Truck Dealerships':1
}
export async function GET(request, response){
    const symbols = await axios.get('https://financialmodelingprep.com/api/v3/symbol/NASDAQ', {
        params: { apikey: apikey}
    });
    for(let company of symbols.data){
    const industry = await axios.get(`https://financialmodelingprep.com/api/v3/profile/AN`, {
        params : {apikey:apikey}
    })
    let qualifyIndustry=false;
    if(industries[industry.data.industry]==1){
        qualifyIndustry=true;
    }
    const earnings = await axios.get('https://www.alphavantage.co/query?function=INCOME_STATEMENT',{
        params:{
            apikey : alphavantageKey,
            symbol : company.symbol
        }
    })
    let quarterlyReports = earnings.data.quarterlyReports;
    let qualify2021 = false;
    let qualify2020 = false;
    let earnings2021 = [];
    let earnings2020 = [];
    let earnings2019 = [];
    for(let quarter of quarterlyReports){
        if(quarter.fiscalDateEnding.includes("2021")){
            earnings2021.push(quarter.totalRevenue)
        }
        else if(quarter.fiscalDateEnding.includes("2020")){
            earnings2020.push(quarter.totalRevenue)
        }
        else if(quarter.fiscalDateEnding.includes("2019")){
            earnings2019.push(quarter.totalRevenue)
        }
        else if(quarter.fiscalDateEnding.includes("2018")){
            break;
        }
    }
    for(let index=0;index<earnings2019.length;index++){
        if(earnings2021[index]<earnings2019[index]*0.8){
            qualify2021 = true;
        }
        if(earnings2021[index]<earnings2019[index]*0.5){
            qualify2020 = true;
        }
    }
    if(qualify2020 || qualify2021 || qualifyIndustry){

        return NextResponse.json(`${company.name} | ${company.symbol} may qualify based on ${qualify2020 && 'reports from 2020'}
        ${qualify2021 && 'reports from 2021'} ${qualifyIndustry && 'if your business was impacted by a Government Mandate'}`)
    }
    else{
        continue
    }
}
}