/* GraphQL related types to typescript */

/**
 * Input type for addNewMates
 */
export type NewMatesInput = {
  name: string;
  lastSynced: Date;
};

/**
 * Input type for assignMatesToFamilies
 */
export type NewAssignmentInput = {
  familyId: string;
  mateIds: string[];
};

/**
 * GQL type for Sync
 */
export type Sync = {
  id: string;
  timestamp: string;
  title: string;
  details: string;
};

/**
 * GQL type for Mate
 */
export type Mate = {
  id: string;
  name: string;
  syncs: Sync[];
};

/**
 * GQL type for Family
 */
export type Family = {
  id: string;
  sync_interval_days: number;
  name: string;
  mates: Mate[];
};

/**
 * GQL type for User
 */
export type User = {
  id: string;
  first_name: string;
  picture_url?: string;
  email: string;
  unassigned_family: Family;
  families: Family[];
};
