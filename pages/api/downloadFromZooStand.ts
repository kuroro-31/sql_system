import { NextApiRequest, NextApiResponse } from "next";
import { WorkBook, utils, write } from "xlsx";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Received request:", req.body); // <-- Log the incoming request

    // データを取得する（ここではダミーデータを使用）
    const data = req.body.data;

    if (!data) {
      throw new Error("No data provided in the request body.");
    }

    console.log("Data to be converted to Excel:", data); // <-- Log the data

    // データからワークシートを作成
    console.log("Creating worksheet from data..."); // <-- Log the operation
    const ws = utils.json_to_sheet(data);

    // ワークシートからワークブックを作成
    console.log("Creating workbook from worksheet..."); // <-- Log the operation
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");

    // ワークブックをバッファに書き出す
    console.log("Writing workbook to buffer..."); // <-- Log the operation
    const wbbuf = write(wb, { type: "buffer" });

    // レスポンスヘッダーを設定
    console.log("Setting response headers..."); // <-- Log the operation
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");

    // レスポンスとしてバッファを送信
    console.log("Sending response..."); // <-- Log the operation
    res.send(wbbuf);
  } catch (err) {
    console.error("Error occurred:", err); // <-- Log the error

    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
}
