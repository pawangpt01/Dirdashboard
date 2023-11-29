import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Logo from '../images/logo.png';
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
      method: "post",
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
        <nav className="navbar navbar-expand-lg ">
          <a className="navbar-brand" > <img src={Logo} width="120px" height="auto" alt="logo" /></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
            </ul>
            <h3 className="ignu">DIRECTOR DASHBOARD</h3>
          </div>
        </nav>
        <h3 className="text-center ignit">IGNITING THE URBAN ECOSYSTEM</h3>
        <div className="total">
          <div className="row form-setting">
            <div className="col-md-8">
              <div className="bann">
                <img src={Capture} alt="" />
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="login card">
                <div className="back1">
                  <h3 className="text-center log1">LOGIN</h3>
                  <form>
                    <div className="mb-3">
                      <input type="email" className="form-control" placeholder="Enter Username/Email" name="email_id" value={this.state.Login.email_id} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                      <input type="password" className="form-control"  placeholder="Enter Password" name="password" value={this.state.Login.password}  onChange={this.handleChange} />
                    </div>
                    <div className="form-check rem1">
                    <button type="button" className="btn btn-primary butt" onClick={this.loginBtn} >Login</button>
                    </div>
                    <a href="#"><p className="forgot1">Forgot Password ?</p></a>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <p className="footer-text text-center">THE NIUA APPROACH</p>
        </div>
      </>
    );
  }
}

export default Login;
