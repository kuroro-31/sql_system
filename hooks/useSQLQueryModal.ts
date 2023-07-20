// hooks/useSQLQueryModal.ts
import { useState } from "react";

const useSQLQueryModal = (initialQuery = "") => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sqlQuery, setSqlQuery] = useState(initialQuery);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSqlChange = (event: any) => {
    setSqlQuery(event.target.value);
  };

  return {
    isModalOpen,
    sqlQuery,
    handleOpenModal,
    handleCloseModal,
    handleSqlChange,
  };
};

export default useSQLQueryModal;
