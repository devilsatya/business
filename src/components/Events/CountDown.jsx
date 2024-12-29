import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";

const CountDown = ({ data }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(data.Finish_Date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);

      // Check if the countdown is finished
      if (
        !updatedTimeLeft.days &&
        !updatedTimeLeft.hours &&
        !updatedTimeLeft.minutes &&
        !updatedTimeLeft.seconds
      ) {
        clearInterval(timer); // Stop the timer
        axios
          .delete(`${server}/event/delete-shop-event/${data._id}`)
          .then((response) => {
            console.log("Event deleted:", response.data);
          })
          .catch((error) => {
            console.error("Error deleting event:", error);
          });
      }
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on unmount
  }, [data, timeLeft]);

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span className="text-[25px] text-[#475ad2]" key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-[red] text-[25px]">Time's Up</span>
      )}
    </div>
  );
};

export default CountDown;
