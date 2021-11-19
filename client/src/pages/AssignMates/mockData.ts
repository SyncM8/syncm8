import {
  ASSIGN_MATES_TO_FAMILIES,
  GET_UNASSIGNED_DATA,
} from "../../graphql/graphql";
import {
  userNoUnassignedMates,
  userTwoUnassignedMates,
} from "../../graphql/mock";

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
      newAssignments: [
        {
          familyId: userTwoUnassignedMates.families[1].id,
          mateIds: userTwoUnassignedMates.families[1].mates.map(
            (mate) => mate.id
          ),
        },
      ],
    },
  },
  result: {
    data: {
      assignMatesToFamilies: userTwoUnassignedMates.unassigned_family.mates.map(
        (mate) => mate.id
      ),
    },
  },
};

export const mockAssignErrorMsg =
  "Mock assignment error with long explanation on what went wrong";

export const gqlResAssignFail = {
  request: {
    query: ASSIGN_MATES_TO_FAMILIES,
    variables: {
      newAssignments: [
        {
          familyId: userTwoUnassignedMates.families[1].id,
          mateIds: userTwoUnassignedMates.families[1].mates.map(
            (mate) => mate.id
          ),
        },
      ],
    },
  },
  error: new Error(mockAssignErrorMsg),
};
