import style from "../styles/ContestCard.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import moment from "moment";
const ContestCard = ({ props }) => {
  const router = useRouter();
  const { testName, testType, startTime, testDuration, endTime, _id } = props;

  let durationHour = parseInt(testDuration / 60);
  let durationMin = testDuration - durationHour * 60;

  const testDate = moment(startTime).format("ll");
  const stTime = moment(startTime).format("LT");
  const edTime = moment(endTime).format("LT");

  const [testActive, setActive] = useState(false);
  const [expire, setExpire] = useState(false);

  const [timeleft, setTimeLeft] = useState({
    hh: 0,
    mm: 0,
    sec: 0,
  });

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (moment().format() >= startTime) setActive(true);
      if (moment().format() >= endTime) {
        setExpire(true);
        setActive(false);
      }
      const diff = moment(startTime).diff(moment(moment().format()));
      const time = moment.duration(diff);
      const prev = { ...timeleft };
      prev.hh = time._data.days * 24 + time._data.hours;
      prev.mm = time._data.minutes;
      prev.sec = time._data.seconds;
      setTimeLeft(prev);
    }, 1000);
    return () => clearInterval(myInterval);
  }, []);

  return (
    <div className={style.container}>
      <div className={style.header}>
        Join this {durationHour !== 0 && durationHour + " hour"} {durationMin}{" "}
        minutes contest
      </div>
      <div className={style.testType}>{testType}</div>
      <div className={style.body}>
        <div className={style.heading}>{testName}</div>
        <div className={style.timing}>
          <span className={style.span1}>Join at</span>
          {testDate}
          <span className={style.span2}>between</span> {stTime} - {edTime}
        </div>
      </div>
      {/* {!testActive && !expire && (
        <div className={style.footer}>
          Starts in {timeleft.hh}h {timeleft.mm}m {timeleft.sec}s
        </div>
      )} */}
      {/* remove exclamation marks */}
      {!testActive && (
        <button
          className={style.startBtn}
          onClick={() => router.push("/tests/join/testDetails/" + _id)}
        >
          START NOW
        </button>
      )}
      {/* {expire && (
        <button className={style.startBtn} disabled>
          Expired
        </button>
      )} */}
    </div>
  );
};

export default ContestCard;
