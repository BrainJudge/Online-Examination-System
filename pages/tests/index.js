import style from "../../styles/Tests.module.css";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Head from "next/head";
const Tests = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Tests</title>
        <meta name="description" content="free online test management system" />
      </Head>
      <Navbar />
      <div className={style.container}>
        <div className={style.box} onClick={() => router.push("/tests/join")}>
          STUDENT
        </div>
        <div className={style.box}>ORGANIZER</div>
      </div>
      <Footer />
    </>
  );
};

export default Tests;
