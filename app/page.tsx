"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import Loading from "@/components/atoms/loading";
import Header from "@/components/header";
import useLogStore, { Log } from "@/components/atoms/log";
import { useWithAuth } from "@/hooks/useWithAuth";
import { useStore } from "@/store";
import { ErrorMessage, SuccessMessage } from "@/components/atoms/toast";
import { UserRole } from "@/types/userRoles";
import DataDownloader from "@/components/atoms/DataDownloader";
import DataFetcher from "@/components/atoms/DataFetcher";
import SQLQueryModal from "@/components/atoms/SQLQueryModal";
import useSQLQueryModal from "@/hooks/useSQLQueryModal";

type Data = Record<string, unknown>;

const TopPage = () => {
  const isLoggedIn = useWithAuth();
  const isReady = useStore((state) => state.isReady);
  const { userRole } = useStore();

  const [data, setData] = useState<Data[] | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [regDate, setRegDate] = useState<string>("");
  const [birthM, setBirthM] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiEndpoint] = useState<string>("/api/sql");
  const [requestUrl, setRequestUrl] = useState<string | null>(null);
  const [queryType, setQueryType] = useState<string>("0");
  const [totalDataCount, setTotalDataCount] = useState<number>(0);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { logs, addLogs, clearLogs: clearLogsFromStore } = useLogStore();

  useEffect(() => {
    console.log("Checking isLoggedIn and isReady...");
    if (isReady && !isLoggedIn) {
      console.log("Redirecting to /login...");
      window.location.href = "/login";
    }
  }, [isLoggedIn, isReady]);

  const {
    isModalOpen,
    sqlQuery,
    handleOpenModal,
    handleCloseModal,
    handleSqlChange,
  } = useSQLQueryModal();

  const addTypedLog = useCallback(() => {
    if (logs.length > 0) {
      const newLogs = [...logs]; // copy the existing logs
      const log = newLogs[0]; // get the first log
      let shouldUpdateLogs = false;
      if (log.typingIndex < log.message.length) {
        // If not all characters have been typed, type the next character
        log.typedLog += log.message[log.typingIndex];
        log.typingIndex += 1;
        log.isVisible = true;
        shouldUpdateLogs = true;
      } else {
        // If all characters have been typed, remove the log from the list
        newLogs.shift();
        shouldUpdateLogs = true;
      }
      if (shouldUpdateLogs) {
        return newLogs;
      }
    }
    return null;
  }, [logs]);

  const addLogWrapper = (message: string) => {
    console.log("Adding log: ", message);
    // Create a new Log object for each new message
    const log: Log = {
      message: message,
      typedLog: "",
      typingIndex: 0,
      isVisible: false,
    };
    addLogs([...logs, log]); // Now, addLog adds a Log object to the state, not a string
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (logs.length > 0) {
        const newLogs = [...logs]; // copy the existing logs
        let isTypingCompleted = true;
        newLogs.forEach((log, index) => {
          if (log.typingIndex < log.message.length) {
            // If not all characters have been typed, type the next character
            log.typedLog += log.message[log.typingIndex];
            log.typingIndex += 1;
            log.isVisible = true;
            isTypingCompleted = false;
          }
        });
        if (!isTypingCompleted) {
          addLogs(newLogs); // update the logs state only once
        }
      }
    }, 10); // Adjust typing speed as needed
    return () => clearInterval(intervalId); // Clear interval when component unmounts or logs update
  }, [logs, addLogs]);

  const fetchData = async (query?: string | Record<string, string>) => {
    setData(null); // 出力結果を初期化
    setLoading(true);
    addLogWrapper("✅　Attempts to acquire data...");

    let url = `${apiEndpoint}?`;

    // 5秒ごとにログにメッセージを出力
    let loadingMessageCount = 0;
    const intervalId = setInterval(() => {
      addLogWrapper(
        "⚡️　フルスピードで取得中です。今しばらくお待ちください..."
      );
      loadingMessageCount++; // <-- Increment the count each time the message is logged
      if (loadingMessageCount > 10) {
        // <-- If the message has been logged more than 5 times...
        addLogWrapper("🔥　VPNを再接続してリロードしてみてください"); // <-- Log an error message
        setErrorMessage("VPNを再接続してリロードしてみてください"); // <-- Set the error message
        clearInterval(intervalId); // <-- Stop logging the loading message
      }
    }, 5000);

    if (typeof query === "string") {
      url += `query=${encodeURIComponent(query)}`;
      addLogWrapper(`✅　Request URL is as follows: ${url}`);
    } else if (typeof query === "object") {
      const params = new URLSearchParams(query).toString();
      url += params;
      addLogWrapper(`✅　Request URL is as follows: ${url}`);
    } else {
      url += `queryType=${queryType}`;
      if (
        queryType === "1" ||
        queryType === "3" ||
        queryType === "4" ||
        queryType === "5" ||
        queryType === "6" ||
        queryType === "7"
      ) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
        addLogWrapper(
          `✅　Request parameter: startDate=${startDate}, endDate=${endDate}`
        );
      } else if (queryType === "2") {
        url += `&regDate=${regDate}&birthM=${birthM}`;
        addLogWrapper(
          `✅　Request parameter: regDate=${regDate}, birthM=${birthM}`
        );
      }
      addLogWrapper(`✅　Request URL is as follows: ${url}`);
    }

    setRequestUrl(url); // <-- Save the request URL

    const startTime = new Date();
    addLogWrapper(`✅　Request start time: ${startTime}`);

    fetch(url)
      .then((response) => {
        clearInterval(intervalId);
        if (!response.ok) {
          addLogWrapper(`🔥　レスポンスエラー: ${response.status}`);
          throw new Error("ネットワークのレスポンスエラーです。");
        }
        return response.json();
      })
      .then((responseData) => {
        addLogWrapper(`✅　Data acquisition succeeded.`);
        if (!Array.isArray(responseData)) {
          addLogWrapper(
            "🔥　APIからのレスポンスが期待通りの形式ではありません。"
          );
          throw new Error(
            "APIからのレスポンスが期待通りの形式ではありません。"
          );
        }
        setTotalDataCount(responseData.length); // <-- Set the total count of data
        setData(responseData.slice(0, 100)); // <-- Save only the first 100 items to the state
        setLoading(false);
        const endTime = new Date();
        addLogWrapper(`✅　Your request is complete!: ${endTime}`);
        // setSuccessMessage("データの取得に成功しました。");
      })
      .catch((error) => {
        clearInterval(intervalId);
        addLogWrapper("🔥　データ取得に問題が発生しました。:" + error);
        setErrorMessage("データ取得に問題が発生しました。");
        if (error instanceof Error) {
          addLogWrapper("🔥　Error message:" + error.stack);
          addLogWrapper("🔥　Error stack:" + error.message);
        }
        setLoading(false);
      });
  };

  const handleSqlSubmit = () => {
    fetchData(sqlQuery);
    handleCloseModal();
  };

  // csv
  const downloadCSV = () => {
    if (!requestUrl) {
      setErrorMessage("まずデータを抽出してください。");
      return;
    }

    addLogWrapper("✅　Download has started.");

    let start = 0;
    const limit = 50000;
    let allData: Data[] = [];

    const downloadChunk = () => {
      let url = `${requestUrl}&start=${start}&limit=${limit}`;

      if (
        queryType === "1" ||
        queryType === "3" ||
        queryType === "4" ||
        queryType === "5" ||
        queryType === "6" ||
        queryType === "7"
      ) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      } else if (queryType === "2") {
        url += `&regDate=${regDate}&birthM=${birthM}`;
      }

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            addLogWrapper("🔥　ネットワークのレスポンスエラーです。");
            throw new Error("ネットワークのレスポンスエラーです。");
          }
          return response.json();
        })
        .then((responseData) => {
          if (!Array.isArray(responseData) || responseData.length === 0) {
            addLogWrapper(
              "🔥　APIからのレスポンスが期待通りの形式ではありません。"
            );
            throw new Error(
              "APIからのレスポンスが期待通りの形式ではありません。"
            );
          }
          allData = allData.concat(responseData);
          if (responseData.length === limit) {
            start += limit;
            downloadChunk();
          } else {
            let csvContent = "data:text/csv;charset=utf-8,";
            const header = Object.keys(allData[0]).join(",");
            csvContent += header + "\n";
            allData.forEach((item) => {
              const row = Object.values(item).join(",");
              csvContent += row + "\n";
            });
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "data.csv");
            document.body.appendChild(link);
            link.click();
            addLogWrapper("✅　Download is completed.");
          }
        })
        .catch((error) => {
          console.error("データ取得に問題が発生しました。:", error);
          setErrorMessage("データ取得に問題が発生しました。");
          setLoading(false);
          addLogWrapper(`🔥　エラーメッセージ: ${error.message}`);
        });
    };

    downloadChunk();
  };

  // Excel
  const downloadExcel = () => {
    if (!requestUrl) {
      setErrorMessage("まずデータを抽出してください。");
      return;
    }

    addLogWrapper("✅　Download has started.");

    let start = 0;
    const limit = 50000;
    let allData: Data[] = [];

    const downloadChunk = () => {
      let url = `${requestUrl}&start=${start}&limit=${limit}`;

      if (
        queryType === "1" ||
        queryType === "3" ||
        queryType === "4" ||
        queryType === "5" ||
        queryType === "6" ||
        queryType === "7"
      ) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      } else if (queryType === "2") {
        url += `&regDate=${regDate}&birthM=${birthM}`;
      }

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            addLogWrapper("🔥　ネットワークのレスポンスエラーです。");
            throw new Error("ネットワークのレスポンスエラーです。");
          }
          return response.json();
        })
        .then((responseData) => {
          if (!Array.isArray(responseData) || responseData.length === 0) {
            addLogWrapper(
              "🔥　APIからのレスポンスが期待通りの形式ではありません。"
            );
            throw new Error(
              "APIからのレスポンスが期待通りの形式ではありません。"
            );
          }
          allData = allData.concat(responseData);
          if (responseData.length === limit) {
            start += limit;
            downloadChunk();
          } else {
            const ws = XLSX.utils.json_to_sheet(allData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            XLSX.writeFile(wb, "data.xlsx");
            addLogWrapper("✅　Download is completed.");
          }
        })
        .catch((error) => {
          console.error("データ取得に問題が発生しました。:", error);
          setErrorMessage("データ取得に問題が発生しました。");
          setLoading(false);
          addLogWrapper(`🔥　エラーメッセージ: ${error.message}`);
        });
    };

    downloadChunk();
  };

  // データをクリアする関数を追加します
  const clearData = () => {
    setData(null);
    setTotalDataCount(0);
    setRequestUrl(null);
    clearLogsFromStore();
    addLogWrapper("✂️　Output results have been cleared.");
  };

  return (
    <>
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {!isLoggedIn && (
        <div className="w-full h-[100vh] flex justify-center items-center">
          <Loading />
        </div>
      )}
      {isLoggedIn && (
        <div>
          <Header />

          <div className="container max-w-7xl mx-auto flex mt-8">
            {/* サイドバー */}
            <div className="w-1/4">
              <DataFetcher
                queryType={queryType}
                userRole={userRole}
                sqlQuery={sqlQuery}
                startDate={startDate}
                endDate={endDate}
                regDate={regDate}
                birthM={birthM}
                onOpenModal={handleOpenModal}
                onClearData={clearData}
                onFetchData={fetchData}
                onSqlChange={handleSqlChange}
                setQueryType={setQueryType}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setRegDate={setRegDate}
                setBirthM={setBirthM}
              />
            </div>

            {/* 内容 */}
            <div className="w-3/4 ml-8">
              {loading ? (
                <div className="bg-white p-8 rounded-[20px] mb-6">
                  <Loading />
                </div>
              ) : (
                <>
                  <DataDownloader
                    data={data}
                    totalDataCount={totalDataCount}
                    onDownloadCSV={downloadCSV}
                    onDownloadExcel={downloadExcel}
                  />
                </>
              )}

              <div className="bg-white rounded-[20px] p-4">
                <div className="text-sm flex items-center">
                  <div className="gg-profile"></div>
                  <div className="ml-4 pb-2">Auto Robot</div>
                </div>
                <div
                  ref={logContainerRef}
                  className="max-h-[200px] overflow-y-auto pl-12 inline-flex flex-col -mt-3"
                >
                  {logs.length === 0 && (
                    <p className="inline-flex text-xs mt-2 bg-[#eef2f5] py-2 px-2.5 rounded-r-[12px] rounded-bl-[12px]">
                      Waiting for data to be extracted...
                    </p>
                  )}
                  {logs.length > 0 &&
                    logs.map(
                      (log, index) =>
                        log.isVisible && (
                          <p
                            key={index}
                            className="inline-block text-xs mt-2 bg-[#eef2f5] py-2 px-2.5 rounded-r-[12px] rounded-bl-[12px]"
                          >
                            {log.typedLog}
                          </p>
                        )
                    )}
                </div>
              </div>
            </div>

            {isModalOpen && (
              <SQLQueryModal
                sqlQuery={sqlQuery}
                isModalOpen={isModalOpen}
                onCloseModal={handleCloseModal}
                onSqlChange={handleSqlChange}
                onSqlSubmit={handleSqlSubmit}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TopPage;
