import { useContext, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  Row,
} from "react-bootstrap";
import UsersContext from "../../contexts/UsersContext";
import { getFollowMetrics } from "../../data/repository";
import FollowChart from "../../fragments/FollowChart";
import VisitChart from "../../fragments/VisitChart";

export default function AnalyticsModalUsers({
  isGraphicModalVisible,
  toggleGraphicModalVisible,
  user,
  userIdx,
}) {
  const { dispatchUsers } = useContext(UsersContext);

  const Follow = {
    Following: 0,
    Followers: 1,
  };

  useEffect(() => {
    const loadFollowMetrics = async () => {
      // currentFollowMetrics: [{userId: 1, followedId: 3}, {userId: 1, followedId: 4}, {userId: 3, followedId: 1}]
      const currentFollowMetrics = await getFollowMetrics(user.id);

      // res = [a, b] where a is the number of users user is following and b is the number of users who follow user
      let res = [0, 0];
      currentFollowMetrics.forEach((el) => {
        if (el.userId === user.id) {
          res[Follow.Following] += 1;
        } else {
          res[Follow.Followers] += 1;
        }
      });

      dispatchUsers({
        type: "SET_FOLLOW_METRICS_FOR_USER_BY_IDX",
        payload: { idx: userIdx, followMetrics: res },
      });
    };

    loadFollowMetrics();
  }, [Follow?.Followers, Follow?.Following, dispatchUsers, user?.id, userIdx]);

  return (
    <Modal
      size="md"
      show={isGraphicModalVisible}
      onHide={() => {
        toggleGraphicModalVisible(userIdx);
      }}
      centered
    >
      <ModalHeader closeButton>
        <ModalTitle>Visual Analytics</ModalTitle>
      </ModalHeader>
      <ModalBody>
        {user != null && (
          <Row>
            <VisitChart userIdx={userIdx} />
            <hr className="my-5"></hr>
            <FollowChart userIdx={userIdx} />
          </Row>
        )}
      </ModalBody>
    </Modal>
  );
}
