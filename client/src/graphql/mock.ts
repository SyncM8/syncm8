import { makeUniqueId } from "@apollo/client/utilities";

import { Family, Mate, Sync, User } from "./types";

// Need __typename for testing to work with Fragments
type Typename = {
  __typename: string;
};

export const sync1: Sync & Typename = {
  __typename: "Sync",
  id: makeUniqueId(""),
  timestamp: "2021-12-28T12:32:12Z",
  title: "sync title",
  details: "sync detail blah blah",
};

export const sync2: Sync & Typename = {
  __typename: "Sync",
  id: makeUniqueId(""),
  timestamp: "2021-12-25T11:34:01Z",
  title: "sync title 2",
  details: "sync detail blah blah",
};

export const sync3: Sync & Typename = {
  __typename: "Sync",
  id: makeUniqueId(""),
  timestamp: "2021-12-12T01:23:55Z",
  title: "sync title 3",
  details: "sync detail blah blah",
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

export const mate3NoSync: Mate & Typename = {
  __typename: "Mate",
  id: makeUniqueId(""),
  name: "mate3 no sync",
  syncs: [],
};

export const familyEmptyMates: Family & Typename = {
  __typename: "Family",
  id: makeUniqueId(""),
  mates: [],
  name: "Family no mates",
  sync_interval_days: 100,
};

export const familyOneMate: Family & Typename = {
  __typename: "Family",
  id: makeUniqueId(""),
  mates: [mate3NoSync],
  name: "Family with one mate",
  sync_interval_days: 123,
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
  families: [familyTwoMates, familyOneMate],
};
