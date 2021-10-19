import { NewMateType } from "../types";

const philosophers = [
  "Thales",
  "Democritus",
  "Empedokles",
  "Pythagoras",
  "Socrates",
  "Plato",
  "Aristotle",
  "Diogenes",
  "Anaxagoras",
  "Euclides",
  "Antisthenes",
  "Epicurus",
  "Zeno of Citium",
];
const initialMates = philosophers.map(
  (name, index) =>
    ({
      name,
      lastSynced: new Date(),
      id: `mate-id-${index}`,
    } as NewMateType)
);
export const families = ["school", "work", "life", "college", "concert"];
export const initialGroup: Record<string, NewMateType[]> = families.reduce(
  (object, family) => ({
    ...object,
    [family]: [],
  }),
  { unassigned: initialMates }
);
