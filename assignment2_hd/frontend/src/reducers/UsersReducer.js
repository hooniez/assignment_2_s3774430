const UsersReducer = (state, action) => {
  switch (action.type) {
    case "SET_USERS":
      return [...action.payload];
    case "BLOCK_USER":
      return Object.values({
        ...state,
        [action.payload]: {
          ...state[action.payload],
          isBlocked: true,
        },
      });
    case "UNBLOCK_USER":
      return Object.values({
        ...state,
        [action.payload]: {
          ...state[action.payload],
          isBlocked: false,
        },
      });
    default:
      throw new Error("Error!");
  }
};

export default UsersReducer;
