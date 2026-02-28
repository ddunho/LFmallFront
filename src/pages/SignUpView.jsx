import SignUpForm from "../components/SignUpForm";

const SignUpView = () => {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <SignUpForm />
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: "#f5f5f5",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "60px 16px",
  },
  container: {
    background: "#fff",
    width: "100%",
    maxWidth: "480px",
    padding: "48px 40px 60px",
    borderTop: "2px solid #222",
    height: "fit-content",
  },
};

export default SignUpView;