import { request, gql } from "graphql-request";

// --- Constants ----------------------------------------------------------------------------------
const GRAPH_QL_URL = "http://localhost:4000/graphql";

// --- Owner ---------------------------------------------------------------------------------------
async function getUsers() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_users {
        email,
        firstName,
        lastName,
        posts {
          id,
          text
        }
      }
    }
  `;

  const data = await request(GRAPH_QL_URL, query);

  return data.all_users;
}

export {
  getUsers
}