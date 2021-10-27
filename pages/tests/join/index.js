import style from "../../../styles/Join.module.css";
import ContestCard from "../../../components/ContestCard";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Head from "next/head";

export const getServerSideProps = async () => {
  const api_url = `${process.env.NEXT_PUBLIC_STUDENT_API}/test/getAllTests`;
  const data = await fetch(api_url);
  const res = await data.json();
  return {
    props: {
      allTests: res.allTests,
      status: data.status,
    },
  };
};

const Test = ({ allTests, status }) => {
  if (status !== 200) return <div>Unable to fetch the courses</div>;
  return (
    <>
      <Head>
        <title>Test Series and Contests</title>
        <meta name="description" content="free online test management system" />
      </Head>
      <Navbar />
      <div className="wrapper">
        <div className={style.container}>
          <div className={style.containerHeading}>TEST SERIES AND CONTEST</div>
          <div className={style.testCardContainer}>
            {allTests?.map((test, idx) => {
              return <ContestCard props={test} key={idx} />;
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Test;
