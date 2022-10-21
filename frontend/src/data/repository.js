import axios from "axios";
import { request, gql } from "graphql-request";

const API_HOST = "http://localhost:4000";
const GRAPH_QL_URL = "http://localhost:4009/graphql";

// ---------------------------------- User ----------------------------------
async function findUser(email) {
  const response = await axios.get(API_HOST + `/api/users/select/${email}`);
  return response.data;
}

async function createUser(user) {
  const response = await axios.post(API_HOST + "/api/users", user);
  console.log(response.data);
  return response.data;
}

async function verifyUser(email, password) {
  const response = await axios.get(API_HOST + "/api/users/login", {
    params: { email, password },
  });
  return response.data;
}

async function deleteUser(email) {
  await axios.delete(API_HOST + `/api/users/delete/${email}`);
}

async function editUser(user) {
  const response = await axios.put(API_HOST + "/api/users", user);
  return response.data;
}

async function getUsers(ids) {
  const response = await axios.get(API_HOST + `/api/users/${ids}`);
  return response.data;
}

// ---------------------------------- Post ----------------------------------

async function getPosts() {
  const response = await axios.get(API_HOST + `/api/posts`);
  return response.data;
}

async function getMorePosts(offset) {
  const response = await axios.get(API_HOST + `/api/posts/moreNew/${offset}`);
  return response.data;
}

async function getPostsByUser(userId) {
  const response = await axios.get(API_HOST + `/api/posts/${userId}`);
  return response.data;
}

async function getMorePostsByUser(userId, offset) {
  const response = await axios.get(
    API_HOST + `/api/posts/${userId}/moreNew/${offset}`
  );
  return response.data;
}

async function getNumComments(id) {
  const response = await axios.get(API_HOST + `/api/posts/count/${id}`);

  return response.data;
}

async function getHearterIds(id) {
  const response = await axios.get(API_HOST + `/api/reacts/hearters/${id}`);
  return response.data;
}

async function getThumbDownerIds(id) {
  const response = await axios.get(API_HOST + `/api/reacts/thumbdowners/${id}`);
  return response.data;
}

async function createPost(post) {
  const response = await axios.post(API_HOST + "/api/posts", post);
  return response.data;
}

async function deletePost(id) {
  await axios.delete(API_HOST + `/api/posts/delete/${id}`);
}

async function updatePost(post) {
  const response = await axios.put(API_HOST + "/api/posts", post);
  return response.data;
}

// ---------------------------------- Comment ----------------------------------

async function getComments(id) {
  const response = await axios.get(API_HOST + `/api/posts/${id}/comments`);
  return response.data;
}

async function getMoreComments(id, existingIds) {
  const response = await axios.get(
    API_HOST + `/api/posts/${id}/moreNew/${existingIds}`
  );
  return response.data;
}

// ---------------------------------- Follow ----------------------------------

// Create a follow entry
async function follow(followingEmail, followedEmail) {
  const response = await axios.post(
    API_HOST + `/api/follows/${followingEmail}/${followedEmail}`
  );
  return response.data;
}

// Delete a follow entry
async function unfollow(followingEmail, followedEmail) {
  const response = await axios.delete(
    API_HOST + `/api/follows/${followingEmail}/${followedEmail}`
  );
  return response.data;
}

// Get all the users whom the logged-in user follows
async function getAllFollowing(id) {
  const response = await axios.get(
    API_HOST + `/api/follows/getAllFollowing/${id}`
  );
  return response.data;
}

// Get all users who are following the logged-in user
async function getAllFollowers(id) {
  const response = await axios.get(
    API_HOST + `/api/follows/getAllFollowers/${id}`
  );
  return response.data;
}

// ---------------------------------- React ----------------------------------

async function removeReaction(userId, postId) {
  const response = await axios.delete(
    API_HOST + `/api/reacts/removeReaction/${userId}/${postId}`
  );
  await getAllThumbDowns(postId);
  return response.data;
}

async function thumbDown(userId, postId) {
  const response = await axios.post(
    API_HOST + `/api/reacts/thumbdown/${userId}/${postId}`
  );
  await getAllThumbDowns(postId);
  return response.data;
}

async function heart(userId, postId) {
  const response = await axios.post(
    API_HOST + `/api/reacts/heart/${userId}/${postId}`
  );

  return response.data;
}

// ---------------------------------- Login ----------------------------------

async function createLoginEntry(userId) {
  const response = await axios.post(API_HOST + `/api/logins/${userId}`);
  return response.data;
}

// ---------------------------------- Visit ----------------------------------

async function createVisitEntry(visitingEmail, visitedEmail) {
  const response = await axios.post(
    API_HOST + `/api/visits/${visitingEmail}/${visitedEmail}`
  );
  return response.data;
}

// ------------------------------- GraphQL thumbdown request ------------------

// Make a graphql request to let the admin server know the thumbdown has been generated and check whether the number of thumbdowns for the post exceeds 5.
async function getAllThumbDowns(postId) {
  const query = gql`
    query ($postId: Int) {
      all_thumbdowns(postId: $postId) {
        userId
        postId
        reaction
        dateReacted
      }
    }
  `;

  const variables = { postId };

  const data = await request(GRAPH_QL_URL, query, variables);

  return data.all_thumbdowns;
}

const mockUsers = [
  {
    id: 1,
    email: "myeonghoon@gmail.com",
    firstName: "Myeonghoon",
    lastName: "Sun",
    passwordHash: "abcDEF1!",
    dateJoined: "2022-09-24 06:50:44",
    avatarSrc: "https://avatars.dicebear.com/api/bottts/0.7036963182906151.svg",
    isBlocked: false,
    isDeleted: false,
    secretKey: null,
  },
  {
    id: 2,
    email: "hara@gmail.com",
    firstName: "Hara",
    lastName: "Sun",
    passwordHash: "abcDEF1!",
    dateJoined: "2022-09-24 06:50:44",
    avatarSrc: "https://avatars.dicebear.com/api/bottts/0.7036963182906151.svg",
    isBlocked: false,
    isDeleted: true,
    secretKey: null,
  },
  {
    id: 3,
    email: "jihoon@gmail.com",
    firstName: "Jihoon",
    lastName: "Sun",
    passwordHash: "abcDEF1!",
    dateJoined: "2022-09-24 06:50:44",
    avatarSrc: "https://avatars.dicebear.com/api/micah/0.940096983925274.svg",
    isBlocked: false,
    isDeleted: false,
    secretKey: null,
  },
];

const mockPost = [
  {
    id: 1,
    postedBy: 1,
    parentId: null,
    text: "<p>Hello, is anyone on the forum?</p>",
    datePosted: "2022-09-25 09:39:18",
    imgSrc: null,
    isDeleted: 0,
    user: mockUsers[0],
  },
];

const mockPostToAdd = {
  id: 4,
  postedBy: 1,
  parentId: null,
  text: "<p>Hey everyone</p>",
  datePosted: "2022-09-25 10:00:18",
  imgSrc: null,
  isDeleted: 0,
  user: mockUsers[0],
};

const mockComments = [
  {
    id: 2,
    postedBy: 1,
    parentId: 1,
    text: "Please disregard this message. I was lonely",
    datePosted: "2022-09-25 09:49:18",
    imgSrc: null,
    isDeleted: 0,
    user: mockUsers[0],
  },
  {
    id: 3,
    postedBy: 3,
    parentId: 1,
    text: "Oh, Myeonghoon! I'm lonely too :(",
    datePosted: "2022-09-25 09:59:18",
    imgSrc: null,
    isDeleted: 0,
    user: mockUsers[2],
  },
];

export {
  createUser,
  findUser,
  verifyUser,
  deleteUser,
  editUser,
  getPosts,
  getMorePosts,
  getNumComments,
  createPost,
  deletePost,
  updatePost,
  getComments,
  getMoreComments,
  mockUsers,
  mockPost,
  mockComments,
  mockPostToAdd,
  follow,
  unfollow,
  getAllFollowing,
  getAllFollowers,
  getPostsByUser,
  getMorePostsByUser,
  getUsers,
  getHearterIds,
  getThumbDownerIds,
  removeReaction,
  thumbDown,
  heart,
  createLoginEntry,
  createVisitEntry,
};
