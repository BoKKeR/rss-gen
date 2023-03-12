import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import { customAlphabet } from "nanoid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const nanoid = customAlphabet("1234567890abcdefABCDEF", 8);
  const uuid = nanoid();
  res.status(200).send(uuid);
}
