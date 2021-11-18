// TS version of schema.graphql (also keep in sync with graphql.py)
import { gql } from "@apollo/client";

import { Mate } from "./types";

const SYNC_FIELDS = gql`
  fragment syncFields on Sync {
    id
    timestamp
    title
    details
  }
`;

const MATE_FIELDS = gql`
  fragment mateFields on Mate {
    id
    name
    syncs @include(if: $withSync) {
      ...syncFields
    }
  }
`;

const FAMILY_FIELDS = gql`
  fragment familyFields on Family {
    id
    sync_interval_days
    name
    mates @include(if: $withMate) {
      ...mateFields
    }
  }
`;

const USER_FIELDS = gql`
  fragment userFields on User {
    id
    first_name
    picture_url
    email
    unassigned_family @include(if: $withUnassignedFamily) {
      ...familyFields
    }
    families @include(if: $withFamily) {
      ...familyFields
    }
  }
`;

export const GET_USER_DATA = gql`
  query getUserDataFn(
    $withFamily: Boolean = false
    $withMate: Boolean = false
    $withSync: Boolean = false
    $withUnassignedFamily: Boolean = false
  ) {
    getUserData {
      ...userFields
    }
  }
  ${USER_FIELDS}
  ${FAMILY_FIELDS}
  ${MATE_FIELDS}
  ${SYNC_FIELDS}
`;

export const GET_UNASSIGNED_DATA = gql`
  query getUnassignedDataFn($withSync: Boolean = true) {
    getUserData {
      unassigned_family {
        id
        mates {
          ...mateFields
        }
      }
      families {
        id
        sync_interval_days
        name
      }
    }
  }
  ${MATE_FIELDS}
  ${SYNC_FIELDS}
`;

export type NewAssignmentInput = {
  familyId: string;
  mateIds: string[];
};

export const ASSIGN_MATES_TO_FAMILIES = gql`
  mutation assignMatesToFamiliesFn(
    $newAssignments: [NewAssignmentInput]!
    $withSync: Boolean = false
  ) {
    assignMatesToFamilies(newAssignments: $newAssignments) {
      unassigned_family {
        id
        mates {
          ...mateFields
        }
      }
      families {
        id
        mates {
          ...mateFields
        }
      }
    }
  }
  ${MATE_FIELDS}
  ${SYNC_FIELDS}
`;

export type GetMatesReturn = Pick<Mate, "id" | "name" | "syncs">;

/**
 * GQL for adding new mates
 */
export const ADD_NEW_MATES = gql`
  mutation addMatesFn($newMates: [NewMatesInput]!) {
    addNewMates(mates: $newMates) {
      id
      name
    }
  }
`;

/**
 * Return type of addNewMates
 */
export type AddNewMatesReturn = Pick<Mate, "id" | "name">;
