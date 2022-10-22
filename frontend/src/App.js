import { useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./fragments/Footer";
import NavigationBar from "./fragments/NavigationBar";
import { Outlet } from "react-router-dom";

const userReducer = (state, action) => {
  switch (action.type) {
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
        following: [],
        followers: [],
      };
    case "EDIT_USER":
      return {
        ...state,
        data: action.payload,
      };
    case "UPDATE_FOLLOWING":
      return {
        ...state,
        following: action.payload,
      };
    case "UPDATE_FOLLOWERS":
      return {
        ...state,
        followers: action.payload,
      };

    default:
      throw new Error();
  }
};

function App() {
  const [user, dispatchUser] = useReducer(userReducer, {
    data: null,
    following: [],
    // followed: null,
    followers: [],
    isLoggedIn: false,
  });

  return (
    <>
      <NavigationBar
        user={user}
        isLoggedIn={user.isLoggedIn}
        dispatchUser={dispatchUser}
      />
      <Outlet context={[user, dispatchUser]} />
      <Footer />
    </>
  );
}

export default App;
