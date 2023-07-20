import db from "@/lib/db";
import * as sqlQueryGenerators from "@/utils";
import type { SqlQueryGenerator } from "@/utils";

import { NextApiRequest, NextApiResponse } from "next";

// sqlQueryGeneratorsの型を明示的に定義
type SqlQueryGenerators = {
  [key: string]: SqlQueryGenerator;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const startDate = Array.isArray(req.query.startDate)
    ? req.query.startDate[0]
    : req.query.startDate || "";
  const endDate = Array.isArray(req.query.endDate)
    ? req.query.endDate[0]
    : req.query.endDate || "";
  const regDate = Array.isArray(req.query.regDate)
    ? req.query.regDate[0]
    : req.query.regDate || "";
  const birthM = Array.isArray(req.query.birthM)
    ? req.query.birthM[0]
    : req.query.birthM || "";
  const queryType = Array.isArray(req.query.queryType)
    ? req.query.queryType[0]
    : req.query.queryType || "1";
  const query = Array.isArray(req.query.query)
    ? req.query.query[0]
    : req.query.query || "";

  try {
    let sqlQuery;
    if (query) {
      sqlQuery = query;
    } else {
      const generateSqlQuery = (sqlQueryGenerators as SqlQueryGenerators)[
        `generateSqlQuery${queryType}`
      ];
      if (!generateSqlQuery) {
        throw new Error("Invalid query type");
      }
      sqlQuery =
        queryType === "2"
          ? generateSqlQuery(regDate, birthM)
          : generateSqlQuery(startDate, endDate); // SQLクエリを生成
    }
    console.log("Generated SQL query:", sqlQuery); // <-- Log the generated SQL query
    console.log("Executing SQL query..."); // <-- Log before executing the query
    const users = await db.any(sqlQuery); // 生成したSQLクエリを使用
    console.log("Database response:", users); // <-- Log the database response
    res.status(200).json(users);
  } catch (err) {
    console.error("Error occurred:", err); // <-- Log the error
    if (err instanceof Error) {
      console.error("Error stack:", err.stack); // <-- Log the error stack
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: err });
    }
  }
}
