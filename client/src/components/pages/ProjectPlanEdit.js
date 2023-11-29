import React, { Component } from "react";
// import { useParams } from "react-router-dom";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import withRouter from '../withRouter';
import moment from 'moment';
const axios = require("axios").default;


class ProjectPlanEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centre: [],
      project: [],
      project_head: [],
      funding_agency: [],

      singleFields: {
        id: "",
        centre_name: "",
        project_name: "",
        project_head: "",
        project_code: "",
        project_brief: "",
        work_order: "",
        funding_agency: "",
        nodal_officer: "",
        contact_no: "",
        allocated_budget: "",
        start_date: "",
        end_date: "",
        overall_progress: "",
      },
      years: [],
      selectedYear: "",
      selectedYearProjectActivity: "",

      selectedQuarter: "",
      team_strength: [
        {
          team: "",
          position: "",
          experience: "",
          qualification: "",
          salary_slab: "",
          employee_code: "",
          employee_name: ""
        },
      ],
      finances: [],

      project_activity: [],
      default_activity: {
        id: "",
        project_master_activity_id: "",
        project_master_activity_name: "",
        project_master_sub_activity_id: "",
        project_master_sub_activity_name: "",
        project_master_sub_activity: [],
        start_date: "",
        end_date: "",
        expected_entries: 1,
        current_entries: 1,
        year: "",
        quarter: "",
        tasks: [{
          id: "",
          task: "",

        }]
      },

      project_master_activity: [],
      other_activities: [
        {
          other_activity: "",
          other_date: "",
        },
      ],
      resStatus: {
        isError: false,
        messages: "",
      },
      resStatusFinanceReceived: {
        isError: false,
        messages: "",
      },
      finance_recieved: [
        {
          amount_recieved: "",
          amount_recieved_date: "",
          amount_remark: "",
          project_plan_id: "",
          is_adjustment :false,
          year: ""
        },
      ],
      mous: [
        {
          year:"",
          key_deliverables: "",
          performance_indicators: "",
          output_target: "",
          status:""
        }
      ],
      external_agency: [
        {
          agency_name: "",
          agency_specification: "",
          type: "",
          amount: "",
        },
      ],

      totalAllocatedFund: 0.00,
      totalActualRecievedFund: 0.00,
      totalExpenditureFund: 0.00
    }
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onChangeYearProjectActivity = this.onChangeYearProjectActivity.bind(this);
    this.handleChangeQuarter = this.handleChangeQuarter.bind(this);
    // this.saveRows = this.saveRows.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.handleChangeMul = this.handleChangeMul.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleRemoveSpecificRow = this.handleRemoveSpecificRow.bind(this);
    this.handleSubActivity = this.handleSubActivity.bind(this);
    this.handleChangeMulTask = this.handleChangeMulTask.bind(this);
    this.handleAddRowTask = this.handleAddRowTask.bind(this);
    this.handleRemoveSpecificRowOfTask = this.handleRemoveSpecificRowOfTask.bind(this);
    this.submitActivity = this.submitActivity.bind(this);
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
        const mous = this.state.mous;
        mous[idx][name] = "";
        this.setState({
          mous: mous,
        });
        return false
      }

 }


  // For simple fields
  handleChangeQuarter(e) {
    this.setState({ selectedQuarter: e.target.value });
  }

  submitActivity() {
    var thizz = this;

    //Send request to backend
    axios({
      method: "post",
      url: process.env.REACT_APP_BASE_URL + "/api/admin/save-finances-by-year-project/" + thizz.state.selectedYearProjectActivity + "/" + thizz.props.params.id,
      data: thizz.state.project_activity
    }).then(function (response) {
      var data = response.data
      if (data.status === true && data) {
        alert(data.message)
      }

    }).catch(function (error) {
      console.log(error.response.data)
      var data = error.response.data;
      if (error.response.data.status === false) {
        alert('Error:' + data.message)
      }
    })
  }

  handleChangeMulTask(pidx, cidx, e, type) {
    const { name, value } = e.target;
    const project_activity = this.state.project_activity;
    project_activity[pidx]['tasks'][cidx][name] = value;
    this.setState({
      project_activity: project_activity,
    });
  }

  handleChangeMul(idx, e, type) {
    console.log(idx, e.target.name, type);
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
      let total = 0.00
      finances.forEach(element => {
        if (element.expenditure && !isNaN(element.expenditure)) {
          total += parseFloat(element.expenditure)
        }
      })

      this.setState({
        finances: finances,
        totalExpenditureFund: total
      });
    } else if (type === "project_activity") {
      const { name, value } = e.target;
      const project_activity = this.state.project_activity;
      project_activity[idx][name] = value;
      console.log(idx)
      console.log(project_activity[idx][name])
      this.setState({
        project_activity: project_activity,
      });
      console.log(this.state.project_activity)
    } else if (type === "other_activities") {
      const { name, value } = e.target;
      const other_activities = this.state.other_activities;
      other_activities[idx][name] = value;
      this.setState({
        other_activities: other_activities,
      });
    } else if (type === "externalAgency") {
      const { name, value } = e.target;
      const external_agency = this.state.external_agency;
      external_agency[idx][name] = value;
      this.setState({
        external_agency: external_agency,
      });
    } else if (type === "mous") {
      const { name, value } = e.target;
      const mous = this.state.mous;
      mous[idx][name] =  value;
      this.setState({
        mous:mous
      })
    }
  }

  // set Project Activity year wise 
  onChangeYearProjectActivity(e) {
    var thizz = this;
    thizz.setState({
      selectedYearProjectActivity: e.target.value
    })
    if (!e.target.value) {
      alert("Please select year first");
      return
    }
    axios.get(process.env.REACT_APP_BASE_URL + "/api" +
      "/admin/fetch-project-activity/" + e.target.value + "/" + this.props.params.id)
      .then((response) => {
        console.log(response.data);
        if (response.data.project_activity.length > 0) {
          thizz.setState({
            project_activity: response.data.project_activity
          })
        } else {
          var obj = {
            id: "",
            project_master_activity_id: "",
            project_master_activity_name: "",
            project_master_sub_activity_id: "",
            project_master_sub_activity_name: "",
            project_master_sub_activity: [],
            start_date: "",
            end_date: "",
            expected_entries: 1,
            current_entries: 1,
            year: "",
            quarter: "",
            tasks: [{
              id: "",
              task: "",

            }]
          }
          thizz.setState({
            project_activity: [obj]
          })
        }


      }).catch((error) => {
        console.log(error.response.data);
      })
  }

  onChangeYear(e) {
    var thizz = this
    this.setState({ selectedYear: e.target.value })

    // for received amount 
    if (e.target.value) {
      var finance_recieved = this.state.finance_recieved;
      finance_recieved.year = e.target.value;
      this.setState({
        finance_recieved: finance_recieved
      })
    }


    if (!e.target.value) {
      this.setState({
        finances: []
      })
    }
    axios.get(process.env.REACT_APP_BASE_URL + "/api" +
      "/admin/fetch-finances-by-year-project/" + e.target.value + "/" + this.state.singleFields.id)
      .then((response) => {
        // console.log(response.data.finances)
        var financeesList = [];
        for (let i = 0; i < response.data.finances.length; i++) {
          var item = response.data.finances[i]
          financeesList.push({
            year: item.year,
            project_plan_id: item.project_plan_id,
            budget_head: item.budget_head,
            allocated_fund: item.allocated_fund,
            milestone: item.milestone,
            quarter: thizz.state.selectedQuarter,
            expenditure: item.expenditure,
            finance_id: item.id
          })
        }
        let total = 0.00
        financeesList.forEach(element => {
          if (element.expenditure && !isNaN(element.expenditure)) {
            total += parseFloat(element.expenditure)
          }
        })

        let total2 = 0.00
        response.data.finance_received.forEach(element => {
          if (element.amount_recieved && !isNaN(element.amount_recieved)) {
            total2 += parseFloat(element.amount_recieved)
          }
        })
        this.setState({
          finances: financeesList,
          totalAllocatedFund: response.data.total,
          totalExpenditureFund: total,
          totalActualRecievedFund: total2,
          finance_recieved: response.data.finance_received.length > 0 ? response.data.finance_received : finance_recieved
        })

      }).catch((error) => {
        console.log(error.response.data);
      })
  }


  handleSubActivity(idx, e) {
    var thizz = this

    if (!e.target.value) {
      alert("Please select activity first");
      return
    }
    axios.get(process.env.REACT_APP_BASE_URL + "/api" +
      "/admin/subactivity/" + e.target.value)
      .then((response) => {
        console.log(response.data);
        const project_activity = this.state.project_activity;
        project_activity[idx]['project_master_sub_activity'] = response.data.project_master_sub_activity;
        thizz.setState({
          project_activity: project_activity,
        });



      }).catch((error) => {
        console.log(error.response.data);
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
      other_activities: thizz.state.other_activities,
      finance_recieved: thizz.state.finance_recieved,
      mous: thizz.state.mous
    }
    //Send request to backend
    axios({
      method: "put",
      url: process.env.REACT_APP_BASE_URL + "/api/admin/project-plan",
      data: myObj
    }).then(function (response) {
      var data = response.data
      if (data.status === true && data) {
        var resStatus = thizz.state.resStatus;
        resStatus.isError = true;
        resStatus.messages = data.message;
        thizz.setState({ resStatus: resStatus });
      }

    }).catch(function (error) {
      console.log(error.response.data)
      var data = error.response.data;
      if (error.response.data.status === false) {
        var resStatus = thizz.state.resStatus;
        resStatus.messages = data.message;
        thizz.setState({ resStatus: resStatus });
      }
    })

  }


  componentDidMount() {
    console.log('Props:', this.props.params.id);
    var finance_recieved = this.state.finance_recieved
    finance_recieved.project_plan_id = this.props.params.id

    this.setState({
      finance_recieved: finance_recieved
    });

    axios.get(process.env.REACT_APP_BASE_URL + "/api/admin/project-plan/" + this.props.params.id)
      .then((response) => {
        this.setState({
          singleFields: response.data.data,
          years: response.data.years,
          centre: response.data.centres,
          project: response.data.projects,
          project_head: response.data.team_leader,
          funding_agency: response.data.agencys,
          project_master_activity: response.data.project_master_activity,
           
        });

        //Set Mou's data 
        if(typeof response.data.mou !== 'undefined' && response.data.mou.length > 0) {
          this.setState({
            mous:response.data.mou
          })
        }

        var financeesList = [];
        for (let i = 0; i < response.data.teamStrength.length; i++) {
          var eachItem = response.data.teamStrength[i]
          var teamLength = eachItem.team
          var teamByTeamStrength = response.data.teams.filter(
            function (x) { return x.team_strength_id === eachItem.id }
          )
          var totalLength = teamByTeamStrength.length
          for (let j = 0; j < totalLength; j++) {
            var item = teamByTeamStrength[j]
            financeesList.push({
              id: item.id,
              project_plan_id: item.project_plan_id,
              remark: item.remark,
              team_strength_id: eachItem.id,
              position: item.position,
              experience: item.experience,
              qualification: item.qualification,
              salary_slab: item.salary_slab,
              employee_code: item.employee_code,
              employee_name: item.employee_name,
            })
          }
          var pendingTeamCount = teamLength - totalLength;
          if (pendingTeamCount > 0) {
            for (let j = 0; j < pendingTeamCount; j++) {

              financeesList.push({
                team_strength_id: eachItem.id,
                project_plan_id: eachItem.project_plan_id,
                remark: "",
                position: eachItem.position,
                experience: eachItem.experience,
                qualification: eachItem.qualification,
                salary_slab: eachItem.salary_slab,
                employee_code: '',
                employee_name: '',
              })
            }
          }
        }
        //var totalTeamStren
        this.setState({ team_strength: financeesList })
        financeesList = [];
        for (let i = 0; i < response.data.projectActivity.length; i++) {
          var item2 = response.data.projectActivity[i]
          financeesList.push({
            id: item2.id,
            type: item2.type,
            start_date: item2.start_date,
            end_date: item2.end_date,
            duration: item2.duration,
            activities: item2.activities,
            remarks: item2.remarks,
            status: item2.status,
            progress: item2.progress

          })
        }
        this.setState({ project_activities: financeesList })
        financeesList = [];
        for (let i = 0; i < response.data.otherActivity.length; i++) {
          var item3 = response.data.otherActivity[i]
          financeesList.push({
            id: item3.id,
            other_activity: item3.activities,
            other_date: item3.date,
            status: item3.status
          })
        }
        this.setState({ other_activities: financeesList })
      }).catch((error) => {
        console.log(error);
      })
  }

  // For simple fields
  handleChange(e) {
    let singleField = this.state.singleFields;
    singleField[e.target.name] = e.target.value;
    this.setState({ singleFields: singleField });
  }


  // SET MULTIPLE ROW
  handleChangeMul2(idx, e, type) {
    if (type === "amountRecieved" && this.state.selectedYear && this.state.selectedQuarter) {
     
      const { name, value } = e.target;
      console.log(name, value, idx);
      const finance_recieved = this.state.finance_recieved;
      if ('checked' in e.target) {
        
        finance_recieved[idx][name] = e.target.checked === true ? true : value;
      } else {
        
        finance_recieved[idx][name] = value;
      }

      finance_recieved[idx]['project_plan_id'] = this.props.params.id;
      finance_recieved[idx]['year'] = this.state.selectedYear;

      let recievedAmountTotal = 0.00
      finance_recieved.forEach(element => {
        if (element.amount_recieved && !isNaN(element.amount_recieved)) {
          recievedAmountTotal += parseFloat(element.amount_recieved)
        }
      })

      if (name === 'amount_recieved' && recievedAmountTotal > this.state.totalAllocatedFund) {
        alert("Received amount cannot be more than allocated fund")
        return
      }
      this.setState({
        finance_recieved: finance_recieved,
        totalActualRecievedFund: recievedAmountTotal
      });
    } else if (type === "amountRecieved") {
      alert("Please select year & quarter")
      return
    }
  }

  handleRemoveSpecificRow(idx, type) {
    if (this.state.finance_recieved.length > 1 && type === "amountRecieved") {
      const finance_recieved = this.state.finance_recieved;
      finance_recieved.splice(idx, 1);
      let total = 0.00
      finance_recieved.forEach(element => {
        if (element.amount_recieved && !isNaN(element.amount_recieved)) {
          total += parseFloat(element.amount_recieved)
        }
      })
      this.setState({
        totalActualRecievedFund: total
      });
      this.setState({ finance_recieved: finance_recieved });

    }
    if (this.state.external_agency.length > 1 && type === "externalAgency") {
      const external_agency = this.state.external_agency;
      external_agency.splice(idx, 1);


      this.setState({ external_agency: external_agency });

    }
    if (this.state.mous.length > 1 && type === "mous") {
      const mous = this.state.mous;
      mous.splice(idx, 1);


      this.setState({ mous: mous });

    }

    if (this.state.project_activity.length > 1 && type === "project_activity") {
      const project_activity = this.state.project_activity;
      project_activity.splice(idx, 1);
      this.setState({ project_activity: project_activity });
    }
  }

  handleRemoveSpecificRowOfTask(pidx, cidx, type) {
    const project_activity = this.state.project_activity;

    if (project_activity[pidx]['tasks'].length > 1) {
      project_activity[pidx]['tasks'].splice(cidx, 1);
      this.setState({ project_activity: project_activity });
    }

  }

  handleAddRow(type) {
    if (type === "amountRecieved") {
      const item = {
        amount_recieved: "",
        amount_recieved_date: "",
        amount_remark: "",
        project_plan_id: this.state.finance_recieved.project_plan_id,
        year: "",
      };
      this.setState({
        finance_recieved: [...this.state.finance_recieved, item],
      });
    }
    if (type === "externalAgency") {
      const item = {
        agency_name: "",
        agency_specification: "",
        type: "",
        amount: "",
      };
      this.setState({
        external_agency: [...this.state.external_agency, item],
      });
    }

    if(type === "mous") {
      const item = {
        year:"",
        key_deliverables: "",
        performance_indicators: "",
        output_target: "",
        status:""
      };
      this.setState({
        mous: [...this.state.mous, item]
      })
    }

    if (type === "project_activity") {
      var obj = {
        id: "",
        project_master_activity_id: "",
        project_master_activity_name: "",
        project_master_sub_activity_id: "",
        project_master_sub_activity_name: "",
        project_master_sub_activity: [],
        start_date: "",
        end_date: "",
        expected_entries: 1,
        current_entries: 1,
        year: "",
        quarter: "",
        tasks: [{
          id: "",
          task: "",

        }]
      }
      this.setState({
        project_activity: [...this.state.project_activity, obj],
      });

    }

  }


  handleAddRowTask(pidx, type) {
    if (type === "project_activity_task") {
      var obj = {
        id: "",
        task: "",

      }
      let projectActivity = this.state.project_activity
      let current_entries = projectActivity[pidx].current_entries
      let taskLength = projectActivity[pidx]['tasks'].length;
      if (taskLength >= current_entries) {
        alert("You cannot add more than Current Status");
        return
      }
      projectActivity[pidx]['tasks'].push(obj)
      this.setState({
        project_activity: projectActivity
      });

    }

  }

  render() {
    var yearsSelectOption = this.state.years.map(function (year, index) {
      return <option key={year} value={year}>{year}</option>;
    })

    let centre = this.state.centre.map(function (center, index) {

      return <option key={center.id} value={center.centre_code} >{center.centre_name}</option>;
    })
    let project = this.state.project.map(function (project, index) {
      return <option key={project.id} value={project.project_code}> {project.project_name} </option>;

    })
    let activity = this.state.project_master_activity.map(function (activity, index) {
      return <option key={activity.id} value={activity.id}> {activity.name} </option>;

    })

    // let sub_activity = this.state.project_master_sub_activity.map(function (activity, index) {
    //   return <option key={activity.id} value={activity.id}> {activity.subactivy_name} </option>;

    // })

    let team = this.state.project_head.map(function (team, index) {
      return <option key={team.id} value={team.employee_code}> {team.employee_name} </option>
    })

    let agency = this.state.funding_agency.map(function (agency, index) {
      return <option key={agency.id} value={agency.agency_code}>  {agency.agency_name} </option>
    })
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
                      <h3 className="card-title"> Project Form-II </h3>
                    </div>
                    <form>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="centreName">Centre Name </label>

                              <select
                                className="form-control "
                                name="centre_name"
                                id="centre_name"
                                value={this.state.singleFields.centre_name}
                                readOnly
                              >
                                <option> select </option>
                                {centre}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="projectName">Project Name</label>

                              <select
                                className="form-control "
                                name="project_name"
                                id="project_name"
                                value={this.state.singleFields.project_name}
                                readOnly
                              >
                                <option value=''> select </option>
                                {project}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="projectHeadName">
                                Project Head Name
                              </label>

                              <select
                                className="form-control "
                                name="team_head"
                                id="team_head"
                                value={this.state.singleFields.project_head}
                                readOnly
                              >
                                <option value=''> select </option>
                                {team}
                              </select>
                            </div>
                          </div>

                          <div className="form-group col-md-6">
                            <label htmlFor="fundingMinistry/Agency/Dept">
                              Funding Ministry/Agency/Dept.
                            </label>

                            <select
                              className="form-control "
                              name="funding_ministry"
                              id="funding_ministry"
                              value={this.state.singleFields.funding_agency}
                              readOnly
                            >
                              <option value=''> select </option>
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
                              readOnly
                              name="project_brief"
                              placeholder="Project Brief"
                              value={this.state.singleFields.project_brief}
                            ></textarea>
                          </div>

                          <div className="form-group col-md-6">
                            <label htmlFor="workOrderNo" className="p">
                              Work Order No
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="work_order"
                              readOnly
                              name="work_order"
                              placeholder="Work Order No"
                              value={this.state.singleFields.work_order}
                            />
                          </div>
                        </div>

                        <div className="row ">


                          <div className="form-group col-md-6">
                            <label htmlFor="nodalOfficerName" className="p">
                              Nodal Officer Name
                            </label>
                            <input
                              type="text"
                              className="form-control "
                              id="nodal_officer"
                              readOnly
                              name="nodal_officer"
                              placeholder="Nodal Officer Name"
                              value={this.state.singleFields.nodal_officer}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label htmlFor="contactNo">Contact no.</label>
                            <input
                              className="form-control"
                              id="contact_no"
                              name="contact_no"
                              readOnly
                              placeholder="Contact No"
                              value={this.state.singleFields.contact_no}
                            />
                          </div>
                        </div>
                        <div className="row ">
                          <div className="form-group col-md-6">
                            <label htmlFor="allocated_budget">
                              Allocated Budget
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              readOnly
                              id="allocated_budget"
                              name="allocated_budget"
                              placeholder="Allocated Budget"
                              value={this.state.singleFields.allocated_budget}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label htmlFor="overall_progress">
                              Overall Progress
                            </label>
                            <input
                              className="form-control"
                              id="overall_progress"
                              name="overall_progress"
                              placeholder="Overall Progress"
                              value={this.state.singleFields.overall_progress}
                              onChange={this.handleChange}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group col-md-6">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                              type="text"
                              name="start_date"
                              id="start_date"
                              readOnly
                              className="form-control"
                              value={moment(this.state.singleFields.start_date).format("DD-MM-YYYY")}
                            />
                          </div>
                          <div className="form-group col-md-6">
                            <label htmlFor="endDate">End Date</label>
                            <input
                              type="text"
                              name="end_date"
                              id="end_date"
                              readOnly
                              className="form-control"
                              value={moment(this.state.singleFields.end_date).format("DD-MM-YYYY")}
                            />
                          </div>
                        </div>

                        <p className="lead"> Team Strength </p>
                        <div className="hack1">
                          <div className="hack2 scroll">

                            <table className="table">
                              <thead className="thead-dark">
                                <tr>
                                  <th>S.No</th>
                                  <th>Position</th>
                                  <th>Qualification</th>
                                  <th>Emp Code</th>
                                  <th>Emp Name</th>
                                  <th>Remark</th>
                                </tr>
                              </thead>
                              <tbody id="tbl">
                                {this.state.team_strength.map((item, idx) => (
                                  <tr key={"ts-" + idx}>
                                    <td> {idx + 1} </td>

                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="position"
                                        readOnly
                                        placeholder="Position"
                                        name="position"
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "teamStrength")}
                                        value={item.position}
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
                                        readOnly
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="employee_code"
                                        placeholder="Emp Code"
                                        name="employee_code"
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "teamStrength")}
                                        value={item.employee_code}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="employee_name"
                                        placeholder="Emp Name"
                                        name="employee_name"
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "teamStrength")}
                                        value={item.employee_name}
                                      />
                                    </td>

                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="remark"
                                        placeholder="Remark"
                                        name="remark"
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "teamStrength")}
                                        value={item.remark}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                          </div>
                        </div>

                        <p className="lead"> Finances </p>
                        {/* Choose Year & Quarter */}
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="centreName">Choose Year </label>
                              <select
                                className="form-control "
                                name="year"
                                id="year"
                                value={this.state.selectedYear}
                                onChange={this.onChangeYear}
                              >
                                <option selected=""> select </option>
                                {yearsSelectOption}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="projectName">Choose Quarter</label>
                              <select
                                className="form-control "
                                name="project_name"
                                id="project_name"
                                value={this.state.selectedQuarter}
                                onChange={this.handleChangeQuarter}
                              >
                                <option selected=""> select </option>
                                <option value="Q1"> Q1 </option>
                                <option value="Q2"> Q2 </option>
                                <option value="Q3"> Q3 </option>
                                <option value="Q4"> Q4 </option>
                              </select>
                            </div>
                          </div>


                        </div>

                        {/* Received Payment */}
                        <p>Received Amount</p>
                        <div className="card">

                          <table className="table">
                            <thead className="thead-light card-header">
                              <th scope="col"> Adjustment? </th>
                              <th scope="col"> Received Amount </th>
                              <th scope="col"> Date </th>
                              <th scope="col"> Remarks  </th>
                              <th style={{ width: "100px" }}>Action  </th>
                            </thead>
                            <tbody className="card-body">
                              {this.state.finance_recieved.map((amt, idx) => (
                                <tr key={"ra-" + idx}>
                                  <td>
                                    <div className="form-check">
                                      <label className="form-check-label">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          id="is_adjustment"
                                          name="is_adjustment"
                                          onChange={(evnt) => this.handleChangeMul2(idx, evnt, "amountRecieved")}
                                          checked={amt.is_adjustment}
                                          value={amt.is_adjustment}
                                        />
                                      </label>
                                    </div>
                                  </td>
                                  <th> <input
                                    type="number"
                                    className="form-control"
                                    id="amount_recieved"
                                    placeholder="Amount Recieved"
                                    name="amount_recieved"
                                    onChange={(evnt) => this.handleChangeMul2(idx, evnt, "amountRecieved")}
                                    value={amt.amount_recieved}
                                  /> </th>
                                  <th> <input
                                    type="date"
                                    className="form-control"
                                    id="amount_recieved_date"
                                    name="amount_recieved_date"
                                    onChange={(evnt) => this.handleChangeMul2(idx, evnt, "amountRecieved")}
                                    value={moment(amt.amount_recieved_date).format('YYYY-MM-DD')}
                                  /> </th>
                                  <th>
                                    <textarea
                                      className="form-control "
                                      id="amount_remark"
                                      name="amount_remark"
                                      placeholder="Remarks..."
                                      onChange={(evnt) => this.handleChangeMul2(idx, evnt, "amountRecieved")}
                                      value={amt.amount_remark}
                                    ></textarea>
                                  </th>
                                  <input
                                    type="hidden"
                                    className="form-control"
                                    name="project_plan_id"
                                    id="project_plan_id"
                                    readOnly
                                    onChange={(evnt) => this.handleChangeMul2(idx, evnt, "amountRecieved")}
                                    value={amt.project_plan_id}
                                  />
                                  <input
                                    type="hidden"
                                    className="form-control"
                                    name="year"
                                    readOnly
                                    onChange={(evnt) => this.handleChangeMul2(idx, evnt, "amountRecieved")}
                                    value={amt.year}
                                  />
                                  <td>
                                    <button
                                      className="btn btn-danger btn-sm m-1"
                                      type="button"
                                      onClick={() => this.handleAddRow("amountRecieved")}
                                    >
                                      +
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-success btn-sm"
                                      onClick={() => this.handleRemoveSpecificRow(idx, "amountRecieved")}
                                    >
                                      -
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>

                          </table>

                        </div>
                        {/* Calculation field  */}
                        <div className="card">
                          <table className="table">
                            <thead className="thead-light card-header">
                              <th scope="col"> Allocated Budget </th>
                              <th scope="col"> Received Amount </th>
                              <th scope="col"> Expenditure </th>
                              <th scope="col"> Balance  </th>
                            </thead>
                            <tbody className="card-body">
                              <tr>
                                <th> {this.state.totalAllocatedFund} </th>
                                <th> {this.state.totalActualRecievedFund} </th>
                                <th> {this.state.totalExpenditureFund} </th>
                                <th> {this.state.totalActualRecievedFund - this.state.totalExpenditureFund} </th>
                              </tr>

                            </tbody>
                          </table>
                        </div>

                        {/*  Expenditure Details */}
                        <div className="hack1">
                          <div className="hack2 scroll">
                            <table className="table">
                              <thead className="thead-dark">
                                <tr>
                                  <th>Year</th>
                                  <th>Budget Head</th>
                                  <th>Allocated Fund</th>
                                  <th>Milestone</th>
                                  {/* <th>Recieved Amount</th> */}
                                  {/* <th>Date</th> */}
                                  <th>Expenditure</th>
                                  {/* <th>Balance</th>
                                  <th>Utilization(%)</th> */}
                                </tr>
                              </thead>
                              <tbody id="tbl2">
                                {this.state.finances.map((item, idx) => (
                                  <tr key={"fin-" + idx}>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="year"
                                        placeholder="Year"
                                        name="year"
                                        readOnly
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "finances")}
                                        value={item.year}
                                        style={{ width: "115px" }}
                                      />
                                      {item.errorMsg !== '' ? <strong>{item.errorMsg}</strong> : ''}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="budget_head"
                                        placeholder="Budget Head"
                                        name="budget_head"
                                        readOnly
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "finances")}
                                        value={item.budget_head}
                                        style={{ width: "150px" }}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
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
                                        id="allocated_fund"
                                        readOnly
                                        placeholder="Allocated Fund"
                                        name="allocated_fund"
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "finances")}
                                        value={item.milestone}
                                        style={{ width: "350px" }}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="expenditure"

                                        placeholder="Expenditure"
                                        name="expenditure"
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "finances")}
                                        value={item.expenditure}
                                        style={{ width: "350px" }}
                                      />
                                    </td>
                                  </tr>
                                ))}

                              </tbody>
                            </table>
                          </div>
                        </div>

                        <p className="lead mt-5"> Project Activities </p>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="centreName">Choose Year </label>
                              <select
                                className="form-control "
                                name="yearOfProjectActivity"
                                id="yearOfProjectActivity"
                                value={this.state.selectedYearProjectActivity}
                                onChange={this.onChangeYearProjectActivity}
                                
                              >
                                <option selected=""> select </option>
                                {yearsSelectOption}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="saveActivity">Save Activity </label>
                              <button className="form-control btn btn-primary" type="button" onClick={() => this.submitActivity("project_activity")} > Submit </button>
                            </div>
                          </div>
                        </div>
                        <div className="table-responsive">
                          <table className="table">
                            <thead className="thead-light card-header">
                              <th> Category </th>
                              <th> Sub Category </th>
                              <th> Start Date </th>
                              <th> End Date </th>
                              <th> Expected Number  </th>
                              <th> Current Status  </th>
                              <th>Action  </th>
                            </thead>
                            <tbody className="card-body">
                              {this.state.project_activity.map((ext, idx) => (
                                <>
                                  <tr key={"ea-" + idx}>
                                    <td>
                                      <select

                                        name="project_master_activity_id"
                                        id="project_master_activity_id"
                                        value={ext.project_master_activity_id}
                                        onChange={(evnt) => { this.handleChangeMul(idx, evnt, "project_activity"); this.handleSubActivity(idx, evnt) }}
                                      >
                                        <option value=''> select </option>
                                        {activity}
                                      </select>
                                    </td>
                                    <td>
                                      <select
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activity")}
                                        name="project_master_sub_activity_id"
                                        id="project_master_sub_activity_id"
                                        value={ext.project_master_sub_activity_id}
                                        style={{ width: "233px" }}
                                      >
                                        <option value=''> select </option>
                                        {ext.project_master_sub_activity.map((sub_activity, idx) => (
                                          <option value={sub_activity.id}> {sub_activity.subactivy_name} </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td>  <input
                                      type="date"
                                      name="start_date"
                                      id="start_date"
                                      value={ext.start_date}
                                      onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activity")}
                                    /> </td>
                                    <td>   <input
                                    
                                      type="date"
                                      name="end_date"
                                      id="end_date"
                                      value={ext.end_date}
                                      onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activity")}
                                    /> </td>
                                    <td> <input
                                      type="text"
                                      style={{ width: "50px" }}
                                      id="expected_entries"
                                      name="expected_entries"
                                      value={ext.expected_entries}
                                      onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activity")}
                                    />

                                    </td>
                                    <td> <input
                                      type="text"
                                      style={{ width: "50px" }}
                                      id="current_entries"
                                      name="current_entries"
                                      value={ext.current_entries}
                                      onChange={(evnt) => this.handleChangeMul(idx, evnt, "project_activity")}
                                    /> </td>

                                    <td >
                                      <button
                                        type="button"
                                        className="bg-success"
                                        onClick={() => this.handleAddRow("project_activity")}
                                      >
                                        +
                                      </button>
                                      <button
                                        type="button"
                                        className="bg-danger"
                                        onClick={() => this.handleRemoveSpecificRow(idx, "project_activity")}
                                      >
                                        -
                                      </button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan="7" style={{ padding: "30px" }}>
                                      <table className="table table-borderless">
                                        <thead className="thead-light card-header">
                                          <tr>
                                            <th>Index</th>
                                            <th>Task</th>
                                            <th>Action</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {ext.tasks.map((task, iidx) => (
                                            <tr key={'task' + iidx}>
                                              <td>{iidx + 1}</td>
                                              <td> <input
                                                type="text"
                                                name="task"
                                                id="task"
                                                className="form-control"
                                                value={task.task}
                                                onChange={(evnt) => this.handleChangeMulTask(idx, iidx, evnt, "project_activity_task")}


                                              />  </td>
                                              <td >
                                                <button
                                                  type="button"
                                                  className="bg-success"
                                                  onClick={() => this.handleAddRowTask(idx, 'project_activity_task')}
                                                >
                                                  +
                                                </button>
                                                <button
                                                  type="button"
                                                  className="bg-danger"
                                                  onClick={() => this.handleRemoveSpecificRowOfTask(idx, iidx, "project_activity_task")}
                                                >
                                                  -
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </tbody>

                          </table>
                        </div>

                        <p className="lead mt-5"> MOU's</p>
                        <table className="table">
                          <thead className="thead-light card-header">
                            <th scope="col"> S.no </th>
                            <th scope="col"> Year </th>
                            <th scope="col"> Key Deliverables </th>
                            <th scope="col"> Performance Indicator's </th>
                            <th scope="col"> Output Target  </th>
                            <th scope="col"> Status  </th>
                            <th style={{ width: "100px" }}>Action  </th>
                          </thead>
                          <tbody className="card-body">
                            {this.state.mous.map((mou, idx) => (
                              <tr key={"ea-" + idx}>
                                <td> {idx + 1} </td>
                                <td> <input
                                  type="text"
                                  className="form-control"
                                  id="year"
                                  name="year"
                                  onChange={(evnt) => this.handleChangeMul(idx, evnt, "mous")}
                                  onBlur ={(evnt) => this.validateYear(idx, evnt)}
                                  value={mou.year}
                                /> </td>
                                <td> <input
                                  type="text"
                                  className="form-control"
                                  id="key_deliverables"
                                  name="key_deliverables"
                                  onChange={(evnt) => this.handleChangeMul(idx, evnt, "mous")}
                                  value={mou.key_deliverables}
                                /> </td>
                                <td>
                                  <textarea className="form-control " name="performance_indicators" id="performance_indicators" cols="30" onChange={(evnt) => this.handleChangeMul(idx, evnt, "mous")}
                                    value={mou.performance_indicators}></textarea>
                                </td>
                                <td> <input
                                  type="text"
                                  className="form-control"
                                  id="output_target"
                                  name="output_target"
                                  onChange={(evnt) => this.handleChangeMul(idx, evnt, "mous")}
                                  value={mou.output_target}
                                /> </td>
                                <td> <input
                                  type="text"
                                  className="form-control"
                                  id="status"
                                  name="status"
                                  onChange={(evnt) => this.handleChangeMul(idx, evnt, "mous")}
                                  value={mou.status}
                                /> </td>

                                <td>
                                  <button
                                    className="btn btn-danger btn-sm m-1"
                                    type="button"
                                    onClick={() => this.handleAddRow("mous")}
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() => this.handleRemoveSpecificRow(idx, "mous")}
                                  >
                                    -
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>

                        </table>
                        <p className="lead mt-5">External Agency</p>
                        <table className="table">
                          <thead className="thead-light card-header">
                            <th scope="col"> S.no </th>
                            <th scope="col"> Agency Name </th>
                            <th scope="col"> Agency Specification </th>
                            <th scope="col"> Type  </th>
                            <th scope="col"> Amount  </th>
                            <th style={{ width: "100px" }}>Action  </th>
                          </thead>
                          <tbody className="card-body">
                            {this.state.external_agency.map((ext, idx) => (
                              <tr key={"ea-" + idx}>
                                <td> {idx + 1} </td>
                                <td> <input
                                  type="text"
                                  className="form-control"
                                  id="agency_name"
                                  placeholder="Amount Recieved"
                                  name="agency_name"
                                  onChange={(evnt) => this.handleChangeMul(idx, evnt, "externalAgency")}
                                  value={ext.agency_name}
                                /> </td>
                                <td>
                                  <textarea className="form-control " name="agency_specification" id="agency_specification" cols="30" onChange={(evnt) => this.handleChangeMul(idx, evnt, "externalAgency")}
                                    value={ext.agency_specification}></textarea>
                                </td>
                                <td> <input
                                  type="text"
                                  className="form-control"
                                  id="type"

                                  name="type"
                                  onChange={(evnt) => this.handleChangeMul(idx, evnt, "externalAgency")}
                                  value={ext.type}
                                /> </td>
                                <td> <input
                                  type="text"
                                  className="form-control"
                                  id="amt"
                                  placeholder="Amount Recieved"
                                  name="amt"
                                  onChange={(evnt) => this.handleChangeMul(idx, evnt, "externalAgency")}
                                  value={ext.amt}
                                /> </td>

                                <td>
                                  <button
                                    className="btn btn-danger btn-sm m-1"
                                    type="button"
                                    onClick={() => this.handleAddRow("externalAgency")}
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm"
                                    onClick={() => this.handleRemoveSpecificRow(idx, "externalAgency")}
                                  >
                                    -
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>

                        </table>


                        <p className="lead"> Other Activities </p>
                        <div className="hack1">
                          <div className="hack2 scroll">

                            <table className="table">
                              <thead className="thead-dark">
                                <tr>
                                  <th> Activities </th>
                                  <th>Date</th>

                                  <th>Status</th>
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
                                        readOnly
                                        placeholder="Team strength"
                                        name="other_activity"
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "other_activities")}
                                        value={item.other_activity}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="other_date"
                                        placeholder="Date"
                                        name="other_date"
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "other_activities")}

                                        value={moment(item.other_date).format("DD-MM-YYYY")}
                                      />
                                    </td>

                                    <td>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="status"
                                        placeholder="Status"
                                        name="status"
                                        onChange={(evnt) => this.handleChangeMul(idx, evnt, "other_activities")}
                                        value={item.status}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                          </div>
                        </div>

                      </div>
                      <div className="card-footer">
                        <button type="button" className="btn btn-primary" onClick={this.submitForm}>
                          Update
                        </button>
                      </div>
                      <div className="col-md-9">
                        {this.state.resStatus.messages !== '' ?
                          (<div className={"alert " + (this.state.resStatus.isError ? "alert-success" : "alert-danger")}> {this.state.resStatus.messages} </div>)
                          : ""}
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

// export default ProjectPlanEdit;
export default withRouter(ProjectPlanEdit);
