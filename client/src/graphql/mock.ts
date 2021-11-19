import { makeUniqueId } from "@apollo/client/utilities";

import { Family, Mate, User } from "./types";

// Need __typename for testing to work with Fragments
type Typename = {
  __typename: string;
};

export const mateNoSync: Mate & Typename = {
  __typename: "Mate",
  id: makeUniqueId(""),
  name: "mate no sync",
  syncs: [],
};

export const mate2NoSync: Mate & Typename = {
  __typename: "Mate",
  id: makeUniqueId(""),
  name: "mate2 no sync",
  syncs: [],
};

export const familyEmptyMates: Family & Typename = {
  __typename: "Family",
  id: makeUniqueId(""),
  mates: [],
  name: "Family no mates",
  sync_interval_days: 100,
};

export const familyTwoMates: Family & Typename = {
  __typename: "Family",
  id: makeUniqueId(""),
  mates: [mateNoSync, mate2NoSync],
  name: "Family with two mates",
  sync_interval_days: 123,
};

export const userNoUnassignedMates: User & Typename = {
  __typename: "User",
  id: makeUniqueId(""),
  first_name: "Billy",
  email: "billy@aws.com",
  unassigned_family: familyEmptyMates,
  families: [familyEmptyMates, familyTwoMates],
};

export const userTwoUnassignedMates: User & Typename = {
  __typename: "User",
  id: makeUniqueId(""),
  first_name: "Billy",
  email: "billy@aws.com",
  unassigned_family: familyTwoMates,
  families: [familyTwoMates, familyEmptyMates],
};
