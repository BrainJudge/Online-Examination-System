import style from "../../styles/Tests.module.css";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
const Tests = () => {
  const router = useRouter();
  return (
    <>
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
