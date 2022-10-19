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

async function getReactions(id) {
  const query = gql`
    all_reactions($postId: Int) {
      reaction
    }
  `
}

export { getUsers, blockUser, getPosts, deletePost, getReactions };
