import create from "zustand";

interface PublicationState {
  publicationContent: string;
  setPublicationContent: (publicationContent: string) => void;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  publicationContent: "",
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
}));
