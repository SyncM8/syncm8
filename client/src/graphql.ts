// TS version of schema.graphql (also keep in sync with graphql.py)
import { gql } from "@apollo/client";

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

/**
 * Input type for addNewMates
 */
export type NewMatesInput = {
  name: string;
  lastSynced: Date;
};

/**
 * GQL Typescript type for Mate
 */
export type Mate = {
  id: string;
  name: string;
  sync_ids: [string];
};
