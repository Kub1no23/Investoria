import fetch from "node-fetch";
import { restClient } from '@massive.com/client-js';
import dotenv from "dotenv";
import { aggregateBars, aggregateDaily, saveBars, prisma } from "./saveBars.js";

dotenv.config();
if (!process.env.POLY_API_KEY) {
    throw new Error('POLY_API_KEY is not set in environment variables');
}

const symbols = ["AAPL"];
const range = { start: "2025-08-04", end: "2025-08-08" };
const rest = restClient(process.env.POLY_API_KEY, 'https://api.massive.com');

const fetchAllBars = async (ticker) => {
    let bars = [];
    try {
        const response = await rest.getStocksAggregates(
            ticker,
            1,
            "minute",
            range.start,
            range.end,
            "true",
            "asc",
            "500"
        );
        console.log('Response:', response.next_url);
        bars.push(...response.results);
        console.log(response.queryCount)

        let callsLeft = 4;
        let nextUrl = response.next_url;
        const delay = ms => new Promise(res => setTimeout(res, ms));

        if (nextUrl) {
            while (nextUrl) {
                while (callsLeft > 0 && nextUrl) {
                    console.log('calls left: ' + callsLeft);
                    nextUrl = await fetchRange(bars, nextUrl);
                    callsLeft--;
                }

                if (nextUrl) {
                    console.log('Waiting 60s before next batch...');
                    await delay(60000);
                    callsLeft = 5;
                }
            }

        }
        console.log(`Done fetching data for ${response.ticker}`);
        return bars;
    } catch (e) {
        console.log(e);
        console.error(`An error happened:', ${response.status}: ${response.data.error}`);
    }
}

const fetchRange = async (bars, nextUrl) => {
    const response = await fetch(nextUrl + `&apiKey=${process.env.POLY_API_KEY}`);
    const data = await response.json();
    bars.push(...data.results);
    console.log(data.queryCount);

    if (data.next_url) {
        console.log(data.next_url);
        return data.next_url
    } else {
        return null;
    }
}

async function main() {
    for (let ticker of symbols) {
        const bars = await fetchAllBars(ticker);
        console.log(bars.length);

        const M1Aggregate = bars.map(bar => ({
            time: bar.t / 1000,
            open: bar.o,
            high: bar.h,
            low: bar.l,
            close: bar.c
        }));

        const dailyAggregate = aggregateDaily(M1Aggregate);
        const M5Aggregate = aggregateBars(M1Aggregate, 5);
        const M15Aggregate = aggregateBars(M5Aggregate, 3, 5);
        const H1Aggregate = aggregateBars(M15Aggregate, 4, 15);
        const H4Aggregate = aggregateBars(H1Aggregate, 4, 60);

        await saveBars(M1Aggregate, ticker, 'm1');
        await saveBars(M5Aggregate, ticker, 'm5');
        await saveBars(M15Aggregate, ticker, 'm15');
        await saveBars(H1Aggregate, ticker, 'h1');
        await saveBars(H4Aggregate, ticker, 'h4');
        await saveBars(dailyAggregate, ticker, 'd');
    }
}

main()
    .then(() => {
        console.log("All done");
    })
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });