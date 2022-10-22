import { useContext } from "react";
import UsersContext from "../contexts/UsersContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Container, Row } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FollowChart({ userIdx }) {
  const { users } = useContext(UsersContext);
  const data = {
    labels: ["Following", "Followers"],
    datasets: [
      {
        label:
          "# of people the user is following and people following the user",
        data: users[userIdx].followMetrics,
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Container>
      <Row>
        <div>
          <h2 className="text-center">Follow Metrics</h2>
          <Pie data={data} />
        </div>
      </Row>
    </Container>
  );
}
