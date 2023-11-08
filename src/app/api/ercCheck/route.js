import axios from "axios";
import { NextResponse } from "next/server";

const apikey = '061a4c94b8cbd7ff33a9140fb235917a'
const secApi = 'bb904b3de3e577e7636ff52805b6aed74d9a378ede15e6ba21751a2d9b95479d'
const alphavantageKey = 'PP9CBRTP0RPFLFRJ';

export async function GET(request, response){
    const symbols = await axios.get('https://financialmodelingprep.com/api/v3/symbol/NASDAQ', {
        params: { apikey: apikey}
    });
    for(let company of symbols.data){
    const earnings = await axios.get('https://www.alphavantage.co/query?function=INCOME_STATEMENT',{
        params:{
            apikey : alphavantageKey,
            symbol : company.symbol
        }
    })
    let quarterlyReports = earnings.data.quarterlyReports;
    console.log(quarterlyReports)
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
    if(qualify2021 && qualify2020){
        return NextResponse.json(`${company.name} | ${company.symbol} may  qualify for 2020 and 2021 based on quarterly wages`)
    }
    else if(qualify2021){
        return NextResponse.json(`${company.name} | ${company.symbol} may  qualify for 2021 based on quarterly wages`)
    }
    else if(qualify2020){
        return NextResponse.json(`${company.name} | ${company.symbol} may  qualify for 2020 based on quarterly wages`)
    }
    else{
        continue
    }
}}