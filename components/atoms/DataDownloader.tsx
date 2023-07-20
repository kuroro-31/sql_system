import React from "react";

interface DataDownloaderProps {
  data: any; // replace with the type of your data
  totalDataCount: any;
  onDownloadCSV: () => void;
  onDownloadExcel: () => void;
}

const DataDownloader: React.FC<DataDownloaderProps> = ({
  data,
  totalDataCount,
  onDownloadCSV,
  onDownloadExcel,
}) => {
  return (
    data && (
      <div className=" bg-white rounded-[20px] p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="">
            <div className="text-xl">Results</div>
            <div className="mt-1 text-[#959EA7]">{totalDataCount} cases</div>
          </div>
        </div>

        <div className="min-h-[0px] max-h-[300px] overflow-auto relative">
          {data && data.length > 0 && (
            <table className="table-auto">
              <thead className="sticky top-0 bg-white">
                <tr>
                  {Object.keys(data[0]).map((key, index) => (
                    <th
                      key={index}
                      className="bg-[#eef2f5] border border-[#eef2f5] text-[0.8rem] py-[7.68px] px-[12.8px]"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(
                  (
                    item: { [s: string]: unknown } | ArrayLike<unknown>,
                    index: React.Key | null | undefined
                  ) => (
                    <tr key={index}>
                      {Object.values(item).map((value, i) => (
                        <td
                          key={i}
                          className="p-[10px] text-xs border border-[#eef2f5]"
                        >
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-end mt-8">
          <button
            onClick={onDownloadCSV}
            className="btn-border whitespace-nowrap ml-4"
          >
            Download CSV
          </button>
          <button
            onClick={onDownloadExcel}
            className="btn whitespace-nowrap ml-4"
          >
            Download Excel
          </button>
        </div>
      </div>
    )
  );
};

export default DataDownloader;
