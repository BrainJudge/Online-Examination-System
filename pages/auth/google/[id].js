export async function getServerSideProps(context) {
  const { id } = context.query;
  const data = await fetch("http://localhost:5000/auth/getUserById", {
    method: "POST",
    body: JSON.stringify({ userId: id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await data.json();

  return {
    props: {
      data: res,
      status: data.status,
    },
  };
}

const GoogleAuth = (props) => {
  console.log(props);
  if (props.status !== 201) {
    return <div>{props.data.message}</div>;
  }
  return <div>Logged in Successfully....Redirecting</div>;
};

export default GoogleAuth;
