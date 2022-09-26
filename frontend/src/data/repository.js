import axios from "axios";

// TODO: extract the two lines below in a separate file.
const API_HOST = "http://localhost:4000";
const USER_KEY = "user";

// ---------------------------------- User ----------------------------------
async function findUser(email) {
  const response = await axios.get(API_HOST + `/api/users/select/${email}`);
  return response.data;
}

async function createUser(user) {
  const response = await axios.post(API_HOST + "/api/users", user);
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

// ---------------------------------- Post ----------------------------------

async function getPosts() {
  const response = await axios.get(API_HOST + "/api/posts");
  return response.data;
}

async function getMorePosts(existingIds) {
  const response = await axios.get(
    API_HOST + `/api/posts/moreNew/${existingIds}`
  );
  return response.data;
}

async function getNumChildPosts(id) {
  const response = await axios.get(API_HOST + `/api/posts/count/${id}`);

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

// Comments

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
    text: "Hello, is anyone on the forum?",
    datePosted: "2022-09-25 09:39:18",
    imgSrc: null,
    isDeleted: 0,
    user: mockUsers[0]
  },
];

const mockComments = [
  {
    id: 2,
    postedBy: 1,
    parentId: 1,
    text: "Please disregard this message. I was lonely",
    datePosted: "2022-09-25 09:49:18",
    imgSrc: null,
    isDeleted: 0,
    user: mockUsers[0]
  },
  {
    id: 3,
    postedBy: 3,
    parentId: 1,
    text: "Oh, Myeonghoon! I'm lonely too :(",
    datePosted: "2022-09-25 09:59:18",
    imgSrc: null,
    isDeleted: 0,
    user: mockUsers[2]
  },
]

export {
  createUser,
  findUser,
  verifyUser,
  deleteUser,
  editUser,
  getPosts,
  getMorePosts,
  getNumChildPosts,
  createPost,
  deletePost,
  updatePost,
  getComments,
  getMoreComments,
  mockUsers,
  mockPost,
  mockComments,
};
