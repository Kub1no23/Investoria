import { Router } from "express";
import { prisma } from "../../utils/prisma";

const router = Router();

router.get("/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const { timeframe } = req.query;
    if (!timeframe || typeof timeframe !== "string") {
        return res.status(400).json({ error: "Symbol parameter is required" });
    }
    try {
        const ohlcData = await prisma.oHLC.findMany({
            where: {
                symbol,
                timeframe
            },
            select: {
                time: true,
                open: true,
                high: true,
                low: true,
                close: true,
            }
        });
        const serializedData = ohlcData.map(ohlc => ({
            ...ohlc,
            time: ohlc.time.toString()
        }));
        res.status(200).json(serializedData);
    } catch (error) {
        console.error("Error fetching OHLC data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;