import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import "./Login.css";
import Capture from "../images/Capture.PNG";
import axios from 'axios';


export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassword: 0,
      Login: {
        email_id: "",
        password: "",
      },
      resStatus: {
        isError: false,
        message: []
      },
      redirect: false,
    };

    this.togglePassword = this.togglePassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.loginBtn = this.loginBtn.bind(this);
  }

  togglePassword(e) {
    this.setState({
      showPassword: !this.state.showPassword
    })
  }

  handleChange(e) {
    var login = this.state.Login;
    login[e.target.name] = e.target.value;
    this.setState({ Login: login });
  };

  loginBtn() {
    var thizz = this;
    axios({
      method:"post",
      url: process.env.REACT_APP_BASE_URL + "/api/login",
      data: thizz.state.Login
    }).then((response) => {
         //handle success
         if (response.data.status === true && response.data.tokenKey) {
           localStorage.setItem("AUTH_TOKEN", response.data.tokenKey);
           thizz.setState({ redirect: true });
         }
    }).catch((error) => {
      console.log(error.response.data.status);
    })

  }

  render() {

    if (localStorage.getItem("AUTH_TOKEN")) {
      return <Navigate to="/" />;
    }
    return (
      <>
        <div className="banner">
          <img src={Capture} alt="" />
        </div>
        <div className="login">
          <div className="container mt-3 back">
            <h3 className="text-center log">LOGIN</h3>
            <form>
              <div className="mb-3 mt-3">
                <label for="email">Email:</label>
                <input type="email" className="form-control"  placeholder="Enter email" name="email_id" value={this.state.Login.email_id} onChange={this.handleChange}/>
              </div>
              <div className="mb-3">
                <label for="pwd">Password:</label>
                <input type="password" className="form-control"  placeholder="Enter password" name="password" value={this.state.Login.password}  onChange={this.handleChange}/>
              </div>
              <div className="form-check mb-3 rem">
                <label className="form-check-label">
                  <input className="form-check-input" type="checkbox" name="remember" />Remember me
                </label>
              </div>
              <a href="#"><p className="forgot">Forgot Password ?</p></a>
              <button type="button" className="btn btn-primary butt" onClick={this.loginBtn} >Login</button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
