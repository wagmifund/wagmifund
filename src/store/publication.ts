import create from "zustand";

interface PublicationState {
  publicationContent: string;
  publications: [];
  setPublications: (publications: []) => void;
  setPublicationContent: (publicationContent: string) => void;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  publicationContent: "",
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  publications: [],
  setPublications: (publications) => set(() => ({ publications })),
}));
