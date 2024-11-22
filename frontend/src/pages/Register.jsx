import axios from "axios";
import { useState } from "react";
import { V1APIURL } from "../shared/constants";

export const RegisterPage = ({ setPage, setUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const updateForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const res = await axios.post(`${V1APIURL}/auth/register`, formData);
      if (res.status !== 200) {
        alert("Failed to register");
        return false;
      }
      alert("Registration successful")
      setPage("login")

      // setUser({ ...res.data, username: formData.username });
    } catch (error) {
      console.log(error);
      alert("Error, please try again.");
      // alert(
      //   "Your registration failed, you will be redirected to the dashboard, this is a development mode feature since we assume the backend is down or not ready."
      // );
      // setUser({ token: "###", expiration: 7000, username: formData.username });
    }
    return false;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 col-lg-4 offset-lg-4 offset-md-3 py-5">
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <h2>Register</h2>
            </div>
            <div className="mb-4">
              <label htmlFor="username">Username</label>
              <input
                className="form-control"
                name="username"
                type="text"
                onChange={updateForm}
                required={true}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                name="password"
                type="password"
                onChange={updateForm}
                required={true}
              />
            </div>
            <div className="mb-4 text-center">
              <button className="btn btn-primary" type="submit">
                <i className="fa fa-sign-in"></i>&nbsp;Register
              </button>
            </div>
          </form>
          <div className="mb-4 text-center">
            <button className="btn btn-link" onClick={() => setPage("login")}>
              <i className="fa fa-user"></i>&nbsp;Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
