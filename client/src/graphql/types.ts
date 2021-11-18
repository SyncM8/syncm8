/* GraphQL related types to typescript */

/**
 * Input type for addNewMates
 */
export type NewMatesInput = {
  name: string;
  lastSynced: Date;
};

export type Sync = {
  id: string;
  timestamp: string;
  title: string;
  details: string;
};

/**
 * GQL Typescript type for Mate
 */
export type Mate = {
  id: string;
  name: string;
  // sync_ids: [string];
  syncs: Sync[];
};

export type Family = {
  id: string;
  sync_interval_days: number;
  name: string;
  mates: Mate[];
};

export type User = {
  id: string;
  first_name: string;
  picture_url?: string;
  email: string;
  unassigned_family: Family;
  families: Family[];
};
