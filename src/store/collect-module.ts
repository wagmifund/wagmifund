// import { DEFAULT_COLLECT_TOKEN } from "utils/constants";
import { CollectModules } from "../../generated";
import create from "zustand";

interface CollectModuleState {
  selectedCollectModule: CollectModules;
  setSelectedCollectModule: (selectedModule: CollectModules) => void;
  amount: null | string;
  setAmount: (amount: null | string) => void;
  selectedCurrency: null | string;
  setSelectedCurrency: (selectedCurrency: null | string) => void;
  payload: any;
  setPayload: (payload: any) => void;
  reset: () => void;
}

export const useCollectModuleStore = create<CollectModuleState>((set) => ({
  selectedCollectModule: CollectModules.FreeCollectModule,
  setSelectedCollectModule: (selectedCollectModule) =>
    set(() => ({ selectedCollectModule })),
  amount: null,
  setAmount: (amount) => set(() => ({ amount })),
  //currently DEFAULT_COLLECT_TOKEN => TESTNET_DEFAULT_TOKEN
  selectedCurrency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  setSelectedCurrency: (selectedCurrency) => set(() => ({ selectedCurrency })),
  payload: { freeCollectModule: { followerOnly: false } },
  setPayload: (payload) => set(() => ({ payload })),
  reset: () =>
    set(() => ({
      selectedCollectModule: CollectModules.FreeCollectModule,
      amount: null,
      selectedCurrency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      payload: { freeCollectModule: { followerOnly: false } },
    })),
}));
