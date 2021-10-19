import { NewMateType } from "../types";

export const family = "College";
export const syncs: NewMateType[] = [
  {
    name: "George Washington",
    lastSynced: new Date("2021-09-01"),
    id: 1,
  },
  {
    name: "John Adams",
    lastSynced: new Date("2021-08-29"),
    id: 2,
  },
  {
    name: "Thomas Jefferson",
    lastSynced: new Date("2021-08-13"),
    id: 3,
  },
  {
    name: "James Madison",
    lastSynced: new Date("2021-08-13"),
    id: 4,
  },
  {
    name: "John Adams",
    lastSynced: new Date("2021-09-13"),
    id: 5,
  },
  {
    name: "James Madison",
    lastSynced: new Date("2021-06-09"),
    id: 6,
  },
  {
    name: "John Quincy Adams",
    lastSynced: new Date("2021-07-13"),
    id: 7,
  },
  {
    name: "James Madison",
    lastSynced: new Date("2021-09-11"),
    id: 8,
  },
  {
    name: "John Quincy Adams",
    lastSynced: new Date("2021-04-12"),
    id: 9,
  },
  {
    name: "Andrew Jackson ",
    lastSynced: new Date("2021-04-22"),
    id: 10,
  },
  {
    name: "Martin Van Buren ",
    lastSynced: new Date("2021-04-22"),
    id: 11,
  },
];

export const matesObj = syncs.reduce(
  (prevObj: Record<string, NewMateType>, sync) => {
    if (
      !(sync.name in prevObj) ||
      prevObj[sync.name].lastSynced > sync.lastSynced
    ) {
      return { ...prevObj, [sync.name]: sync };
    }
    return prevObj;
  },
  {}
);
