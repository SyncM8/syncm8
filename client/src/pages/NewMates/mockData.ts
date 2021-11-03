import { ADD_NEW_MATES, Mate, NewMatesInput } from "../../graphql";

export const newMates: NewMatesInput[] = [
  {
    name: "Jonathan Edwards",
    lastSynced: new Date(2021, 8, 1),
  },
  {
    name: "Immanuel Kant",
    lastSynced: new Date(2021, 8, 1),
  },
];

export const createdMates: Mate[] = [
  {
    id: "123",
    name: "Jonathan Edwards",
    sync_ids: ["sync1"],
  },
  {
    id: "234",
    name: "Immanuel Kant",
    sync_ids: ["sync2"],
  },
];

export const mockErrorMsg =
  "Mock error with long explanation on what went wrong";

export const graphqlResSuccess = [
  {
    request: {
      query: ADD_NEW_MATES,
      variables: { newMates },
    },
    result: { data: { addNewMates: createdMates } },
  },
];

export const graphqlResFail = [
  {
    request: {
      query: ADD_NEW_MATES,
      variables: { newMates },
    },
    error: new Error(mockErrorMsg),
  },
];
