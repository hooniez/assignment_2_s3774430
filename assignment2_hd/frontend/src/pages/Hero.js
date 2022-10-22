import { Carousel } from "react-bootstrap";
import users from "../users.png";
import posts from "../posts.png";
import logo from "../logo.png";
import reaction from "../reaction.png";
import logins from "../logins.png";
import profile from "../profile.png";
import follow from "../follow.png";

export default function Hero() {
  return (
    <>
      <h1 className="text-center my-5">LAN Admin Features</h1>
      <hr className="mb-5"></hr>
      <Carousel fade variant="dark" indicators={false} className="mt-5">
        <Carousel.Item>
          <div className="d-flex justify-content-center">
            <img className="d-block" src={users} alt="users" />
          </div>
          <div className="text-center py-5">
            <hr className="my-5" />
            <h3>Users Page</h3>
            <p>Block misbehaving users by nothing more than a mouse-click</p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex justify-content-center">
            <img className="d-block" src={posts} alt="users" />
          </div>

          <div className="text-center py-5">
            <hr className="my-5" />
            <h3>Posts Page</h3>
            <p>Delete naughty posts by nothing more than a mouse-click</p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex justify-content-center">
            <img className="d-block" src={reaction} alt="reaction" />
          </div>

          <div className="text-center py-5">
            <hr className="my-5" />
            <h3>Reaction Metrics</h3>
            <p>
              You can see the percentage of likes and dislikes for each post
              easily in a pie chart
            </p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex justify-content-center">
            <img className="d-block" src={logins} alt="logins" />
          </div>

          <div className="text-center py-5">
            <hr className="my-5" />
            <h3>Login Metrics</h3>
            <p>
              You can see how many users visit LAN each day easily in a line
              chart
            </p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex justify-content-center">
            <img className="d-block" src={profile} alt="profile" />
          </div>

          <div className="text-center py-5">
            <hr className="my-5" />
            <h3>Profile Metrics</h3>
            <p>
              You can see how many visits each profile gets per day in a line
              chart
            </p>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="d-flex justify-content-center">
            <img className="d-block" src={follow} alt="profile" />
          </div>

          <div className="text-center py-5">
            <hr className="my-5" />
            <h3>Follow Metrics</h3>
            <p>
              You can see the percentage of users following a particular user
              and users a particular user is follwoing in a pie chart
            </p>
          </div>
        </Carousel.Item>
      </Carousel>
      <div className="d-flex justify-content-center mt-5">
        <img src={logo} alt="logo" />
      </div>
    </>
  );
}
