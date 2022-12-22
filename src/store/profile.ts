import create from "zustand";

export interface ProfileUIState {
  cardView?: "stack" | "card";
  theme?: {
    h: string;
    s: string;
    l: string;
  };
  corners?: string;
  snow?: boolean;
  gradient?: string;
  about?: string;
}

interface ProfileState {
  profileUIData: ProfileUIState;
  setProfileUIData: (profileUIData: ProfileUIState) => void;
  showUISettings: boolean;
  setUISettings: (showUISettings: boolean) => void;
}

export const useProfileUIStore = create<ProfileState>((set, get) => ({
  profileUIData: {
    cardView: "card",
    theme: {
      h: "198",
      s: "0.94",
      l: "0.43",
    },
    about: "",
    corners: "0.9",
    snow: true,
    gradient: "true",
  },
  showUISettings: false,
  setUISettings: (showUISettings) => set(() => ({ showUISettings })),
  setProfileUIData: (profileUIData: Partial<ProfileUIState>) => {
    set((currentState) => ({
      ...currentState,
      profileUIData: { ...currentState.profileUIData, ...profileUIData },
    }));
    console.log({
      ...get(),
      profileUIData: { ...get().profileUIData, ...profileUIData },
    });
  },
}));
