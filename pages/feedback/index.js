import style from "../../styles/FeedBack.module.css";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useHttpClient } from "../../customHooks/httpHook";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

const FeedBack = ({ afterTest }) => {
  const { sendRequest, isLoading } = useHttpClient();
  const router = useRouter();
  const { personalInfo } = useContext(AuthContext);
  const { name, email } = personalInfo;
  const [rating, setRating] = useState(0);
  const [feedback, setFeedBack] = useState("");

  const feedbackSubmitHandler = () => {
    const api_url = `${process.env.NEXT_PUBLIC_STUDENT_API}/feedback/getFeedback`;
    const body = JSON.stringify({ name, email, rating, feedback });
    sendRequest(api_url, "POST", body, { "Content-Type": "application/JSON" })
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    router.push("/");
  };

  return (
    <div className="wrapper">
      <div className={style.container}>
        <div className={style.endingMsg}>Thanks for giving Test</div>
        <div className={style.testMessage}>Results will out shortly!!</div>
        <div className={style.feedBackHeading}>FEEDBACK</div>
        <div className={style.feedBackMsg}>
          Your opinion is important to us. This way we can keep improving our
          website
        </div>
        <div className={style.stars}>
          <div className={style.feedBackStarMsg}>
            Your overall satisfaction of this website
          </div>
          <div className={style.feedback}>
            <div className={style.rating}>
              <input
                type="radio"
                name="rating"
                id="rating5"
                onChange={() => setRating(5)}
              />
              <label htmlFor="rating5"></label>
              <input
                type="radio"
                name="rating"
                id="rating4"
                onChange={() => setRating(4)}
              />
              <label htmlFor="rating4"></label>
              <input
                type="radio"
                name="rating"
                id="rating3"
                onChange={() => setRating(3)}
              />
              <label htmlFor="rating3"></label>
              <input
                type="radio"
                name="rating"
                id="rating2"
                onChange={() => setRating(2)}
              />
              <label htmlFor="rating2"></label>
              <input
                type="radio"
                name="rating"
                id="rating1"
                onChange={() => setRating(1)}
              />
              <label htmlFor="rating1"></label>
            </div>
          </div>
        </div>

        <div className={style.feedBackInput}>
          <label htmlFor="feedBackInput">
            Please let us know what would make this better
          </label>
          <textarea
            rows={5}
            id="feedBackInput"
            placeholder="Message"
            onChange={(e) => setFeedBack(e.target.value)}
          />
        </div>
        {isLoading ? (
          <CircularProgress color="success" />
        ) : (
          <button className={style.submitBtn} onClick={feedbackSubmitHandler}>
            SUBMIT
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedBack;
