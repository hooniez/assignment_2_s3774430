import { rest } from "msw";
import { mockComments, mockPost } from "../data/repository";

const API_HOST = "http://localhost:4000";

// API calls being mocked
export const handlers = [
  // verifyUser(email, password) in repository.js mocked below
  rest.get(`${API_HOST}/api/users/login`, (req, res, ctx) => {
    const email = req.url.searchParams.get("email");
    const password = req.url.searchParams.get("password");
    // If the user is successfully verified,
    if (email === "myeonghoon@gmail.com" && password === "abcDEF1!") {
      return res(
        ctx.json({
          avatarSrc:
            "https://avatars.dicebear.com/api/bottts/0.7036963182906151.svg",
          dateJoined: "2022-09-24T04:48:41.000Z",
          email: "myeonghoon@gmail.com",
          firstName: "Myeonghoon",
          id: 1,
          isBlocked: false,
          isDeleted: false,
          lastName: "Sun",
          passwordHash: "abcDEF1!",
          secretKey: null,
        })
      );
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
];
