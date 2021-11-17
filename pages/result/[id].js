import { useState } from "react";
import style from "../../styles/Result.module.css";
import {
  AiOutlineClockCircle,
  AiFillBulb,
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillCarryOut,
  AiFillExclamationCircle,
  AiFillFileText,
  AiOutlineDown,
} from "react-icons/ai";
import { GrScorecard } from "react-icons/gr";
import Navbar from "../../components/Navbar";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Doughnut } from "react-chartjs-2";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Image from "next/image";
import Footer from "../../components/Footer";
import Head from "next/head";

export async function getServerSideProps(context) {
  const { id } = context.params;
  const [userId, testId] = id?.split("=") || [];
  const api_url = `${process.env.NEXT_PUBLIC_STUDENT_API}/result/getMyResult`;
  const data = await fetch(api_url, {
    method: "POST",
    body: JSON.stringify({ userId, testId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await data.json();
  return {
    props: {
      userResult: res.userResult,
      status: data.status,
      message: res.message || "",
    },
  };
}

const Result = ({ userResult, status, message }) => {
  const [expanded, setExpanded] = useState(false);
  if (status !== 201)
    return (
      <div className="wrapper" style={{ height: "100vh", width: "100%" }}>
        <h5>{message}</h5>
      </div>
    );

  const {
    totalQuest,
    totalMarks,
    attempted,
    corrected,
    totalScore,
    accuracy,
    percentage,
    rank,
    averageScore,
    percentile,
    questAns,
    rankTally,
    testName,
    testType,
    testDuration,
  } = userResult;

  function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          {...props}
          style={{ width: "120px", height: "120px" }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            style={{ fontSize: "1.5rem" }}
          >
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  const data = {
    labels: ["Wrong Answer", "Correct Answer", "Not Attempted"],
    datasets: [
      {
        data: [attempted - corrected, corrected, totalQuest - attempted],
        backgroundColor: ["maroon", "green", "grey"],
      },
    ],
  };

  const handleChange = (panel) => (event, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  if (status !== 201) {
    return <div>Result Not Published</div>;
  }

  const checkStatus = (attemptedAns, correctAns) => {
    if (!attemptedAns)
      return <span className={style.statusWrong}>Not Attempted</span>;
    else if (attemptedAns === correctAns)
      return <span className={style.statusSuccess}>Correct</span>;
    else return <span className={style.statusWrong}>Wrong</span>;
  };

  return (
    <>
      <Head>
        <title>Result</title>
        <meta name="description" content="free online test management system" />
      </Head>
      <Navbar />
      <div className="wrapper">
        <div className={style.container}>
          <div className={style.testResult}>TEST RESULT</div>
          <div className={style.testDetailsContainer}>
            <div className={style.detailsHeader}>
              <div className={style.row}>
                <div className={style.testName}>{testName}</div>
                <div className={style.rowRight}>
                  <div className={style.testDuration}>
                    <AiOutlineClockCircle /> {testDuration} Min
                  </div>
                  <div className={style.totalQuestions}>
                    <AiFillFileText />
                    {totalQuest} Questions
                  </div>
                </div>
              </div>
              <div className={style.testType}>{testType}</div>
            </div>
            <div className={style.resultDetailsContainer}>
              <div className={style.resultBox}>
                <div className={style.iconBox}>
                  <GrScorecard className={`${style.icon} ${style.blueIcon}`} />
                </div>
                <div className={style.scoreBox}>
                  <div className={style.scoreLabel}>Your Score</div>
                  <div className={style.scoreValue}>{totalScore}</div>
                </div>
              </div>
              <div className={style.resultBox}>
                <div className={style.iconBox}>
                  <AiFillCarryOut
                    className={`${style.icon} ${style.greyIcon}`}
                  />
                </div>
                <div className={style.scoreBox}>
                  <div className={style.scoreLabel}>Average Score</div>
                  <div className={style.scoreValue}>{averageScore}</div>
                </div>
              </div>
              <div className={style.resultBox}>
                <div className={style.iconBox}>
                  <AiFillBulb className={`${style.icon} ${style.yellowIcon}`} />
                </div>
                <div className={style.scoreBox}>
                  <div className={style.scoreLabel}>Total Marks</div>
                  <div className={style.scoreValue}>{totalMarks}</div>
                </div>
              </div>
              <div className={style.resultBox}>
                <div className={style.iconBox}>
                  <AiFillExclamationCircle
                    className={`${style.icon} ${style.blueIcon}`}
                  />
                </div>
                <div className={style.scoreBox}>
                  <div className={style.scoreLabel}>Attempted</div>
                  <div className={style.scoreValue}>{attempted}</div>
                </div>
              </div>
              <div className={style.resultBox}>
                <div className={style.iconBox}>
                  <AiFillCheckCircle
                    className={`${style.icon} ${style.greenIcon}`}
                  />
                </div>
                <div className={style.scoreBox}>
                  <div className={style.scoreLabel}>Corrected</div>
                  <div className={style.scoreValue}>{corrected}</div>
                </div>
              </div>
              <div className={style.resultBox}>
                <div className={style.iconBox}>
                  <AiFillCloseCircle
                    className={`${style.icon} ${style.redIcon}`}
                  />
                </div>
                <div className={style.scoreBox}>
                  <div className={style.scoreLabel}>Wrong Answer</div>
                  <div className={style.scoreValue}>
                    {attempted - corrected}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={style.percentageCardContainer}>
            <div className={style.percentageBox}>
              <div className={style.progressBar}>
                <CircularProgressWithLabel value={percentage} color="inherit" />
              </div>
              <div className={style.percentTypeHeading}>PERCENTAGE</div>
            </div>
            <div className={style.percentageBox}>
              <div className={style.progressBar}>
                <CircularProgressWithLabel value={percentile} />
              </div>
              <div className={style.percentTypeHeading} color="success">
                PERCENTILE
              </div>
            </div>
            <div className={style.percentageBox}>
              <div className={style.progressBar}>
                <CircularProgressWithLabel value={accuracy} color="secondary" />
              </div>
              <div className={style.percentTypeHeading}>ACCURACY</div>
            </div>
          </div>
          <div className={style.graphContainer}>
            <div className={style.graphType}>Overall Performance</div>
            <div className={style.graph}>
              <Doughnut data={data} />
            </div>
          </div>
          <div className={style.standingTable}>
            <div className={style.standingHeader}>Top 10</div>
            <div className={style.tableHeader}>
              <div className={style.col1}>Rank</div>
              <div className={style.col2}>Name</div>
              <div className={style.col3}>Score</div>
            </div>
            <div className={style.tableRowContainer}>
              {rankTally?.map((stand, idx) => {
                if (stand.rank > 10) return;
                return (
                  <div
                    className={`${style.tableRow} ${
                      rank == idx + 1 && style.yourRank
                    }`}
                    key={idx}
                  >
                    <div className={style.col1}>{stand.rank}</div>
                    <div className={style.col2}>{stand.name}</div>
                    <div className={style.col3}>{stand.score}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={style.questionContainer}>
            <div className={style.questionHeading}>All Questions</div>
            {questAns?.map((quest, idx) => {
              const getOptionText = (id) =>
                quest.options?.find((opt) => opt.optionId === id)?.option;

              return (
                <Accordion
                  expanded={expanded === idx}
                  onChange={handleChange(idx)}
                  key={idx}
                >
                  <AccordionSummary expandIcon={<AiOutlineDown />}>
                    <div className={style.questNumHeading}>
                      Question {idx + 1}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className={style.passage}>{quest.passage}</div>
                    <div className={style.questionText}>{quest.question}</div>
                    <div className={style.imageContainer}>
                      {quest.images?.map((img, index) => {
                        return (
                          <div className={style.imageBox} key={index}>
                            <Image
                              src={img.url}
                              layout="responsive"
                              objectFit="contain"
                              height="100%"
                              width="100%"
                              alt="QuestionImage"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className={style.status}>
                      Status:{" "}
                      {checkStatus(quest.attemptedAns, quest.correctAnswer)}
                    </div>
                    <div className={style.optionsContainer}>
                      <div className={style.correctAns}>
                        <span>Correct Ans:</span>
                        <br />
                        {getOptionText(quest.correctAnswer)}
                      </div>
                      {!!quest.attemptedAns &&
                        quest.attemptedAns != quest.correctAnswer && (
                          <div className={style.yourAns}>
                            <span>Your Answer:</span>
                            <br />
                            {getOptionText(quest.attemptedAns)}
                          </div>
                        )}
                    </div>
                    <div className={style.solution}>{quest.solution}</div>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <Footer />
    </>
  );
};

export default Result;
