import { WF_KEYS } from "@utils/constants";
import create from "zustand";
import { persist } from "zustand/middleware";

interface TransactionPersistState {
  txnQueue: any[];
  setTxnQueue: (txnQueue: any[]) => void;
}

export const useTransactionPersistStore = create(
  persist<TransactionPersistState>(
    (set) => ({
      txnQueue: [],
      setTxnQueue: (txnQueue) => set(() => ({ txnQueue })),
    }),
    { name: WF_KEYS.TRANSACTION_STORE }
  )
);
