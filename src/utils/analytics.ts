import mixpanel from "mixpanel-browser";

const Analytics = {
  trackerInit: () =>
    mixpanel.init("fd8bf8f084616b43fcd1633dfbc4ada4", { debug: false }),
  track: (event: string, attributes?: Object) =>
    mixpanel.track(event, attributes),
};

export default Analytics;
