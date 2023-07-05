import * as postgres from "postgres";
import { SweepstakesObj } from "./types.ts";

export async function insertSweepstakes(
  pool: postgres.Pool,
  pubkey: string,
  sweepstakes: SweepstakesObj
) {
  const connection = await pool.connect();
  try {
    await connection.queryObject`INSERT INTO sweepstakes(pubkey, sweepstakes, expiration) VALUES (${pubkey}, ${sweepstakes}, ${sweepstakes.expiration})`;
  } finally {
    connection.release();
  }
}

export async function lookupSweepstakes(
  pool: postgres.Pool,
  pubkey: string
): Promise<SweepstakesObj[]> {
  const connection = await pool.connect();
  try {
    const result =
      await connection.queryObject`SELECT * FROM sweepstakes WHERE pubkey = ${pubkey}`;
    return result.rows as SweepstakesObj[];
  } finally {
    connection.release();
  }
}
