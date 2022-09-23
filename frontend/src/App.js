import { useState, useEffect, useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./fragments/Footer";
import NavigationBar from "./fragments/NavigationBar";
import { Outlet, Routes, Route, useLocation } from "react-router-dom";
import Comments from "./pages/forum/Comments";
import Posts from "./pages/forum/Posts";

const userReducer = (state, action) => {
  switch (action.type) {
    case "SIGNUP_USER":
      return {
        ...state,
        data: action.payload,
        isLoggedIn: true,
      };
    case "SIGNIN_USER":
      return {
        ...state,
        data: action.payload,
        isLoggedIn: true,
      };
    case "SIGNOUT_USER":
      return {
        ...state,
        data: null,
        isLoggedIn: false,
      };
    case "EDIT_USER":
      return {
        ...state,
        data: action.payload,
      };
    case "DELETE_USER":
      return {
        ...state,
        isLoggedIn: false,
      };
    case "ADD_POST":
      return {
        ...state,
        data: {
          ...state.data,
          posts: [...state.data.posts, action.payload],
        },
      };
    case "DELETE_POST":
      return {
        ...state,
        data: {
          ...state.data,
          // Filter out the post the use has just deleted
          posts: state.data.posts.filter((post) => post !== action.payload),
        },
      };

    default:
      throw new Error();
  }
};

function App() {
  const [user, dispatchUser] = useReducer(userReducer, {
    data: JSON.parse(sessionStorage.getItem("user")),
    // If sessionStorage has the key "user" defined
    isLoggedIn: sessionStorage.getItem("user") !== null,
  });

  // a mock database holding informaiton on users
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) ?? {}
  );

  // If user logs in, push user to sessionStorage.
  // If user logs out, pop user from sessionStorage.
  useEffect(() => {
    if (user.isLoggedIn) {
      sessionStorage.setItem("user", JSON.stringify(user.data));
    } else {
      sessionStorage.removeItem("user");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.isLoggedIn]);

  // Whenever there is a change in user.data
  useEffect(() => {
    if (user.data) {
      sessionStorage.setItem("user", JSON.stringify(user.data));
    } else {
      // user.data changes to null when the user logs out
      sessionStorage.removeItem("user");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.data]);

  // // Whenever there is a change in users
  // useEffect(() => {
  //   localStorage.setItem("users", JSON.stringify(users));
  // }, [users]);

  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      {/* <Routes location={background || location}>
        <Route path="/posts/" element={<Posts />}>
          <Route path="modal" element={<Comments />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="modal" element={<Comments />} />
        </Routes>
      )} */}
      <NavigationBar isLoggedIn={user.isLoggedIn} dispatchUser={dispatchUser} />
      <Outlet context={[user, dispatchUser]} />
      <Footer />
    </>
  );
}

export default App;
