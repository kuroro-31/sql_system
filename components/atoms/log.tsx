import create from "zustand";

type Log = {
  message: string;
  typedLog: string;
  typingIndex: number;
  isVisible: boolean;
};

type LogStore = {
  logs: Log[];
  addLog: (log: Log) => void;
  addLogs: (newLogs: Log[]) => void;
  clearLogs: () => void;
};

const useLogStore = create<LogStore>((set) => ({
  logs: [],
  addLog: (log: Log) =>
    set((state) => ({
      logs: [...state.logs, log],
    })),
  addLogs: (newLogs: Log[]) =>
    set(() => ({
      logs: newLogs,
    })),
  clearLogs: () => set(() => ({ logs: [] })),
}));

export default useLogStore;
export type { Log };
