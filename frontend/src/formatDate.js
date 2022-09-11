const Time = {
  Day: 0,
  Month: 1,
  Date: 2,
  Year: 3,
};

export default function formatDate() {
  let date = new Date().toString().split(" ");
  return `${date[Time.Day]} ${date[Time.Date]} ${date[Time.Month]} ${
    date[Time.Year]
  }`;
}