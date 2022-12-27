import { gql } from "@apollo/client";

export const ExploreProfiles = gql`
  query ExploreProfiles($request: ExploreProfilesRequest!) {
    exploreProfiles(request: $request) {
      items {
        id
        name
        bio
        handle
        picture {
          ... on MediaSet {
            original {
              url
            }
          }
        }
        stats {
          totalFollowers
        }
      }
    }
  }
`;
