import create from "zustand";

export interface ProfileUIState {
  cardView?: "stack" | "card";
  theme?: string;
  corners?: string;
}

interface ProfileState {
  profileUIData: ProfileUIState;
  setProfileUIData: (profileUIData: ProfileUIState) => void;
}

export const useProfileUIStore = create<ProfileState>((set) => ({
  profileUIData: { cardView: "card", theme: "", corners: "0.9" },
  setProfileUIData: (profileUIData: Partial<ProfileUIState>) =>
    set((currentState) => ({ ...currentState, profileUIData })),
}));
