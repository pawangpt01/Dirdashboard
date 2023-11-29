import React, { Component } from "react";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import './ProjectPlan2.css';
// import moment from 'moment';
const axios = require("axios").default;

class ProjectPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centre: [],
      project: [],
      project_head: [],
      funding_agency: [],
      resStatus: {
        isError: false,
        messages: "",
      },
      singleFields: {
        centre_name: "",
        project_name: "",
        team_head: "",
        funding_ministry: "",
        project_brief: "",
        work_order: "",
        nodal_officer: "",
        contact_no: "",
        allocated_budget: "",
        start_date: "",
        end_date: "",
      },
      team_strength: [
        {
          team: "",
          position: "",
          experience: "",
          qualification: "",
          salary_slab: "",
        },
      ],
      finances: [
        {
          year: "",
          budget_head: "",
          allocated_fund: "",
          milestone: "",
        },
      ],
      project_activities: [
        {
          type: "",
          start_date: "",
          end_date: "",
          duration: "",
          activities: "",
          remarks: "",
        },
      ],

      other_activities: [
        {
          other_activity: "",
          other_date: "",
        },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleChangeMul = this.handleChangeMul.bind(this);
    this.handleRemoveSpecificRow = this.handleRemoveSpecificRow.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.diffDays = this.diffDays.bind(this);
    this.blankForm = this.blankForm.bind(this);
    this.validateYear = this.validateYear.bind(this);
  }

  validateYear(idx, e) {
    const { name, value } = e.target;
    var dateArr =  this.state.singleFields.start_date.split("-");
    var startYear = dateArr[0];

    var dateEndArr =  this.state.singleFields.end_date.split("-");
    var endYear = dateEndArr[0];

    var years = Array();
    for (var i = startYear; i <= endYear; i++) years.push(parseInt(i));
    // console.log(JSON.stringify(years));
    
      if(!years.includes(parseInt(value))) {
        alert("Please enter the year between the project duration");
        const finances = this.state.finances;
        finances[idx][name] = "";
        this.setState({
          finances: finances,
        });
        return false
      }

 }
  blankForm(){
    var singleFields = {
      centre_name: "",
      project_name: "",
      team_head: "",
      funding_ministry: "",
      project_brief: "",
      work_order: "",
      nodal_officer: "",
      contact_no: "",
      allocated_budget: "",
      start_date: "",
      end_date: "",
      overall_progress: "",
    }
    var team_strength= [
      {
        team: "",
        position: "",
        experience: "",
        qualification: "",
        salary_slab: "",
      },
    ]
    var finances= [
      {
        year: "",
        budget_head: "",
        allocated_fund: "",
        milestone: "",
      },
    ]
    var project_activities = [
      {
        type: "",
        start_date: "",
        end_date: "",
        duration: "",
        activities: "",
        remarks: "",
      },
    ]

    var other_activities = [
      {
        other_activity: "",
        other_date: "",
      },
    ]
    this.setState({singleFields: singleFields, team_strength: team_strength,
    finances: finances, project_activities: project_activities,
  other_activities: other_activities})
  }
  diffDays(date3, date4) {
    var date1 = new Date(date3);
    var date2 = new Date(date4);

    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days;
  }

  componentDidMount() {
    axios.get(process.env.REACT_APP_BASE_URL + "/api/admin/fetch-master-data")
      .then((response) => {
        var centre = response.data.centres
        var project = response.data.projects
        var team = response.data.teams
        var agency = response.data.agencys


        this.setState({
          centre: centre,
          project: project,
          project_head: team,
          funding_agency: agency,
        })

      }).catch((error) => {
        console.log(error.response);
      })

  }


  //Submit Form
  submitForm() {
    var thizz = this;
    var myObj = {
      FormData: thizz.state.singleFields,
      team_strength: thizz.state.team_strength,
      finances: thizz.state.finances,
      project_activities: thizz.state.project_activities,
      other_activities: thizz.state.other_activities
    }
    //Send request to backend
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/api/admin/project-plan",
      data: myObj
    }).then(function (response) {
      var data = response.data
      if (data.status === true && data) {
        var resStatus = thizz.state.resStatus;
        resStatus.isError = true;
        resStatus.messages = data.message;
        thizz.setState({ resStatus: resStatus });
        thizz.blankForm();
      }

    }).catch(function (error) {
      console.log(error.response)
      var data = error.response.data;
      if (error.response.data.status === false) {
        var resStatus = thizz.state.resStatus;
        resStatus.messages = data.message;
        thizz.setState({ resStatus: resStatus });
      }
    })

  }


  // For simple fields
  handleChange(e) {
    let singleField = this.state.singleFields;
    singleField[e.target.name] = e.target.value;
    this.setState({ singleFields: singleField });
  }

  // SET MULTIPLE ROW
  handleChangeMul(idx, e, type) {
    
    if (type === "teamStrength") {
      const { name, value } = e.target;
      const team_strength = this.state.team_strength;
      team_strength[idx][name] = value;
      this.setState({
        team_strength: team_strength,
      });
    } else if (type === "finances") {
      const { name, value } = e.target;
      const finances = this.state.finances;
      finances[idx][name] = value;
      this.setState({
        finances: finances,
      });
    } else if (type === "project_activities") {

      const { name, value } = e.target;
      const project_activities = this.state.project_activities;
      project_activities[idx][name] = value;

      var startDate = this.state.project_activities[idx]['start_date'];
      var endDate = this.state.project_activities[idx]['end_date'];
      if (startDate && endDate) {
        var days = this.diffDays(startDate, endDate);
        project_activities[idx]['duration'] = days;
      }
      this.setState({
        project_activities: project_activities,
      });





    } else if (type === "other_activities") {
      const { name, value } = e.target;
      const other_activities = this.state.other_activities;
      other_activities[idx][name] = value;
      this.setState({
        other_activities: other_activities,
      });
    }
  }

  handleRemoveSpecificRow(idx, type) {
    if (this.state.team_strength.length > 1 && type === "teamStrength") {
      const team_strength = this.state.team_strength;
      team_strength.splice(idx, 1);
      this.setState({ team_strength: team_strength });

    } else if (this.state.finances.length > 1 && type === "finances") {
      const finances = this.state.finances;
      finances.splice(idx, 1);
      this.setState({ finances: finances });

    } else if (this.state.project_activities.length > 1 && type === "project_activities") {
      const project_activities = this.state.project_activities;
      project_activities.splice(idx, 1);
      this.setState({ project_activities: project_activities });

    } else if (this.state.other_activities.length > 1 && type === "other_activities") {
      const other_activities = this.state.other_activities;
      other_activities.splice(idx, 1);
      this.setState({ other_activities: other_activities });
    }
  }

  handleAddRow(type) {
    // console.log('type of value '+type);
    if (type === "teamStrength") {
      const item = {
        team: "",
        position: "",
        experience: "",
        qualification: "",
        salary_slab: "",
      };
      this.setState({
        team_strength: [...this.state.team_strength, item],
      });
    } else if (type === "finances") {
      const item = {
        year: "",
        budget_head: "",
        allocated_fund: "",
        milestone: "",
      };
      this.setState({
        finances: [...this.state.finances, item],
      });
    } else if (type === "project_activities") {
      const item = {
        type: "",
        start_date: "",
        end_date: "",
        duration: "",
        activities: "",
        Remarks: "",
      };
      this.setState({
        project_activities: [...this.state.project_activities, item],
      });
    } else if (type === "other_activities") {
      const item = {
        other_activity: "",
        other_date: "",
      };
      this.setState({
        other_activities: [...this.state.other_activities, item],
      });
    }
  }

  render() {
    let centre = this.state.centre.map(function (center, index) {

      return <option key={center.id} value={center.centre_code}>{center.centre_name}</option>;
    })
    let project = this.state.project.map(function (project, index) {
      return <option key={project.id} value={project.project_code}>{project.project_name}</option>;

    })

    let team = this.state.project_head.map(function (team, index) {
      return <option key={team.id} value={team.employee_code}> {team.employee_name} </option>
    })

    let agency = this.state.funding_agency.map(function (agency, index) {
      return <option key={agency.id} value={agency.agency_code}>  {agency.agency_name} </option>
    })

    // var nDays = this.diffDays(new Date(), new Date());
    return (
      <>
        <Header />
        <Sidebar />
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="card card-primary">
                    <div className="card-header">
                      <h3 className="card-title"> Project Form-I </h3>
                    </div>
                    <form>

                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="centreName"> <span className="text-danger">*</span>Centre Name </label>
                              {/* {JSON.stringify(this.state.singleFields.centre_name)}ssss */}

                              <select
                                className="form-control "
                                name="centre_name"
                                id="centre_name"
                                value={this.state.singleFields.centre_name}
                                onChange={this.handleChange}
                              >
                                <option> select </option>
                                {centre}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="projectName"> <span className="text-danger">*</span> Project Name </label>
                              <select
                                className="form-control "
                                name="project_name"
                                id="project_name"
                                value={this.state.singleFields.project_name}
                                onChange={this.handleChange}
                              >
                                <option selected="selected"> select </option>
                                {project}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="projectHeadName">
                              <span className="text-danger">*</span>
                                Project Head Name
                              </label>
                              <select
                                className="form-control "
                                name="team_head"
                                id="team_head"
                                value={this.state.singleFields.team_head}
                                onChange={this.handleChange}
                              >
                                <option selected="selected"> select </option>
                                {team}
                              </select>
                            </div>
                          </div>
                          {/* <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="ProjectCode">Project Code</label>
                              <input
                                type="text"
                                className="form-control"
                                id="project_code"
                                name="project_code"
                                placeholder="Project Code"
                                value={this.state.singleFields.project_code}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div> */}
                          <div className="form-group col-md-6">
                            <label for="fundingMinistry/Agency/Dept">
                            <span className="text-danger">*</span>
                              Funding Ministry/Agency/Dept.
                            </label>
                            <select
                              className="form-control "
                              name="funding_ministry"
                              id="funding_ministry"
                              value={this.state.singleFields.funding_ministry}
                              onChange={this.handleChange}
                            >
                              <option selected="selected"> select </option>
                              {agency}
                            </select>
                          </div>
                        </div>
                        <div className="row ">
                          <div className="form-group col-md-6">
                            <label htmlFor="projectBrief" className="p">
                              Project Brief
                            </label>
                            <textarea
                              className="form-control "
                              id="project_brief"
                              name="project_brief"
                              placeholder="Project Brief"
                              value={this.state.singleFields.project_brief}
                              onChange={this.handleChange}
                            ></textarea>
                          </div>

                          <div className="form-group col-md-6">
                            <label htmlFor="workOrderNo" className="p">
                            <span className="text-danger">*</span>
                              Work Order No
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="work_order"
                              name="work_order"
                              placeholder="Work Order No"
                              value={this.state.singleFields.work_order}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>

                        <div className="row ">


                          <div className="form-group col-md-6">
                            <label htmlFor="nodalOfficerName" className="p">
                            <span className="text-danger">*</span>
                              Nodal Officer Name
                            </label>
                            <input
                              type="text"
                              className="form-control "
                              id="nodal_officer"
                              name="nodal_officer"
                              placeholder="Nodal Officer Name"
                              value={this.state.singleFields.nodal_officer}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label htmlFor="contactNo">
                            <span className="text-danger">*</span>
                              Contact no.
                              </label>
                            <input
                              type="number"
                              className="form-control"
                              id="contact_no"
                              name="contact_no"
                              value={this.state.singleFields.contact_no}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <div className="row ">
                          <div className="form-group col-md-6">
                            <label htmlFor="allocated_budget">
                            <span className="text-danger">*</span>
                              Allocated Budget
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="allocated_budget"
                              name="allocated_budget"
                              placeholder="Allocated Budget"
                              value={this.state.singleFields.allocated_budget}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label htmlFor="startDate"> <span className="text-danger">*</span>Start Date</label>
                            <input
                              type="date"
                              name="start_date"
                              id="start_date"
                              className="form-control"
                              value={this.state.singleFields.start_date}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <div className="row">

                          <div className="form-group col-md-6">
                            <label htmlFor="endDate">
                            <span className="text-danger">*</span>
                              End Date</label>
                            <input
                              type="date"
                              name="end_date"
                              id="end_date"
                              className="form-control"
                              value={this.state.singleFields.end_date}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>

                        <p className="lead"> Team Strength </p>
                        <table className="table">
                          <thead className="thead-dark">
                            <tr>
                              <th>S.No</th>
                              <th>Team Length</th>
                              <th>Position</th>
                              <th>Experience</th>
                              <th>Qualification</th>
                              <th>Salary Slab</th>
                              <th style={{ width: "100px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody id="tbl">
                            {this.state.team_strength.map((item, idx) => (
                              <tr key={"ts-" + idx}>
                                <td>{idx + 1}</td>
                                <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="Team Strength"
                                    placeholder="Team Strength"
                                    name="team"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "teamStrength")}
                                    value={item.team}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="position"
                                    placeholder="Designation"
                                    name="position"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "teamStrength")}
                                    value={item.position}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="experience"
                                    placeholder="Experience"
                                    name="experience"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "teamStrength")}
                                    value={item.experience}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="qualification"
                                    placeholder="Qualification"
                                    name="qualification"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "teamStrength")}
                                    value={item.qualification}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="salary_slab"
                                    placeholder="Salary slab"
                                    name="salary_slab"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "teamStrength")}
                                    value={item.salary_slab}
                                  />
                                </td>
                                <td>
                                  <button
                                    className="btn btn-danger btn-sm m-1"
                                    type="button"
                                    onClick={() => this.handleAddRow("teamStrength")}
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() => this.handleRemoveSpecificRow(idx, "teamStrength")
                                    }
                                  >
                                    -
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <p className="lead"> Finances </p>
                        <table className="table">
                          <thead className="thead-dark">
                            <tr>
                              <th>Year</th>
                              <th>Budget Head</th>
                              <th>Allocated Fund</th>
                              <th>Milestone</th>
                              <th style={{ width: "100px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody id="tbl2">
                            {this.state.finances.map((item, idx) => (
                              <tr key={"fin-" + idx}>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="year"
                                    placeholder="Year"
                                    name="year"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "finances")}
                                    value={item.year}
                                    onBlur ={(evnt) => this.validateYear(idx, evnt)}
                                  />
                                </td>
                                <td>
                                {/* <input
                                    type="text"
                                    className="form-control"
                                    id="budget_head"
                                    placeholder="Budget Head"
                                    name="budget_head"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "finances")}
                                    value={item.budget_head}
                                  /> */}
                                   <select
                                    className="form-control select2 select2-hidden-accessible"
                                    name="budget_head"
                                    id="budget_head"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "finances")}
                                    value={item.budget_head}
                                  >
                                    <option selected="selected">select</option>
                                    <option value="HR and Personnel Cost">HR and Personnel Cost</option>
                                    <option value="Hardware, Infrastructure and Cloud">Hardware, Infrastructure and Cloud</option>
                                    <option value="Travel and Logistic Cost">Travel and Logistic Cost</option>
                                    <option value="Office Expenses (Maintenance, Office space, rental, printing etc.)">Office Expenses (Maintenance, Office space, rental, printing etc.)</option>
                                    <option value="IEC, Workshops, Training">IEC, Workshops, Training</option>
                                    <option value="Survey, Research, Audits">Survey, Research, Audits</option>
                                    <option value="Direct funding for States/Cities">Direct funding for States/Cities</option>
                                    <option value="Program Specific Component">Program Specific Component</option>
                                    <option value="A & O">A & O</option>
                                    <option value="Contingency/Miscellaneous">Contingency/Miscellaneous</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="allocated_fund"
                                    placeholder="Allocated Fund"
                                    name="allocated_fund"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "finances")}
                                    value={item.allocated_fund}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="milestone"
                                    placeholder="Milestone"
                                    name="milestone"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "finances")}
                                    value={item.milestone}
                                  />
                                </td>
                                <td>
                                  <button
                                    className="btn btn-danger btn-sm m-1"
                                    type="button"
                                    onClick={() => this.handleAddRow("finances")}
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() => this.handleRemoveSpecificRow(idx, "finances")}
                                  >
                                    -
                                  </button>
                                </td>
                              </tr>
                            ))}

                          </tbody>
                        </table>

                        <p className="lead"> Project Activities </p>
                        <table className="table">
                          <thead className="thead-dark">
                            <tr>
                              <th style={{ width: "230px" }}>Type</th>
                              <th>Start Date</th>
                              <th>End Date</th>
                              <th> Duration <small>in days</small> </th>
                              <th style={{ width: "200px" }}>Activities</th>
                              <th style={{ width: "200px" }}> Remarks</th>
                              <th style={{ width: "100px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody id="tbl3">
                            {this.state.project_activities.map((item, idx) => (
                              <tr key={"pa-" + idx}>
                                <td>
                                  <select
                                    className="form-control select2 select2-hidden-accessible"
                                    name="type"
                                    id="type"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activities")}
                                    value={item.type}
                                  >
                                    <option selected="selected">select</option>
                                    <option value="major">Major</option>
                                    <option value="critical">Critical</option>
                                    <option value="remaining">Remaining</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    className="form-control"
                                    id="start_date"
                                    name="start_date"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activities")}
                                    value={item.start_date}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    className="form-control"
                                    id="end_date"
                                    name="end_date"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activities")}
                                    value={item.end_date}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="duration"
                                    id="duration"
                                    // onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activities")}
                                    value={item.duration}
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <textarea
                                    className="form-control "
                                    id="activities"
                                    name="activities"
                                    placeholder="Activities"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activities")}
                                    value={item.activities}
                                  ></textarea>
                                </td>
                                <td>
                                  <textarea
                                    className="form-control "
                                    id="remarks"
                                    name="remarks"
                                    placeholder="Remarks"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activities")}
                                    value={item.remarks}
                                  ></textarea>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-danger btn-sm m-1"
                                    type="button"
                                    onClick={() => this.handleAddRow("project_activities")}
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() => this.handleRemoveSpecificRow(idx, "project_activities")}
                                  >
                                    -
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <p className="lead"> Other Activities </p>
                        <table className="table">
                          <thead className="thead-dark">
                            <tr>
                              <th> Activities </th>
                              <th>Date</th>

                              <th style={{ width: "100px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody id="tbl4">
                            {this.state.other_activities.map((item, idx) => (
                              <tr key={"oa-" + idx}>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="other_activity"
                                    placeholder="Other Activity"
                                    name="other_activity"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "other_activities")}
                                    value={item.other_activity}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    className="form-control"
                                    id="other_date"
                                    placeholder="Position"
                                    name="other_date"
                                    onChange={(evnt) => this.handleChangeMul(idx, evnt, "other_activities")}
                                    value={item.other_date}
                                  />
                                </td>

                                <td>
                                  <button
                                    className="btn btn-danger btn-sm m-1"
                                    type="button"
                                    onClick={() => this.handleAddRow("other_activities")}
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() => this.handleRemoveSpecificRow(idx, "other_activities")}
                                  >
                                    -
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer row">
                        <div className="col-md-3">
                          <button type="button" className="btn btn-primary" onClick={this.submitForm}>
                            Submit
                          </button>
                        </div>
                        <div className="col-md-9">
                          {this.state.resStatus.messages !== '' ?
                            (<div className={"alert " + (this.state.resStatus.isError ? "alert-success" : "alert-danger")}> {this.state.resStatus.messages} </div>)
                            : ""}
                        </div>


                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* ------ */}
              {/* /.row */}
            </div>
            {/* /.container-fluid */}
          </div>
        </div>
        <aside className="control-sidebar control-sidebar-dark">
          {/* Control sidebar content goes here */}
        </aside>

        <Footer />
      </>
    );
  }
}

export default ProjectPlan;
