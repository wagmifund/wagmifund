export const getCollectModuleConfig = (collectModule: string) => {
  switch (collectModule) {
    case "FeeCollectModule":
      return {
        type: "collectModule",
        description:
          "Allow you to collect any publication by paying fees specified.",
      };

    default:
      return {
        type: "",
        description: "",
      };
  }
};
