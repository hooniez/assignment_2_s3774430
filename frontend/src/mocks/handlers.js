import { rest } from "msw";
import {
  mockComments,
  mockPost,
  mockUsers,
  mockPostToAdd,
} from "../data/repository";

const API_HOST = "http://localhost:4000";

// API calls being mocked
export const handlers = [
  // findUser(email) in repository.js mocked below
  rest.get(`${API_HOST}/api/users/select/:email`, (req, res, ctx) => {
    return res(ctx.json(mockUsers[0]));
  }),

  // verifyUser(email, password) in repository.js mocked below
  rest.get(`${API_HOST}/api/users/login`, (req, res, ctx) => {
    const email = req.url.searchParams.get("email");
    const password = req.url.searchParams.get("password");
    // If the user is successfully verified,
    if (email === "myeonghoon@gmail.com" && password === "abcDEF1!") {
      return res(ctx.json(mockUsers[0]));
    } else if (email === "myeonghoon@gmail.com" && password !== "abcDEF1!") {
      return res(ctx.json({ error: "Incorrect email or password" }));
    } else if (email === "hara@gmail.com" && password === "abcDEF1!") {
      return res(ctx.json({ error: "No such user exists" }));
    }
  }),

  // editUser(user) in repository.js mocked below
  rest.put(`${API_HOST}/api/users`, (req, res, ctx) => {
    return res(ctx.json([1]));
  }),

  // getPosts() in repository.js mocked below
  rest.get(`${API_HOST}/api/posts`, (req, res, ctx) => {
    return res(ctx.json(mockPost));
  }),

  // getPostsByUser(userId) in repository.js mocked below
  rest.get(`${API_HOST}/api/posts/:userId`, (req, res, ctx) => {
    return res(ctx.json(mockPost));
  }),

  // getNumChildPosts(id) in repository.js mocked below
  rest.get(`${API_HOST}/api/posts/count/:id`, (req, res, ctx) => {
    const postId = req.params.id;
    // The post with id 1 has two comments whereas all the other posts do not have any comments
    if (postId == 1) {
      return res(ctx.json(2));
    } else {
      return res(ctx.json(0));
    }
  }),

  // getComments(id) in repository.js mocked below
  rest.get(`${API_HOST}/api/posts/:id/comments`, (req, res, ctx) => {
    const parentPostId = req.params.id;
    // Since there is only one parentPost being tested, return mockComments without conditional statements
    return res(ctx.json(mockComments));
  }),

  // deletePost(id) in repository.js mocked below
  rest.delete(API_HOST + `/api/posts/delete/:id`, (req, res, ctx) => {
    return res(ctx.json(undefined));
  }),

  // updatePost(post) in repository.js mocked below
  rest.put(API_HOST + "/api/posts", (req, res, ctx) => {
    return res(ctx.json([1]));
  }),

  // createPost(post) in repository.js mocked below
  rest.post(API_HOST + "/api/posts", (req, res, ctx) => {
    return res(ctx.json(mockPostToAdd));
  }),

  // getAllFollowing(id) in repository.js mocked below
  rest.get(API_HOST + `/api/follows/getAllFollowing/:id`, (req, res, ctx) => {
    return res(ctx.json([]));
  }),

  // getAllFollowers(id) in repository.js mocked below
  rest.get(API_HOST + `/api/follows/getAllFollowers/:id`, (req, res, ctx) => {
    return res(ctx.json([]));
  }),

  // getHearterIds(id) in repository.js mocked below
  rest.get(API_HOST + `/api/reacts/hearters/:id`, (req, res, ctx) => {
    if (req.params.id === "1") {
      return res(ctx.json([1, 3]));
    } else {
      return res(ctx.json([]));
    }
  }),

  // getThumbDownerIds(id) in repository.js mocked below
  rest.get(API_HOST + `/api/reacts/thumbdowners/:id`, (req, res, ctx) => {
    return res(ctx.json([]));
  }),

  // removeReaction(userId, postId) in repository.js mocked below
  rest.delete(
    API_HOST + `/api/reacts/removeReaction/:userId/:postId`,
    (req, res, ctx) => {
      return res(ctx.json(1));
    }
  ),

  // heart(userId, postId) in repository.js mocked below
  rest.post(API_HOST + `/api/reacts/heart/:userId/:postId`, (req, res, ctx) => {
    return res(
      ctx.json({
        dateReacted: "2022-10-01T09:17:06.888Z",
        postId: "1",
        reaction: 1,
        userId: "1",
      })
    );
  }),

  // thumbDown(userId, postId) in repository.js mocked below
  rest.post(API_HOST + `/api/reacts/thumbdown/:userId/:postId`, (req, res, ctx) => {
    return res(
      ctx.json({
        dateReacted: "2022-10-01T09:18:06.888Z",
        postId: "1",
        reaction: -1,
        userId: "1",
      })
    );
  }),
];
