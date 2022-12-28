import create from "zustand";

interface PublicationState {
  publicationContent: string;
  publications: [];
  publicationIsFetched: boolean;
  refetchMethod: () => void;
  setPublications: (publications: []) => void;
  setRefetchPublications: (refetchMethod: () => void) => void;
  setPublicationContent: (publicationContent: string) => void;
  setPublicationIsFetched: (isFetched: boolean) => void;
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
  setPublicationIsFetched: (publicationIsFetched) =>
    set(() => ({ publicationIsFetched })),
  publicationIsFetched: false,
}));
