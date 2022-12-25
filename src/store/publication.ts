import create from "zustand";

interface PublicationState {
  publicationContent: string;
  publications: [];
  refetchMethod: () => void;
  setPublications: (publications: []) => void;
  setRefetchPublications: (refetchMethod: () => void) => void;
  setPublicationContent: (publicationContent: string) => void;
}

export const usePublicationStore = create<PublicationState>((set) => ({
  publicationContent: "",
  setPublicationContent: (publicationContent) =>
    set(() => ({ publicationContent })),
  publications: [],
  refetchMethod: () => {},
  setRefetchPublications: (refetchMethod) =>
    set(() => ({
      refetchMethod,
    })),
  setPublications: (publications) => set(() => ({ publications })),
}));
