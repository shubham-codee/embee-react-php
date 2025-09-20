import { useEffect } from "react";
import { useNavigate } from "react-router";
import useErrorStore from "../stores/errorStore";
import { Button } from "@mui/material";

const ErrorPage = () => {
  const { errorMessage, errorCode } = useErrorStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!errorMessage) {
      navigate("/");
    }
  }, [errorMessage, navigate]);

  return (
    <>
      {errorMessage && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white text-gray-800">
          <h1 className="text-6xl font-bold mb-4">{errorCode}</h1>
          <h2 className="text-4xl font-bold mb-4">Something went wrong</h2>
          <p className="text-center max-w-md mb-6 text-lg text-gray-600">
            {errorMessage}
          </p>
          <div className="flex gap-4">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
            >
              Go to Home
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorPage;
