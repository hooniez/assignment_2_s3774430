import { useEffect, useState } from "react";
import { getNumUsersPerDay } from "../data/repository";
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
  let dateToLogins = {};
  let datesSet = new Set();
  let datesArr;
  let numLogins = [];
  res.forEach((el) => {
    let date = new Date(el.dateLoggedIn);
    // Remove the hour, minute, and second from date so that each date on the same day is identical
    date.setHours(0, 0, 0, 0);

    // Add dates into a set (Remove duplicates)
    let dateString = date.toDateString();
    datesSet.add(dateString);

    // Check whether the property is alredy in data
    if (dateToLogins.hasOwnProperty(dateString)) {
      dateToLogins[dateString] += 1;
    } else {
      dateToLogins[dateString] = 1;
    }
  });

  datesArr = Array.from(datesSet);
  // Sort the dates in the chronological order
  datesArr.sort(function (a, b) {
    return new Date(a) - new Date(b);
  });

  // Now for every date, find the corresponding number of logins and store it in data
  datesArr.forEach((date) => {
    numLogins.push(dateToLogins[date]);
  });

  ret["dates"] = datesArr;
  ret["numLogins"] = numLogins;
  return ret;
};

export default function UsersPerDayChart() {
  const [data, setData] = useState({});
  let dates;
  let numLogins;

  useEffect(() => {
    const loadNumUsersPerDay = async () => {
      const res = await getNumUsersPerDay();
      const ret = convertResToData(res);

      dates = ret.dates;
      numLogins = ret.numLogins;

      setData({
        ...data,
        labels: dates,
        datasets: [
          {
            label: "Number of users logged in per day",
            data: numLogins,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5",
          },
        ],
      });
    };
    loadNumUsersPerDay();
  }, []);
  return Object.keys(data).length !== 0 ? (
    <div className="mt-5">
      <h2 className="text-center">Number of Users Using LAN</h2>
      <Line data={data} />
    </div>
  ) : (
    <div></div>
  );
}
