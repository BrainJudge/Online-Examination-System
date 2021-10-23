import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/authContext";
import { useRouter } from "next/router";
import Spinner from "../../../components/Spinner";

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

const GoogleAuth = ({ data, status }) => {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const { name, email, token } = data.user.google;
  const userId = data.user._id;

  useEffect(() => {
    login(userId, { name, email }, token);
    router.push("/tests");
  }, []);

  if (status !== 201) {
    return <div>{props.data.message}</div>;
  }

  return (
    <div className="wrapper">
      <Spinner />
    </div>
  );
};

export default GoogleAuth;
