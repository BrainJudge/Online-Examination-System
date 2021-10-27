import "../styles/globals.css";
import { AuthContext } from "../context/authContext";
import { useAuth } from "../customHooks/authHook";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import "../styles/nProgress.css";
import { useEffect } from "react";

//toast notification
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Flip } from "react-toastify";

function MyApp({ Component, pageProps }) {
  const auth = useAuth();
  const authContextValue = {
    isLoggedIn: !!auth.token,
    userId: auth.userId,
    personalInfo: auth.personalInfo,
    token: auth.token,
    login: auth.login,
    logout: auth.logout,
  };

  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`);
      NProgress.start();
    };

    const handleStop = () => NProgress.done();

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <>
      <ToastContainer
        theme="theme"
        pauseOnFocusLoss={false}
        draggable
        closeOnClick
        toastStyle={{ backgroundColor: "black", color: "white" }}
        transition={Flip}
      />
      <AuthContext.Provider value={authContextValue}>
        <Component {...pageProps} />
      </AuthContext.Provider>
    </>
  );
}

export default MyApp;
