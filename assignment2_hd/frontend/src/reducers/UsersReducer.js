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
      case "SET_FOLLOW_METRICS_FOR_USER_BY_IDX":
        return Object.values({
          ...state,
          [action.payload.idx]: {
            ...state[action.payload.idx],
            followMetrics: action.payload.followMetrics,
          }
        })
    default:
      throw new Error("Error!");
  }
};

export default UsersReducer;
