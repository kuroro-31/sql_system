import "../styles/globals.scss";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500"],
  preload: false,
});

export const metadata = {
  title: "Data Extraction Systems",
  description:
    "データ抽出システムです。会員・売上などDBに保存しているデータを抽出することができます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
