import { Moment } from "moment";

import { Mate } from "../graphql/types";

export type NewMatesFormType = {
  name: string;
  lastSeen: Moment;
};

export type UnassignedMate = Mate & {
  lastSynced?: Date;
};

export type NewMateType = {
  name: string;
  lastSynced: Date;
  id: number | string;
};

export enum SyncStatusEnum {
  COMPLETED = "Completed",
  SNOOZED = "Snoozed",
  DECLINED = "Declined",
}

export type SyncType = {
  id: number;
  ts: Date;
  title: string;
  details: string;
  syncStatus: SyncStatusEnum;
};

export type UpcomingSyncType = {
  id: number;
  name: string;
  family: string;
  lastSynced: Date;
  upcomingSync: Date;
};

export type LocationState = {
  prevPath: string;
};
