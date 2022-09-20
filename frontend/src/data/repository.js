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
};
