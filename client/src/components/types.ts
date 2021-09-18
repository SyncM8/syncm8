import { Moment } from "moment";

export type NewMatesFormType = {
  name: string;
  lastSeen: Moment;
};

export type NewMateType = {
  name: string;
  lastSynced: Date;
  id: number;
};
