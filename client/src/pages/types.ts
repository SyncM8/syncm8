import { Moment } from "moment";

export type NewMatesFormType = {
  name: string;
  lastSeen: Moment;
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
