import React, { Component } from 'react'
import Capture from "../images/Capture.PNG";
import axios from 'axios';
export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassword: 0,
      Register: {
        first_name: "",
        last_name: "",
        email_id: "hvaidya@niua.org",
        password: "admin",
        employee_code: "",
        role:""
      },
      resStatus: {
        isError: false,
        message: []
      },
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.loginBtn = this.loginBtn.bind(this);
  }

  handleChange(e) {
    var register = this.state.Register;
    register[e.target.name] = e.target.value;
    this.setState({ Register: register });
  };

  
  loginBtn() {
    let thizz = this;
    axios({
      method:"post",
      url: process.env.REACT_APP_BASE_URL + "/api/create",
      data: thizz.state.Register
    }).then((response) => {
        console.log(response.data)
    }).catch((error) => {
      console.log(error.response.data.status);
    })
  }
  render() {
    return (
      <>
       <div className="banner">
          <img src={Capture} alt="" />
        </div>
        <div className="login">
          <div className="container mt-3 back">
            <h3 className="text-center log"> Register </h3>
            <form>
              <div className="mb-3 mt-3">
                <label htmlFor="first_name">First Name:</label>
                <input type="text" className="form-control" name="first_name" value={this.state.Register.first_name} onChange={this.handleChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="last_name">Last Name:</label>
                <input type="text" className="form-control" name="last_name" value={this.state.Register.last_name}  onChange={this.handleChange}/>
              </div>

             

              <div className="mb-3">
                <label htmlFor="email">Email Id:</label>
                <input type="email" className="form-control" name="email_id" value={this.state.Register.email_id}  onChange={this.handleChange}/>
              </div>

              <div className="mb-3">
                <label htmlFor="password">Password:</label>
                <input type="password" className="form-control" name="password" value={this.state.Register.password}  onChange={this.handleChange}/>
              </div>

              <div className="mb-3">
                <label htmlFor="employee_code">Employee Code:</label>
                <input type="text" className="form-control" name="employee_code" value={this.state.Register.employee_code}  onChange={this.handleChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="role">Role:</label>
               
                <select class="form-control form-control-sm" 
                name='role'
                onChange={this.handleChange}
                value= {this.state.Register.role}>
                <option > select </option>
                <option value="1"> ROLE_SUPER_ADMIN </option>
                  <option value="2"> ROLE_ADMIN </option>
                  <option value="3"> ROLE_STAFF </option>
                </select>
              </div>
             
              <button type="button" className="btn btn-primary butt" onClick={this.loginBtn}>LOGIN</button>
            </form>
          </div>
        </div>
      </>
    )
  }
}

export default Register