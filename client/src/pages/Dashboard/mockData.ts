/* eslint-disable no-plusplus */

import { UpcomingSyncType } from "../types";

let id = 0;
export const today = new Date(2021, 9, 15); // month is 0-index, equivalent to "2021-10-15"
export const name = "Paul";
export const initialSyncs: UpcomingSyncType[] = [
  {
    id: id++,
    name: "Peter",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 1),
  },
  {
    id: id++,
    name: "Andrew",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 4),
  },
  {
    id: id++,
    name: "James",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 5),
  },
  {
    id: id++,
    name: "John",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 8),
  },
  {
    id: id++,
    name: "Bartholomew",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 10),
  },
  {
    id: id++,
    name: "Matthew",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 16),
  },
  {
    id: id++,
    name: "Thomas",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 18),
  },
  {
    id: id++,
    name: "Simon",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 20),
  },
  {
    id: id++,
    name: "Judas",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 20),
  },
  {
    id: id++,
    name: "Philip",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 17),
  },
];
