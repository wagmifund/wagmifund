import type { Profile } from "generated";

import getAttribute from "./getAttribute";

/**
 *
 * @param profile - Profile object
 * @returns gradient attribute
 */
const wantsGradient = (profile: Profile): boolean =>
  getAttribute(profile?.attributes, "gradient") === "true";

export default wantsGradient
;
