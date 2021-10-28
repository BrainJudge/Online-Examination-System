import style from "../styles/Home.module.css";
import { AiOutlineGoogle } from "react-icons/ai";
import Link from "next/link";
import { AuthContext } from "../context/authContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import Head from "next/head";

export default function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.push("/tests");
    else router.push("/");
  }, [isLoggedIn]);

  return (
    <>
      <Head>
        <title>BrainJudge</title>
        <meta name="description" content="free online test management system" />
        <meta name="google-site-verification" content="CWqtskCtMnK36IHe9EDSGORCaZqd720FwNVY65evyvI" />
      </Head>
      <div className={style.container}>
        <div className={style.loginContainer}>
          <div className={style.top}>
            <div className={style.header}>
              <img src="/Images/BrandLogo1.png" alt="brand" />
            </div>
            <div className={style.body}>
              <div className={style.heading1}>Let&apos;s get started</div>
              <div className={style.heading2}>
                Make this app your personal assistant
              </div>
            </div>
          </div>
          <div className={style.bottom}>
            <Link
              href={process.env.NEXT_PUBLIC_STUDENT_API + "/auth/google"}
              passHref
            >
              <button className={style.googlebtn}>
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
      <Footer />
    </>
  );
}
