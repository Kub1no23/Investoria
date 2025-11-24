/*
  Warnings:

  - Changed the type of `timestamp` on the `OHLC` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OHLC" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "OHLC_symbol_timeframe_timestamp_idx" ON "OHLC"("symbol", "timeframe", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OHLC_symbol_timeframe_timestamp_key" ON "OHLC"("symbol", "timeframe", "timestamp");
