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
const companyCheck = async (company) =>{
    const industry = await axios.get(`https://financialmodelingprep.com/api/v3/profile/${company}`, {
        params : {apikey:apikey}
    })
    let qualifyIndustry=false;
    if(industries[industry.data[0].industry]==1){
        qualifyIndustry=true;
    }
    const earnings = await axios.get('https://www.alphavantage.co/query?function=INCOME_STATEMENT',{
        params:{
            apikey : alphavantageKey,
            symbol : company
        }
    })
    let qualify2021 = false;
    let qualify2020 = false;
    let earnings2021 = [];
    let earnings2020 = [];
    let earnings2019 = [];
    try {
    let quarterlyReports = earnings.data.quarterlyReports;
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
        let returnResponse = NextResponse.json(`${industry.data[0].companyName} | ${industry.data[0].symbol} may qualify based on${qualify2020 ?' reports from 2020':''}${(qualify2020 && qualify2021)?' &':''}${qualify2021 ? ' reports from 2021':''}${((qualify2020 || qualify2021) && qualifyIndustry)?' or':''}${qualifyIndustry ? ', if the business was impacted by a Government Mandate':''}`)
        return {'qualifies':true, 'response':returnResponse}
    }
    } catch (error) {
        let returnResponse = NextResponse.json(`${industry.data[0].companyName} | ${industry.data[0].symbol} may qualify based on${qualify2020 ?' reports from 2020':''}${(qualify2020 && qualify2021)?' &':''}${qualify2021 ? ' reports from 2021':''}${((qualify2020 || qualify2021) && qualifyIndustry)?' or':''}${qualifyIndustry ? ', if the business was impacted by a Government Mandate':''}`)
        if(qualify2020 || qualify2021 || qualifyIndustry){
            return {'qualifies':true, 'response':returnResponse}
        }
        else{
        return {'qualifies':false}}
    }
    
}
export async function POST(request, response){
    const { query } = await request.json();
    const result = await companyCheck(query)
    if(result.qualifies){
        return result.response
    }
    else{
        return NextResponse.json("THIS COMPANY DOES NOT SEEM TO QUALIFY FOR ERC BASED ON THE PARAMETER WE HAVE IN STORE")
    }
}
export async function GET(request, response){
    const symbols = await axios.get('https://financialmodelingprep.com/api/v3/symbol/NASDAQ', {
        params: { apikey: apikey}
    });
    for(let company of symbols.data){
        const result = await companyCheck(company)
        if(result.qualifies){
            return result.response
        }
        else{
            continue
        }
}
}