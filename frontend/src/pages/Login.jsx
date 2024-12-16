import axios from "axios";
import { useState } from "react";
import {V1APIURL} from "../shared/constants"
import {getAxios} from "../shared/utils";

export const LoginPage = ({setPage, setUser}) => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const updateForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(`${V1APIURL}/auth/login`, formData, getAxios())
      if (res.status !== 200) {
        alert("Wrong creds")
        return false
      }
      const data = {...res.data, username: formData.username}
      res = await axios.get(`${V1APIURL}/auth/current`, {headers: { Authorization: `Bearer ${data.token}` }})
      if (res.status !== 200) {
        alert("Failed to fetch user")
        return false
      }
      localStorage.setItem("token", res.data.token)
      setUser({...res.data, ...data})
    } catch (error) {
      console.log(error)
      alert("Error, please try again.");
    }
    return false;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 col-lg-4 offset-lg-4 offset-md-3 py-5">
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <h2>Login</h2>
            </div>
            <div className="mb-4">
              <label htmlFor="username">Username</label>
              <input className="form-control" name="username" type="text" onChange={updateForm} required={true} />
            </div>
            <div className="mb-4">
              <label htmlFor="password">Password</label>
              <input className="form-control" name="password" type="password" onChange={updateForm} required={true} />
            </div>
            <div className="mb-4 text-center">
              <button className="btn btn-primary" type="submit">
                <i className="fa fa-sign-in"></i>&nbsp;Login
              </button>
            </div>
          </form>
            <div className="mb-4 text-center">
              <button className="btn btn-link" onClick={() => setPage("register")}>
                <i className="fa fa-user"></i>&nbsp;Register
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};
