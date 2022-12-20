import create from "zustand";

export interface ProfileUIState {
  cardView?: "stack" | "card";
  theme?: Object;
  corners?: string;
  snow?: boolean;
  gradient?: boolean;
}

interface ProfileState {
  profileUIData: ProfileUIState;
  setProfileUIData: (profileUIData: ProfileUIState) => void;
}

export const useProfileUIStore = create<ProfileState>((set, get) => ({
  profileUIData: {
    cardView: "card",
    theme: {
      h: "198",
      s: "0.94",
      l: "0.43",
    },
    corners: "0.9",
    snow: true,
    gradient: true,
  },
  setProfileUIData: (profileUIData: Partial<ProfileUIState>) => {
    set((currentState) => ({
      ...currentState,
      profileUIData: { ...get().profileUIData, ...profileUIData },
    }));
    console.log({ ...get(), ...profileUIData });
  },
}));
