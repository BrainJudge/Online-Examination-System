import Head from "next/head";
import Image from "next/image";
import style from "../styles/Home.module.css";
import { AiOutlineGoogle } from "react-icons/ai";
import { useHttpClient } from "../customHooks/httpHook";
import Link from "next/link";

export default function Home() {
  const { sendRequest, isLoading } = useHttpClient();
  const loginHandler = async () => {
    const data = await sendRequest("http://localhost:5000/auth/google");
    console.log(data);
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.loginContainer}>
          <div className={style.top}>
            <div className={style.header}>BrainJudge</div>
            <div className={style.body}>
              <div className={style.heading1}>Let's get started</div>
              <div className={style.heading2}>
                Make the school app your personal assistant
              </div>
            </div>
          </div>
          <div className={style.bottom}>
            <Link href="http://localhost:5000/auth/google">
              <button className={style.googlebtn} onClick={loginHandler}>
                <AiOutlineGoogle
                  style={{ fontSize: "20px", marginRight: "5px" }}
                />
                Continue with Google
              </button>
            </Link>
            <div className={style.instruction}>
              Use Institute Email Id for authentication
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
