import mixpanel from "mixpanel-browser";

const Analytics = {
  trackerInit: () =>
    mixpanel.init("fd8bf8f084616b43fcd1633dfbc4ada4", { debug: false }),
  track: (event: string) => mixpanel.track(event),
};

export default Analytics;
