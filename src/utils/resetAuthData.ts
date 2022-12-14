import { WF_KEYS } from "./constants";

const resetAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem(WF_KEYS.WAGMI_FUND_STORE);
  localStorage.removeItem(WF_KEYS.TRANSACTION_STORE);
  localStorage.removeItem(WF_KEYS.TIMELINE_STORE);
  localStorage.removeItem(WF_KEYS.MESSAGE_STORE);
};

export default resetAuthData;
