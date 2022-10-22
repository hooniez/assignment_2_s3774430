import { useContext, useEffect, useState } from "react";
import { getProfileVisits } from "../data/repository";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import UsersContext from "../contexts/UsersContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Convert res to data that can be used by a Line chart
const convertResToData = (res) => {
  let ret = {};
  let dateToVisits = {};
  let datesSet = new Set();
  let datesArr;
  let numVisits = [];

  // Convert res into data acceptable by the chart
  res.forEach((el) => {
    let date = new Date(el.dateVisited);
    // Remove the hour, minute, and second from date so that each date on the same day is identical
    date.setHours(0, 0, 0, 0);

    // Add dates into a set (Remove duplicates)
    let dateString = date.toDateString();
    datesSet.add(dateString);

    // Check whether the property is alredy in data
    if (dateToVisits.hasOwnProperty(dateString)) {
      dateToVisits[dateString] += 1;
    } else {
      dateToVisits[dateString] = 1;
    }
  });

  datesArr = Array.from(datesSet);
  // Sort the dates in the chronological order
  datesArr.sort(function (a, b) {
    return new Date(a) - new Date(b);
  });

  // Now for every date, find the corresponding number of logins and store it in data
  datesArr.forEach((date) => {
    numVisits.push(dateToVisits[date]);
  });

  ret["dates"] = datesArr;
  ret["numVisits"] = numVisits;
  return ret;
};

export default function VisitChart({ userIdx }) {
  const { users } = useContext(UsersContext);
  const [data, setData] = useState({});
  const [dates, setDates] = useState([]);
  const [numVisits, setNumVisits] = useState([]);

  useEffect(() => {
    // set dates, numVisits, and data necessary to render a chart
    const loadProfileVisits = async () => {
      const res = await getProfileVisits(users[userIdx].id);

      const ret = convertResToData(res);

      setDates(ret.dates);
      setNumVisits(ret.numVisits);

      setData({
        ...data,
        labels: dates,
        datasets: [
          {
            label: "Profile Visits by Other Users",
            data: numVisits,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5",
          },
        ],
      });
    };
    loadProfileVisits();
  }, [data, dates, numVisits, userIdx, users]);
  return Object.keys(data).length !== 0 ? (
    <div className="mt-5">
      <h2 className="text-center">Profile Visits by Other Users</h2>
      <Line data={data} />
    </div>
  ) : (
    <div></div>
  );
}
