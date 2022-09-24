import { rest } from "msw";

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
];
