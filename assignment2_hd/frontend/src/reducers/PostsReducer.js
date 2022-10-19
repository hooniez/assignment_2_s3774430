const PostsReducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return [...action.payload];
    case "DELETE_POST":
      return Object.values({
        ...state,
        [action.payload]: {
          ...state[action.payload],
          isDeletedByAdmin: true,
        },
      });
    case "UNDELETE_POST":
      return Object.values({
        ...state,
        [action.payload]: {
          ...state[action.payload],
          isDeletedByAdmin: false,
        },
      });
    
    case "SET_REACTION_FOR_POST_BY_IDX":
      return Object.values({
        ...state,
        [action.payload.idx]: {
          ...state[action.payload.idx],
          reactions: action.payload.reactions,
        }
      })
    
    default:
      throw new Error("Error!");
  }
};

export default PostsReducer;
