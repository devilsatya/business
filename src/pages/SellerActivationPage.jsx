import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const res = await axios.post(`${server}/shop/activation`, {
            activation_token,
          });
          console.log("Activation response:", res);
          setMessage("Your account has been created successfully!");
        } catch (err) {
          console.error("Activation error:", err);
          if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError("An error occurred. Please try again.");
          }
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  const handleResend = async () => {
    if (!email) {
      setError("Please provide your email address.");
      return;
    }

    setResending(true);
    try {
      const res = await axios.post(`${server}/shop/resend-activation`, { email });
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      console.error("Resend activation error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {error ? (
        <>
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          {error.includes("expired") && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "10px",
                  width: "300px",
                  marginRight: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <button
                onClick={handleResend}
                disabled={resending}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: resending ? "not-allowed" : "pointer",
                }}
              >
                {resending ? "Resending..." : "Resend Activation Email"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p style={{ color: "green", textAlign: "center" }}>
          {message || "Activating your account..."}
        </p>
      )}
    </div>
  );
};

export default SellerActivationPage;
