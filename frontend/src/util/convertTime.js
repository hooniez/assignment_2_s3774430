export default function convertTime(time) {
  // Only converts delta in terms of seconds, months, hours, and days
  let res = "";
  let now = Date.now();
  let then = new Date(time).getTime();
  let deltaSeconds = (now - then) / 1000;
  
  if (deltaSeconds < 60) {
    res = "now";
  } else if (deltaSeconds >= 60 && deltaSeconds < 3600) {
    res = Math.floor(deltaSeconds / 60) + "m";
  } else if (deltaSeconds >= 3600 && deltaSeconds < 86400) {
    res = Math.floor(deltaSeconds / 3600) + "h";
  } else {
    res = Math.floor(deltaSeconds / 86400) + "d";
  }

  return res;
}
