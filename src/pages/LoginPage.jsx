import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import Swal from "sweetalert2";
import validator from "validator";
import axios from "../axios";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../store/actions";
import setUserLogin from "../store/actions/setUserLogin";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useHistory();
  const [user, setUser] = useState({ email: "", password: "" });
  const [userStatus, setUserStatus] = useState("");

  useEffect(() => {
    if (localStorage.vendor_access_token) {
      router.push("/dashboard");
    }
  }, []);

  const handleInput = (target, value) => {
    switch (target) {
      case "email":
        setUser({ ...user, email: value });
        break;
      case "password":
        setUser({ ...user, password: value });
        break;
      case "status":
        setUserStatus(value);
        break;
      default:
        setUser(user);
        break;
    }
  };

  const handleSubmitButton = async () => {
    try {
      const errors = [];
      if (!user.email) errors.push("Email cannot be empty");
      if (!validator.isEmail(user.email))
        errors.push("Input should be a valid email");
      if (!user.password) errors.push("Password cannot be empty");
      if (user.password.length < 6)
        errors.push("Passwords must have at least 6 characters");

      if (errors.length !== 0) {
        // * Error Validation Forms
        Swal.fire({
          title: "Oops...",
          icon: "error",
          html: `
          <div className="ml-5 text-left">
            ${errors.join("<br/>")}
          </div>
          `,
        });
      } else {
        if (userStatus === "Vendor") {
          const { data } = await axios({
            method: "POST",
            url: "/vendors/login",
            data: user,
          });
          localStorage.setItem("vendor_access_token", data.accessToken); // * Set access_token in local storage
          localStorage.setItem(
            "userInfo",
            JSON.stringify({ id: data._id, fullName: data.fullName })
          );
          dispatch(
            setUserLogin({
              id: data._id,
              fullName: data.fullName,
            })
          );
          dispatch(setIsLogin(true));
          router.push({
            pathname: "/dashboard",
            state: {
              id: data._id,
              fullName: data.fullName,
            },
          }); // * Change into HomePage
        } else {
          const { data } = await axios({
            method: "POST",
            url: "/users/login",
            data: user,
          });
          localStorage.setItem(
            "userInfo",
            JSON.stringify({ id: data._id, fullName: data.fullName })
          );
          localStorage.setItem("access_token", data.accessToken); // * Set access_token in local storage
          dispatch(setIsLogin(true));
          dispatch(
            setUserLogin({
              id: data._id,
              fullName: data.fullName,
            })
          );
          router.push("/"); // * Change into HomePage
        }
      }
    } catch ({
      response: {
        data: { message: errorMessage },
      },
    }) {
      // * Error from API Request to server
      Swal.fire({
        title: "Oops...",
        icon: "error",
        text: errorMessage,
      });
    }
  };
  return (
    <>
      <div className="row bg-blue-dark nunito" style={{ minHeight: "88.7vh" }}>
        <div className="col-5 russo-one ">
          <div className="mt-5 display-2 ml-5 pt-5 text-white">Login.</div>
          <div className="ml-4 pl-3">
            <p className="ml-3 text-secondary">
              Don't have any account? <Link to="/register">Register here.</Link>
            </p>
          </div>
        </div>
        <div className="col-7 pt-3 px-5">
          <div className="card shadow-lg bg-card2">
            <div className="rounded">
              <div className="px-auto pt-5 pb-5 mx-4">
                <div className="input-group mb-2 mt-4">
                  <div className="input-group-prepend">
                    <div className="input-group-text">@</div>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    required
                    value={user.email}
                    onChange={(e) => handleInput("email", e.target.value)}
                  />
                </div>
                <div className="input-group mb-2 mt-4">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fa fa-lock p-auto"></i>
                    </div>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required
                    value={user.password}
                    onChange={(e) => handleInput("password", e.target.value)}
                  />
                </div>
                <div className="text-center text-secondary py-2">
                  <h5>
                    <strong>Login as</strong>
                  </h5>
                </div>
                <div className="row mx-3">
                  <div className="col-6 input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <input
                          type="radio"
                          name="category"
                          aria-label="Radio button for following text input"
                          value="Vendor"
                          onClick={(e) => handleInput("status", e.target.value)}
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      aria-label="Text input with radio button"
                      disabled
                      value="Vendor"
                    />
                  </div>

                  <div className="col-6 input-group">
                    <div className="input-group-prepend">
                      <div className="input-group-text">
                        <input
                          type="radio"
                          value="User"
                          name="category"
                          aria-label="Radio button for following text input"
                          onClick={(e) => handleInput("status", e.target.value)}
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      aria-label="Text input with radio button"
                      disabled
                      value="User"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn bg-gold mt-4 px-5 regbtn"
                    onClick={() => handleSubmitButton()}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
