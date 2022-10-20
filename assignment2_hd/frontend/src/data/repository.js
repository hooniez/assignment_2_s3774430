import { request, gql } from "graphql-request";

// --- Constants ----------------------------------------------------------------------------------
const GRAPH_QL_URL = "http://localhost:4009/graphql";

// --- Owner ---------------------------------------------------------------------------------------
async function getUsers() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_users {
        id
        email
        firstName
        lastName
        isBlocked
        posts {
          id
          text
        }
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_users;
}

async function getPosts() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_posts {
        id
        text
        isDeletedByAdmin
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_posts;
}

async function blockUser(id) {
  const query = gql`
    mutation ($id: Int) {
      block_user(id: $id)
    }
  `;

  const variables = { id };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.block_user;
}

async function deletePost(id) {
  const query = gql`
    mutation ($id: Int) {
      delete_post(id: $id)
    }
  `;

  const variables = { id };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.delete_post;
}

async function getReactions(postId) {
  const query = gql`
    query ($postId: Int) {
      all_reactions(postId: $postId) {
        reaction
      }
    }
  `;
  const variables = { postId };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.all_reactions;
}

async function getNumUsersPerDay() {
  const query = gql`
    {
      all_recent_logins {
        userId
        dateLoggedIn
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_recent_logins;
}

async function getFollowMetrics(userId) {
  const query = gql`
    query ($userId: Int) {
      all_follow_metrics(userId: $userId) {
        userId
        followedId
      }
    }
  `;

  const variables = { userId };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.all_follow_metrics;
}

async function getProfileVisits(userId) {
  const query = gql`
    query ($userId: Int) {
      all_profile_visits(userId: $userId) {
        visitedId
        dateVisited
      }
    }
  `;

  const variables = { userId };
  const data = await request(GRAPH_QL_URL, query, variables);
  return data.all_profile_visits;
}

export {
  getUsers,
  blockUser,
  getPosts,
  deletePost,
  getReactions,
  getNumUsersPerDay,
  getFollowMetrics,
  getProfileVisits,
};
