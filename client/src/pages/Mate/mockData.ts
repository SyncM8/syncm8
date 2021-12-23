/* eslint-disable no-plusplus */
import { SyncStatusEnum, SyncType } from "../types";

let id = 0;
export const mateName = "Clare Carlisle";
export const initialSyncs: SyncType[] = [
  {
    id: id++,
    ts: new Date("2021-09-01"),
    title: "Dinner at Chipotle",
    details: "Got a chicken bowl with guacs. Talked about K.",
    syncStatus: SyncStatusEnum.COMPLETED,
  },
  {
    id: id++,
    ts: new Date("2021-04-09"),
    title: "Coffee at Starbucks",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    syncStatus: SyncStatusEnum.COMPLETED,
  },
  {
    id: id++,
    ts: new Date("2021-06-19"),
    title: "Snoozed One",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    syncStatus: SyncStatusEnum.SNOOZED,
  },
  {
    id: id++,
    ts: new Date("2021-07-15"),
    title: "Busy with Work",
    details: "",
    syncStatus: SyncStatusEnum.DECLINED,
  },
  {
    id: id++,
    ts: new Date("2021-07-21"),
    title: "Hiking at Stone Mountain",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    syncStatus: SyncStatusEnum.COMPLETED,
  },
  {
    id: id++,
    ts: new Date("2021-08-31"),
    title: "Flaky?",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    syncStatus: SyncStatusEnum.DECLINED,
  },
];

export const newSync = {
  id: id++,
  ts: new Date(),
  title: "New Title",
  details: "Details here...",
  syncStatus: SyncStatusEnum.DECLINED,
};
