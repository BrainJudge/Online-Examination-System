import style from "../../styles/Tests.module.css";
import { useRouter } from "next/router";
const Tests = () => {
  const router = useRouter();
  return (
    <div className={style.container}>
      <div className={style.box} onClick={() => router.push("/tests/join")}>
        Join a Test
      </div>
      <div className={style.box}>Host a Test</div>
    </div>
  );
};

export default Tests;
