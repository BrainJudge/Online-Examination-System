import { useState, useContext } from "react";
import style from "../../../../styles/TestDetails.module.css";
import Navbar from "../../../../components/Navbar";
import { AuthContext } from "../../../../context/authContext";
import { useHttpClient } from "../../../../customHooks/httpHook";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

export const getServerSideProps = async (context) => {
  const { testId } = context.params;

  const api_url = `${process.env.NEXT_PUBLIC_STUDENT_API}/test/getTestById/${testId}`;
  const data = await fetch(api_url);
  const res = await data.json();

  return {
    props: {
      test: res.test,
      status: data.status,
      testId: testId,
    },
  };
};

const TestDetails = ({ test, status, testId }) => {
  const { personalInfo, userId } = useContext(AuthContext);
  const { name, email } = personalInfo;

  const router = useRouter();

  const [checkedCondition, setCheckedCondition] = useState(false);
  const [error, setError] = useState(null);

  const { sendRequest } = useHttpClient();

  const [isLoading, setIsLoading] = useState(false);

  const startTestHandler = () => {
    setIsLoading(true);
    if (!checkedCondition) {
      setIsLoading(false);
      setError("Please click on radio button to accept this conditions.");
      return;
    }
    const api_url = `${process.env.NEXT_PUBLIC_STUDENT_API}/result/addStatus`;
    const body = JSON.stringify({ userId, testId, name, email });
    setTimeout(() => {
      sendRequest(api_url, "POST", body, {
        "Content-Type": "application/json",
      })
        .then((res) => {
          setIsLoading(false);
          if (res.status === 201) {
            router.push("/tests/join/" + testId);
          } else {
            toast.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error(err.message);
        });
    }, 10000);
  };

  if (status !== 200) {
    return <div>Unable to fetch questions</div>;
  }

  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className={style.container}>
          <div className={style.row}>
            <div className={style.rowLeft}>
              <div className={style.label}>Name :</div>
              <div className={style.val}>{name}</div>
            </div>
            <div className={style.rowRight}>
              <div className={style.label}>Email :</div>
              <div className={style.val}>{email}</div>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.rowLeft}>
              <div className={style.label}>Test Name :</div>
              <div className={style.val}>{test.testName}</div>
            </div>
            <div className={style.rowRight}>
              <div className={style.label}>Test Type :</div>
              <div className={style.val}>{test.testType}</div>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.rowLeft}>
              <div className={style.label}>Test Duration :</div>
              <div className={style.val}>{test.testDuration} mins</div>
            </div>
            <div className={style.rowRight}>
              <div className={style.label}>Email :</div>
              <div className={style.val}>alimodassir@gmail.com</div>
            </div>
          </div>
          <div className={style.instructions}>
            <div className={style.instructHeading}>Genral Instructions</div>
            <ul className={style.instructPoints}>
              <li className={style.point}>
                The examination shall consists of{" "}
                <strong>
                  {test.questions?.length || 0} Multiple Choice (MCQ),{" "}
                </strong>{" "}
                carring <strong>1 marks </strong> each.
              </li>
              <li className={style.point}>
                Each <strong>MCQ</strong> will have <strong>4 choices</strong>{" "}
                and a student shall mark his/her choice of MCQs on the system
                itself.
              </li>
              <li className={style.point}>
                Total Test Duration is{" "}
                <strong>{test.testDuration} Minutes.</strong>
              </li>
              <li className={style.point}>
                There will be <strong>No Negative marking</strong> for any wrong
                answer or non-attempt, and answers will be auto calculated.
              </li>
              <li className={style.point}>
                You can <strong>Submit</strong> your test whenever you want.
                However, if the test time elapses, the system will automatically{" "}
                <strong>Submit</strong> your test.
              </li>
              <li className={style.point}>
                <strong>Do not close</strong> any window directly when you are
                taking the test.
              </li>
              {/* <li className={style.point}></li> */}
            </ul>
          </div>
          <div className={style.instructions}>
            <div className={style.instructHeading}>
              Navigational Instructions
            </div>
            <ul className={style.instructPoints}>
              <li className={style.point}>
                Select the appropriate answer for each questions. Then click{" "}
                <strong>&quot;Submit&quot;</strong> button to submit that
                answer.
              </li>
              <li className={style.point}>
                Click on <strong>&quot;Previous&quot;</strong> button, to move
                to the previous question.
              </li>
              <li className={style.point}>
                Click on <strong>&quot;SKIP&quot;</strong> button ,to move to
                the next question without submitting.
              </li>
              <li className={style.point}>
                Every time you submit an answer for a question, Question Number
                Box will turn green in question panel.
              </li>
              <li className={style.point}>
                Blue color will indicate in which question you are on currently,
                in question panel.
              </li>
            </ul>
          </div>
          <label
            className={style.radLabel}
            onClick={() => {
              setCheckedCondition(true);
              setError(null);
            }}
          >
            <input type="radio" className={style.radInput} name="rad" />
            <div className={style.radDesign}></div>
            <div className={style.radText}>
              You certify that you are not accepting or utilizing any external
              help to complete the exam, and are the applicable exam taker who
              is responsible for any violation of exam rules. You agree to
              participate in the disciplinary process.
            </div>
          </label>
          {!!error && <div className={style.errorText}>{error}</div>}
          <button
            className={style.startBtn}
            onClick={startTestHandler}
            disabled={isLoading}
          >
            START NOW{" "}
            {isLoading && (
              <CircularProgress
                color="success"
                size={20}
                style={{ marginLeft: "5px" }}
              />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default TestDetails;
