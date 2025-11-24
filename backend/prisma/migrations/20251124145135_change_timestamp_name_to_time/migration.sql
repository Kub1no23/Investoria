/*
  Warnings:

  - You are about to drop the column `timestamp` on the `OHLC` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[symbol,timeframe,time]` on the table `OHLC` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `time` to the `OHLC` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."OHLC_symbol_timeframe_timestamp_idx";

-- DropIndex
DROP INDEX "public"."OHLC_symbol_timeframe_timestamp_key";

-- AlterTable
ALTER TABLE "OHLC" DROP COLUMN "timestamp",
ADD COLUMN     "time" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "OHLC_symbol_timeframe_time_idx" ON "OHLC"("symbol", "timeframe", "time");

-- CreateIndex
CREATE UNIQUE INDEX "OHLC_symbol_timeframe_time_key" ON "OHLC"("symbol", "timeframe", "time");
