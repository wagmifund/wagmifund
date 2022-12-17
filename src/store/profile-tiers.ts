import create from 'zustand';

interface ProfileTierState {
  mediaTierFilters: Record<string, boolean>;
  setMediaTierFilters: (feedEventFilters: Record<string, boolean>) => void;
}

export const useProfileTierStore = create<ProfileTierState>((set) => ({
  mediaTierFilters: { images: true, video: true, audio: true },
  setMediaTierFilters: (mediaTierFilters) => set(() => ({ mediaTierFilters }))
}));
