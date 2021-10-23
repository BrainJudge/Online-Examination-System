import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/authContext";
import { useRouter } from "next/router";
import Spinner from "../../../components/Spinner";

const GoogleAuth = (props) => {
  if (props.status !== 201) {
    return <div>{props.data.message}</div>;
  }

  const { login } = useContext(AuthContext);
  const router = useRouter();
  const { name, email, token } = props.data.user.google;
  const userId = props.data.user._id;
  useEffect(() => {
    login(userId, { name, email }, token);
    router.push("/tests");
  }, []);
  return (
    <div className="wrapper">
      <Spinner />
    </div>
  );
};

export default GoogleAuth;

export async function getServerSideProps(context) {
  const { id } = context.query;
  const data = await fetch(
    process.env.NEXT_PUBLIC_STUDENT_API + "/auth/getUserById",
    {
      method: "POST",
      body: JSON.stringify({ userId: id }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const res = await data.json();

  return {
    props: {
      data: res,
      status: data.status,
    },
  };
}
