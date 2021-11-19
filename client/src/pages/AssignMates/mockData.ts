import {
  ASSIGN_MATES_TO_FAMILIES,
  GET_UNASSIGNED_DATA,
} from "../../graphql/graphql";
import {
  userNoUnassignedMates,
  userTwoUnassignedMates,
} from "../../graphql/mock";
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

export const gqlResNoUnassigned = {
  request: {
    query: GET_UNASSIGNED_DATA,
    variables: { withSync: true },
  },
  result: { data: { getUserData: userNoUnassignedMates } },
};

export const gqlResTwoUnassigned = {
  request: {
    query: GET_UNASSIGNED_DATA,
    variables: { withSync: true },
  },
  result: { data: { getUserData: userTwoUnassignedMates } },
};

export const mockQueryErrorMsg =
  "Mock query error with long explanation on what went wrong";

export const gqlResQueryFail = {
  request: {
    query: GET_UNASSIGNED_DATA,
    variables: { withSync: true },
  },
  error: new Error(mockQueryErrorMsg),
};

export const gqlResSubmitAssignment = {
  request: {
    query: ASSIGN_MATES_TO_FAMILIES,
    variables: {
      withSync: false,
      newAssignments: userTwoUnassignedMates.families.map((family) => ({
        familyId: family.id,
        mateIds: family.mates.map((mate) => mate.id),
      })),
    },
  },
  result: { data: { assignMatesToFamilies: userNoUnassignedMates } },
};

export const mockAssignErrorMsg =
  "Mock assignment error with long explanation on what went wrong";

export const gqlResAssignFail = {
  request: {
    query: ASSIGN_MATES_TO_FAMILIES,
    variables: {
      withSync: false,
      newAssignments: userTwoUnassignedMates.families.map((family) => ({
        familyId: family.id,
        mateIds: family.mates.map((mate) => mate.id),
      })),
    },
  },
  error: new Error(mockAssignErrorMsg),
};
