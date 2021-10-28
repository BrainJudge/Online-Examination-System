import style from "../../../styles/Test.module.css";
import Image from "next/image";
import { useState, useEffect, useContext, useCallback } from "react";
import { useHttpClient } from "../../../customHooks/httpHook";
import { AuthContext } from "../../../context/authContext";
import { toast } from "react-toastify";
import moment from "moment";
import { Modal } from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";
import NProgress from "nprogress";

//Getting test details
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

const Test = ({ test, status, testId }) => {
  const { userId } = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const [currQuestIdx, setCurrQuestIdx] = useState(0); //current question idx
  const [currentQuest, setCurrQuest] = useState(test.questions[0]); //current question
  const [attempted, setAttempted] = useState(null); //attempted ans (not submitted currently)
  const [currStatus, setCurrStatus] = useState({}); //total questions status
  const [currQuestStatus, setCurrQuestStatus] = useState(null); //current question status
  const [submittedAnsId, setSubmittedAnsId] = useState(null); //submitted ans of a question
  const [isLoading, setIsLoading] = useState(false);
  const [lastMinsRem, setLastMinsRem] = useState(false);
  const [timeleft, setTimeLeft] = useState({
    hh: 0,
    mm: 0,
    sec: 0,
  });

  const router = useRouter();

  console.log(currQuestStatus);

  //progressbar
  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();
    if (isLoading) handleStart();
    else handleStop();
  }, [isLoading]);

  //setting current question of currentQuestIdx change
  useEffect(() => {
    setCurrQuest(test.questions[currQuestIdx]);
  }, [currQuestIdx, test]);

  //all question status
  useEffect(() => {
    setIsLoading(true);
    const api_url = `${process.env.NEXT_PUBLIC_STUDENT_API}/result/getStatus`;
    const body = JSON.stringify({ userId: userId, testId: testId });
    sendRequest(api_url, "POST", body, { "Content-Type": "application/json" })
      .then((res) => {
        setIsLoading(false);
        if (res.status === 201) {
          setCurrStatus(res.testStatus);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, [userId, sendRequest, testId]);

  //current question status
  useEffect(() => {
    const allQuestionsStatus = currStatus.questions;
    const getQuestStatus = allQuestionsStatus?.find(
      (quest) => quest.questionId === currentQuest._id
    );
    if (!!getQuestStatus) {
      setCurrQuestStatus(getQuestStatus);
      setSubmittedAnsId(getQuestStatus.attemptedAns);
    }
  }, [currStatus, currentQuest]);

  //submitting answers
  const submitAnswerHandler = () => {
    if (!attempted) {
      if (currQuestStatus?.attempted)
        return toast.warn("You have already submitted this option");
      else return toast.warn("Please select an option");
    }
    setIsLoading(true);
    setTimeout(() => {
      const api_url = `${process.env.NEXT_PUBLIC_STUDENT_API}/result/submitAnswer`;
      const body = JSON.stringify({
        userId: userId,
        testId: testId,
        questionId: currentQuest._id,
        attemptedAnsId: attempted,
      });
      sendRequest(api_url, "POST", body, { "Content-Type": "application/json" })
        .then((res) => {
          setIsLoading(false);
          if (res.status === 201) {
            setCurrStatus(res.testStatus);
            setAttempted(null);
            if (currQuestIdx === test.questions.length - 1) setCurrQuestIdx(0);
            else setCurrQuestIdx((prev) => prev + 1);
          } else toast.error(res.message);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
          toast.error(err.message);
        });
    }, 5000);
  };

  //checking is current question is answerd or not
  const isAnswerd = (questionId) => {
    const allQuestions = currStatus.questions;
    const getQuestStatus = allQuestions?.find(
      (quest) => quest.questionId === questionId
    );
    if (!!getQuestStatus) return getQuestStatus.attempted;
    return false;
  };

  const optionCheckedHandler = (optionId) => {
    if (!!attempted && attempted == optionId) return true;
    return submittedAnsId == optionId;
  };

  const finishQuizHandler = useCallback(() => router.push("/feedback"), []);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (!!currStatus.startTime) {
        const endTime = moment(currStatus.startTime).add(
          test.testDuration,
          "m"
        );
        const diff = moment(endTime).diff(moment(moment().format()));
        const time = moment.duration(diff);
        const prev = { ...timeleft };
        prev.hh = time._data.days * 24 + time._data.hours;
        prev.mm = time._data.minutes;
        prev.sec = time._data.seconds;
        setTimeLeft(prev);
        if (prev.hh === 0 && prev.mm < 5) setLastMinsRem(true);
        if (prev.hh <= 0 && prev.mm <= 0 && prev.sec <= 0) finishQuizHandler();
      }
    }, 1000);
    return () => clearInterval(myInterval);
  }, [currStatus, finishQuizHandler, test.testDuration, timeleft]);

  const [openFinishModal, setOpenFinishModal] = useState(false);
  const handleFinishModalOpen = () => setOpenFinishModal(true);
  const handleFinishModalClose = () => setOpenFinishModal(false);

  if (status !== 200)
    return (
      <div className="wrapper" style={{ height: "100vh" }}>
        <h5 className={style.testEnded}>Unable to fetch Questions</h5>
      </div>
    );

  if (timeleft.hh < 0 || timeleft.mm < 0 || timeleft.sec < 0)
    return (
      <div className="wrapper" style={{ height: "100vh" }}>
        <h3 className={style.testEnded}>Test Ended</h3>
      </div>
    );

  return (
    <>
      <Head>
        <title>BrainJudge</title>
        <meta name="description" content="free online test management system" />
      </Head>
      <Modal open={openFinishModal} onClose={handleFinishModalClose}>
        <div className={style.finshTestContainer}>
          <span>Are you sure want to finish Test???</span>
          <div className={style.btnContainer}>
            <button className={style.modalBtn} onClick={handleFinishModalClose}>
              Cancel
            </button>
            <button className={style.modalBtn} onClick={finishQuizHandler}>
              Yes
            </button>
          </div>
        </div>
      </Modal>
      <div className={style.container}>
        {/* Navbar */}
        <div className={style.navbar}>
          <div className={style.brandLogo}>
            <img src="/Images/BrandLogo2.png" alt="Brand" />
          </div>
          <div className={style.heading}>{test.testType}</div>
          <div className={style.courseDetails}>
            <div
              className={`${style.timer} ${
                lastMinsRem && style.lastMinsActive
              }`}
            >
              <div className={style.timerVal}>
                <div className={style.digit}>{timeleft.hh}</div>
                <div className={style.type}>Hrs</div>
              </div>
              <div className={style.separator}>:</div>
              <div className={style.timerVal}>
                <div className={style.digit}>{timeleft.mm}</div>
                <div className={style.type}>Min</div>
              </div>
              <div className={style.separator}>:</div>
              <div className={style.timerVal}>
                <div className={style.digit}>{timeleft.sec}</div>
                <div className={style.type}>Sec</div>
              </div>
            </div>
            <button className={style.finish} onClick={handleFinishModalOpen}>
              Finish Quiz
            </button>
          </div>
        </div>

        <div className={style.body}>
          {/* Question Container */}
          <div className={style.leftContainer}>
            <div className={style.questionNumber}>
              Question {currQuestIdx + 1}
            </div>
            <div className={style.questionText}>{currentQuest.passage}</div>
            <div className={style.questionText}>{currentQuest.question}</div>
            <div className={style.imageContainer}>
              <div className={style.imageWrapper}>
                {currentQuest.images?.map((img, idx) => {
                  return (
                    <Image
                      src={img.url}
                      layout="responsive"
                      objectFit="contain"
                      height="100%"
                      width="100%"
                      alt="QuestionImg"
                      key={idx}
                    />
                  );
                })}
              </div>
            </div>
            <div className={style.optionBox}>
              <div className={style.optionHeader}>
                <div className={style.leftOptionHeader}>OPTIONS</div>
                <div className={style.rightOptionHeader}>
                  <div className={style.topicName}>{currentQuest.topic}</div>
                  <div className={style.marks}>{currentQuest.marks} Marks</div>
                </div>
              </div>
              <div className={style.optionContainer}>
                {currentQuest.options?.map((opt, idx) => {
                  return (
                    <label
                      className={style.radLabel}
                      key={idx}
                      onClick={() => {
                        setAttempted(opt.optionId);
                        setSubmittedAnsId(null);
                      }}
                    >
                      <input
                        type="radio"
                        className={style.radInput}
                        name="rad"
                        checked={optionCheckedHandler(opt.optionId)}
                        onChange={() => {}}
                      />
                      <div className={style.radDesign}></div>
                      <div className={style.radText}>{opt.option}</div>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className={style.footer}>
              <button
                className={style.prevBtn}
                disabled={currQuestIdx === 0}
                onClick={() => {
                  setAttempted(null);
                  setCurrQuestIdx((prev) => prev - 1);
                }}
              >
                &#x25C0; Previous
              </button>
              <div className={style.nextNSkipBtns}>
                <button
                  className={style.skipBtn}
                  disabled={currQuestIdx === test.questions.length - 1}
                  onClick={() => {
                    setAttempted(null);
                    setCurrQuestIdx((prev) => prev + 1);
                  }}
                >
                  Skip &amp; Proceed
                </button>
                <button
                  className={style.nextBtn}
                  onClick={submitAnswerHandler}
                  disabled={isLoading}
                >
                  Submit Answer &#x25B6;
                </button>
              </div>
            </div>
          </div>

          <div className={style.rightContainer}>
            <div className={style.rightContainerHeader}>
              <div className={style.totalQuestions}>
                {test.questions?.length || 0} Questions
              </div>
              <div className={style.ansDetails}>
                <button className={style.answered}>Answerd</button>
                <button className={style.current}>Current</button>
              </div>
            </div>
            <div className={style.questionNumbers}>
              {test.questions?.map((quest, i) => (
                <div
                  className={[
                    style.questionBox,
                    isAnswerd(quest._id) &&
                      currQuestIdx !== i &&
                      style.answeredBox,
                    currQuestIdx === i && style.activeBox,
                  ].join(" ")}
                  key={i}
                  onClick={() => {
                    setAttempted(null);
                    setCurrQuestIdx(i);
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;
