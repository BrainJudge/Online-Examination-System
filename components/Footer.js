import style from "../styles/Footer.module.css";
import { useHttpClient } from "../customHooks/httpHook";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { useState } from "react";

const Footer = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    setTimeout(() => {
      const api_url = `${process.env.NEXT_PUBLIC_STUDENT_API}/feedback/contact`;
      sendRequest(api_url, "POST", JSON.stringify({ email, message }), {
        "Content-Type": "application/json",
      })
        .then((res) => {
          if (res.status === 201) toast.success(res.message);
          else toast.warn(res.message);
        })
        .catch((err) => toast.error(err.message));
    }, 2000);
  };

  return (
    <footer className={style.footerdistributed}>
      <div className={style.footerleft}>
        <img src="/Images/BrandLogo1.png" alt="Brand" />
        <div className={style.owner}>
          <div className={style.footercompanyname}>BrainJudge © 2021</div>
          <div className={style.footercompanyname}>
            Designed, developed and maintained <br />
            <span>by Modassir</span>
          </div>
        </div>

        <div className="footericons">
          <a href="https://github.com/Ali-Modassir">
            <FaGithub className={`${style.icons} ${style.github}`} />
          </a>
          <a href="https://www.linkedin.com/in/modassirali">
            <FaLinkedin className={`${style.icons} ${style.linkedin}`} />
          </a>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=alimodassir@gmail.com&su=BrainJudge_User_FeedBack">
            <SiGmail className={`${style.icons} ${style.gmail}`} />
          </a>
        </div>
      </div>
      <div className={style.footerright}>
        <p>Contact Us</p>
        <div className={style.form}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            name="message"
            placeholder="Message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button disabled={isLoading} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
