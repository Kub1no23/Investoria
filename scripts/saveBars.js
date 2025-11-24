import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function saveBars(bars, symbol, timeframe) {
    const batchSize = 20000;

    console.log(`Saving ${bars.length} bars for ${symbol} [TF=${timeframe}]`);

    for (let i = 0; i < bars.length; i += batchSize) {
        const chunk = bars.slice(i, i + batchSize);
        try {
            await prisma.oHLC.createMany({
                data: chunk.map(bar => ({
                    symbol,
                    timeframe,
                    time: bar.time,
                    open: bar.open,
                    high: bar.high,
                    low: bar.low,
                    close: bar.close,
                })),
                skipDuplicates: true,
            });

            console.log(`Saved batch ${i} – ${i + chunk.length}`);

        } catch (e) {
            console.error("Error inserting batch:", e);
        }
    }
    console.log(`Done`);
}


function aggregateBars(bars, multiplier, baseIntervalMinutes = 1) {
    const aggregates = [];
    let bucket = [];
    let bucketStartTime = null;

    for (const bar of bars) {
        const timestamp = bar.time;

        //5m interval: 13:32:15 → 13:30:00
        const barIntervalStart = Math.floor(timestamp / (multiplier * baseIntervalMinutes * 60)) * multiplier * baseIntervalMinutes * 60; // v sekundách

        if (bucketStartTime === null) {
            bucketStartTime = barIntervalStart;
        }

        if (barIntervalStart === bucketStartTime) {
            bucket.push(bar);
        } else {
            const open = bucket[0].open;
            const close = bucket[bucket.length - 1].close;
            const high = Math.max(...bucket.map(b => b.high));
            const low = Math.min(...bucket.map(b => b.low));

            aggregates.push({ time: bucketStartTime, open, high, low, close });

            bucket = [bar];
            bucketStartTime = barIntervalStart;
        }
    }

    if (bucket.length > 0 && bucketStartTime !== null) {
        const open = bucket[0].open;
        const close = bucket[bucket.length - 1].close;
        const high = Math.max(...bucket.map(b => b.high));
        const low = Math.min(...bucket.map(b => b.low));
        aggregates.push({ time: bucketStartTime, open, high, low, close });
    }

    return aggregates;
}

const aggregateDaily = (bars) => {
    const aggregates = [];
    let bucket = [];
    let currentDay = null;

    for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];

        const barDateUTC = new Date(bar.time * 1000);
        const utcHour = barDateUTC.getUTCHours();
        const utcMinute = barDateUTC.getUTCMinutes();

        // Regular NYSE session in UTC (13:30–20:00)
        const inRegularHours =
            (utcHour > 13 && utcHour < 20) ||
            (utcHour === 13 && utcMinute >= 30);

        if (!inRegularHours) continue;

        const barDay = barDateUTC.toISOString().slice(0, 10);

        if (currentDay === null) currentDay = barDay;

        if (currentDay === barDay) {
            bucket.push(bar);
        } else {
            const open = bucket[0].open;
            const close = bucket[bucket.length - 1].close;
            const high = Math.max(...bucket.map(b => b.high));
            const low = Math.min(...bucket.map(b => b.low));

            const date = new Date(currentDay);
            const unixSeconds = Math.floor(date.getTime() / 1000);
            aggregates.push({ time: unixSeconds, open, high, low, close });

            bucket = [bar];
            currentDay = barDay;
        }
    }
    if (bucket.length > 0) {
        const open = bucket[0].open;
        const close = bucket[bucket.length - 1].close;
        const high = Math.max(...bucket.map(b => b.high));
        const low = Math.min(...bucket.map(b => b.low));

        const date = new Date(currentDay);
        const unixSeconds = Math.floor(date.getTime() / 1000);
        aggregates.push({ time: unixSeconds, open, high, low, close });
        bucket = [];
    }

    return aggregates;
};

export { saveBars, aggregateBars, aggregateDaily, prisma };