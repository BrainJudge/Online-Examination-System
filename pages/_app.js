import "../styles/globals.css";
import { AuthContext } from "../context/authContext";
import { useAuth } from "../customHooks/authHook";

//toast notification
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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

  return (
    <>
      <ToastContainer
        theme="theme"
        pauseOnFocusLoss={false}
        draggable
        closeOnClick
        toastStyle={{ backgroundColor: "black", color: "white" }}
      />
      <AuthContext.Provider value={authContextValue}>
        {/* <Navbar /> */}
        <Component {...pageProps} />
      </AuthContext.Provider>
    </>
  );
}

export default MyApp;
