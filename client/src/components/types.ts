import { Moment } from "moment";

export type AddMateFormType = {
  name: string;
  lastSeen: Moment;
};

export type AddMateType = {
  name: string;
  lastSynced: Date;
  ts: number;
};
