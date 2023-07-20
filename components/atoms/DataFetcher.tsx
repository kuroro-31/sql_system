import React from "react";

import { UserRole } from "@/types/userRoles";

interface DataFetcherProps {
  queryType: string;
  userRole: UserRole | null; // Update this line
  sqlQuery: string;
  startDate: string;
  endDate: string;
  regDate: string;
  birthM: string;
  onOpenModal: () => void;
  onClearData: () => void;
  onFetchData: (query?: string | Record<string, string>) => void;
  onSqlChange: (event: any) => void;
  setQueryType: (value: string) => void;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  setRegDate: (value: string) => void;
  setBirthM: (value: string) => void;
}

const DataFetcher: React.FC<DataFetcherProps> = ({
  queryType,
  userRole,
  sqlQuery,
  startDate,
  endDate,
  regDate,
  birthM,
  onOpenModal,
  onClearData,
  onFetchData,
  onSqlChange,
  setQueryType,
  setStartDate,
  setEndDate,
  setRegDate,
  setBirthM,
}) => {
  return (
    <div className="bg-white p-6 rounded-[20px]">
      <div>
        <div className="text-lg mb-4">Select a case</div>
        <select
          className="w-full"
          value={queryType}
          onChange={(e) => setQueryType(e.target.value)}
        >
          <option value="0">案件を選択してください</option>

          {/* EC運用チーム */}
          {(userRole === UserRole.SYSTEM ||
            userRole === UserRole.PRODUCT_PROMOTION) && (
            <>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="6">6 </option>
              <option value="7">7 </option>
            </>
          )}

          {(userRole === UserRole.SYSTEM ||
            userRole === UserRole.BUSINESS_SUCCESS) && (
            <>
              <option value="4">4</option>
              <option value="5">5</option>
            </>
          )}
        </select>

        {queryType === "0" && userRole === UserRole.SYSTEM && (
          <>
            <div className="text-xs text-center text-gray my-4">or</div>
            <button onClick={onOpenModal} className="btn-border w-full">
              Extract by SQL
            </button>
          </>
        )}
      </div>

      {/* 条件 */}
      <div className="mt-4">
        {(queryType === "1" ||
          queryType === "3" ||
          queryType === "4" ||
          queryType === "5" ||
          queryType === "6" ||
          queryType === "7") && (
          <>
            <div className="flex items-center mb-4">
              <p className="w-2/5 text-xs">Start Date</p>
              <label className="w-3/5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full"
                />
              </label>
            </div>
            <div className="flex items-center">
              <p className="w-2/5 text-xs">End Date</p>
              <label className="w-3/5">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full"
                />
              </label>
            </div>
          </>
        )}

        {queryType === "2" && (
          <>
            <div className="flex items-center mb-4">
              <p className="w-2/5">Join date</p>
              <label className="w-3/5">
                <input
                  type="date"
                  value={regDate}
                  onChange={(e) => setRegDate(e.target.value)}
                  required
                  className="w-full"
                />
              </label>
            </div>
            <div className="flex items-center">
              <p className="w-2/5">Birthday</p>
              <select
                className="w-3/5"
                value={birthM}
                onChange={(e) => setBirthM(e.target.value)}
                required
              >
                <option value="">選択してください</option>
                <option value="01">1月</option>
                <option value="02">2月</option>
                <option value="03">3月</option>
                <option value="04">4月</option>
                <option value="05">5月</option>
                <option value="06">6月</option>
                <option value="07">7月</option>
                <option value="08">8月</option>
                <option value="09">9月</option>
                <option value="10">10月</option>
                <option value="11">11月</option>
                <option value="12">12月</option>
              </select>
            </div>
          </>
        )}
      </div>

      {queryType !== "0" && (
        <div className="mt-4">
          <button onClick={() => onFetchData()} className="btn w-full">
            Get Data
          </button>
          <button onClick={onClearData} className="text-xs w-full mt-4">
            Clear output results
          </button>
        </div>
      )}

      {queryType !== "0" && userRole === UserRole.SYSTEM && (
        <>
          <div className="text-xs text-center text-[#959EA7] my-4">or</div>
          <button onClick={onOpenModal} className="btn-border w-full">
            Extract by SQL
          </button>
        </>
      )}
    </div>
  );
};

export default DataFetcher;
