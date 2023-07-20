import React, { FC } from "react";

interface SQLQueryModalProps {
  sqlQuery: string;
  isModalOpen: boolean;
  onCloseModal: () => void;
  onSqlChange: (event: any) => void;
  onSqlSubmit: () => void;
}

const SQLQueryModal: FC<SQLQueryModalProps> = ({
  sqlQuery,
  isModalOpen,
  onCloseModal,
  onSqlChange,
  onSqlSubmit,
}) => {
  if (!isModalOpen) return null;

  return (
    <>
      <div className="w-[100vw] h-[100vh] bg-black bg-opacity-30 fixed top-0 right-0 left-0 bottom-0 bg-clip-padding backdrop-filter backdrop-blur"></div>
      <div className="z-[9999] w-[100vw] h-[100vh] fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center">
        <div className="bg-white p-6 rounded-[20px] w-[600px]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSqlSubmit();
            }}
          >
            <textarea
              value={sqlQuery}
              onChange={onSqlChange}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  onSqlSubmit();
                }
              }}
              placeholder="Please post SQL"
              className="min-h-[50vh] max-h-[50vh] p-4 w-full h-full rounded-[20px] outline-none"
              autoFocus
            />
            <div className="flex items-center justify-end mt-4">
              <div onClick={onCloseModal} className="cursor-pointer">
                Close
              </div>
              <button type="submit" className="btn ml-6">
                Get Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SQLQueryModal;
