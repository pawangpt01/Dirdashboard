const { ProjectActivityTask } = require("../../models/ProjectActivityTask");
const { ProjectPlan } = require("../../models/ProjectPlan");
const { Team } = require("../../models/Team");
const { Centre } = require("../../models/Centre");
const { Project } = require("../../models/Project");
const { ProjectActivity } = require("../../models/ProjectActivity");
const { db } = require("../../utils/db.utill");
const { Op } = require('sequelize');
const { ProjectMasterActivity } = require("../../models/ProjectMasterActivity");


function formatNumberToCrores(number) {
  if (isNaN(number)) {
    return "Invalid Number";
  }

  const croreValue = 10000000; // 1 Crore
  const formattedNumber = (number / croreValue).toFixed(2); // Round to 2 decimal places
  return formattedNumber;
}

async function overView(req, res, next) {

  try {
    let fundingAgency = [];
    let fundingAmt = [];
    let sanctionFund = [];
    let releasedFund = [];
    let utilizationFund = [];
    let projectList = [];
    let customObj = [];
    let customObj2 = [];
    let customObj3 = [];
    let customObj4 = [];
    let customObj5 = [];

    // Get project and center for dynamically listing on welcome page for filter
    const centres = await Centre.findAll({
      order: [['centre_name', 'ASC']],
    });
    const projects = await Project.findAll({
      order: [['project_name', 'ASC']],
    });

    //Total Budget
    let budgetWhereCondition = {};
    if (req.body.centre_name) {
      budgetWhereCondition.centre_name = req.body.centre_name
    }

    if (req.body.project_name) {
      budgetWhereCondition.project_name = req.body.project_name
    }

    let totalAllocatedBudget = 0;
    if (Object.keys(budgetWhereCondition).length === 0) {
      totalAllocatedBudget = await ProjectPlan.sum('allocated_budget');
    } else {
      totalAllocatedBudget = await ProjectPlan.sum('allocated_budget', {
        where: budgetWhereCondition
      });
    }
    if (!totalAllocatedBudget) {
      totalAllocatedBudget = 0;
    }
    //end Total Budget

    // Total project
    let totalProjectCountWhere = {}
    if (req.body.centre_name) {
      totalProjectCountWhere.centre_name = req.body.centre_name
    }

    if (req.body.project_name) {
      totalProjectCountWhere.project_name = req.body.project_name
    }

    let totalProject = 0;
    if (Object.keys(totalProjectCountWhere).length === 0) {
      totalProject = await ProjectPlan.count({
        distinct: true, // Use the DISTINCT keyword
        col: 'project_name', // Specify the column to count distinct values for
      })
    } else {
      totalProject = await ProjectPlan.count({
        distinct: true, // Use the DISTINCT keyword
        col: 'project_name', // Specify the column to count distinct values for
        where: totalProjectCountWhere
      });
    }
    if (!totalProject) {
      totalProject = 0;
    }

    // end Total project

    // Total Employee 
    let whereOfTeam = {}
    if (req.body.centre_name) {
      whereOfTeam.centre_name = req.body.centre_name
    }

    if (req.body.project_name) {
      whereOfTeam.project_name = req.body.project_name
    }
    let totalEmployee = 0
    if (Object.keys(whereOfTeam).length === 0) {
      let customObj = await db.query(`SELECT count(t.employee_name) as cnt FROM teams as t
      inner JOIN project_plan as pp
      ON t.project_plan_id = pp.id where employee_name is not null AND employee_name != ''`,
        { type: db.QueryTypes.SELECT });

        console.log(customObj[0].cnt);
      if (customObj) {
        totalEmployee = customObj[0].cnt
      }
    } else {
      var whereString = 'where employee_name is not null AND employee_name != ""';
      if (whereOfTeam.centre_name) {
        whereString += ' and pp.centre_name =' + whereOfTeam.centre_name
      }
      if (whereOfTeam.project_name) {
        whereString += ' and pp.project_name =' + whereOfTeam.project_name
      }

      let customObj = await db.query(`SELECT count(t.id) as cnt FROM teams as t
      inner JOIN project_plan as pp
      ON t.project_plan_id = pp.id ${whereString}`,
        { type: db.QueryTypes.SELECT });

        console.log(customObj[0].cnt);

      if (customObj) {
        totalEmployee = customObj[0].cnt
      }
      
    }


    if (!totalEmployee) {
      totalEmployee = 0
    }

    // end Total Employee

    //Knowledge Products 
    let whereOfProjectActivityTask = {}
    if (req.body.centre_name) {
      whereOfProjectActivityTask.centre_name = req.body.centre_name
    }

    if (req.body.project_name) {
      whereOfProjectActivityTask.project_name = req.body.project_name
    }

    let totalKnowledgeProducts = 0;
    let knowledgeProduct = await ProjectMasterActivity.findOne({
      where: {
        name: 'Knowledge management'
      }
    })
    if (Object.keys(whereOfProjectActivityTask).length === 0) {
      let customObj = await db.query(`SELECT count(t.id) as cnt FROM project_activity_tasks  as t
      inner JOIN project_activity as pa on pa.id=t.project_activity_id
      inner JOIN project_plan as pp
      ON t.project_plan_id = pp.id where pa.project_master_activity_id = ${knowledgeProduct.id}`,
        { type: db.QueryTypes.SELECT });
      if (customObj) {
        totalKnowledgeProducts = customObj[0].cnt
      }
    } else {
      var whereString = 'where pa.project_master_activity_id =  ' + knowledgeProduct.id + ' ';
      if (whereOfProjectActivityTask.centre_name) {
        whereString += ' and pp.centre_name =' + whereOfProjectActivityTask.centre_name
      }
      if (whereOfProjectActivityTask.project_name) {
        whereString += ' and pp.project_name =' + whereOfProjectActivityTask.project_name
      }
      let customObj = await db.query(`SELECT count(t.id) as cnt FROM project_activity_tasks as t
      inner JOIN project_activity as pa on pa.id=t.project_activity_id
      inner JOIN project_plan as pp
      ON t.project_plan_id = pp.id ${whereString}`,
        { type: db.QueryTypes.SELECT });
      if (customObj) {
        totalKnowledgeProducts = customObj[0].cnt
      }
    }

    if (!totalKnowledgeProducts) {
      totalKnowledgeProducts = 0
    }

    // end Knowledge Products

    // Total MOU

    let whereOfProjectActivityTaskMou = {}
    if (req.body.centre_name) {
      whereOfProjectActivityTaskMou.centre_name = req.body.centre_name
    }

    if (req.body.project_name) {
      whereOfProjectActivityTaskMou.project_name = req.body.project_name
    }

    let totalMou = 0;
    let mouProduct = await ProjectMasterActivity.findOne({
      where: {
        name: 'MOUs/Agreements'
      }
    })
    if (Object.keys(whereOfProjectActivityTaskMou).length === 0) {
      let customObj = await db.query(`SELECT count(t.id) as cnt FROM project_activity_tasks  as t
      inner JOIN project_activity as pa on pa.id=t.project_activity_id
      inner JOIN project_plan as pp
      ON t.project_plan_id = pp.id where pa.project_master_activity_id = ${mouProduct.id}`,
        { type: db.QueryTypes.SELECT });
      if (customObj) {
        totalMou = customObj[0].cnt
      }
    } else {
      var whereString = 'where pa.project_master_activity_id =  ' + knowledgeProduct.id + ' ';
      if (whereOfProjectActivityTaskMou.centre_name) {
        whereString += ' and pp.centre_name =' + whereOfProjectActivityTaskMou.centre_name
      }
      if (whereOfProjectActivityTaskMou.project_name) {
        whereString += ' and pp.project_name =' + whereOfProjectActivityTaskMou.project_name
      }
      let customObj = await db.query(`SELECT count(t.id) as cnt FROM project_activity_tasks as t
      inner JOIN project_activity as pa on pa.id=t.project_activity_id
      inner JOIN project_plan as pp
      ON t.project_plan_id = pp.id ${whereString}`,
        { type: db.QueryTypes.SELECT });
      if (customObj) {
        totalMou = customObj[0].cnt
      }
    }


    if (!totalMou) {
      totalMou = 0
    }
    // end Total MOU

    // Overall Fund (Get all funding details for pie graph)
    let whereOfFundingAgancy = {}
    if (req.body.centre_name) {
      whereOfFundingAgancy.centre_name = req.body.centre_name;
    }

    if (req.body.project_name) {
      whereOfFundingAgancy.project_name = req.body.project_name;
    }

    let FundingAgancyDetails = 0;

    if (Object.keys(whereOfFundingAgancy).length === 0) {
      FundingAgancyDetails = await db.query(`SELECT pp.id, pp.centre_name, pp.project_name, sum(pp.allocated_budget)as allocated_budget, pp.funding_agency as funding_agency_code, fa.agency_name, fa.short_name FROM project_plan as pp Inner JOIN funding_agency as fa ON pp.funding_agency = fa.agency_code GROUP by pp.funding_agency`,
        { type: db.QueryTypes.SELECT });

    } else {
      let whereString = 'where 1=1';
      if (whereOfFundingAgancy.centre_name) {
        whereString += ' and pp.centre_name =' + whereOfFundingAgancy.centre_name;
      }
      if (whereOfFundingAgancy.project_name) {
        whereString += ' and pp.project_name =' + whereOfFundingAgancy.project_name;
      }
      FundingAgancyDetails = await db.query(`SELECT * FROM project_plan as pp Inner JOIN funding_agency as fa ON pp.funding_agency = fa.agency_code ${whereString}`,
        { type: db.QueryTypes.SELECT });

    }


    //bind data according to Overall Fund graph
    for (let i = 0; i < FundingAgancyDetails.length; i++) {
      let agency = FundingAgancyDetails[i];
      fundingAgency.push(agency.short_name);
      fundingAmt.push(agency.allocated_budget);
    }


    // Fund Utilization column
    let whereOfUtilization = {}
    if (req.body.centre_name) {
      whereOfUtilization.centre_name = req.body.centre_name;
    }

    if (req.body.project_name) {
      whereOfUtilization.project_name = req.body.project_name;
    }

    let sanction_releasedFund = 0;
    let utilizeFund = 0;
    if (Object.keys(whereOfUtilization).length === 0) {

      sanction_releasedFund = await db.query(`SELECT t1.centre_name, t1.project_name as project_code,t3.project_name as project_name, t1.allocated_budget ,SUM(t2.amount_recieved) AS released_amt FROM project_plan t1 INNER JOIN finance_recieved t2 ON t1.id = t2.project_plan_id INNER JOIN project t3 ON t1.project_name = t3.project_code WHERE t2.is_adjustment IS NULL OR t2.is_adjustment = 0`,
        { type: db.QueryTypes.SELECT });

      utilizeFund = await db.query(`SELECT table1.centre_name, table1.project_name, SUM(table3.expenditure)As fund_utilized FROM project_plan table1
    INNER JOIN finances table3 ON table1.id = table3.project_plan_id
    GROUP BY table1.id`,
        { type: db.QueryTypes.SELECT });

    } else {
      let whereString = 'WHERE (t2.is_adjustment IS NULL OR t2.is_adjustment = 0)';
      let havingString = 'HAVING 1=1';
      if (whereOfUtilization.centre_name) {

        whereString += ' and (t1.centre_name = ' + whereOfUtilization.centre_name + ')';
        havingString += ' and table1.centre_name =' + whereOfUtilization.centre_name;
      }
      if (whereOfUtilization.project_name) {

        whereString += ' and (t1.project_name = ' + whereOfUtilization.project_name + ')';
        havingString += ' and table1.project_name=' + whereOfUtilization.project_name;
      }

      sanction_releasedFund = await db.query(`SELECT t1.centre_name, t1.project_name as project_code,t3.project_name as project_name, t1.allocated_budget ,SUM(t2.amount_recieved) AS released_amt FROM project_plan t1 INNER JOIN finance_recieved t2 ON t1.id = t2.project_plan_id INNER JOIN project t3 ON t1.project_name = t3.project_code ${whereString}`, { type: db.QueryTypes.SELECT });

      utilizeFund = await db.query(`SELECT table1.centre_name, table1.project_name, SUM(table3.expenditure)As fund_utilized FROM project_plan table1
      INNER JOIN finances table3 ON table1.id = table3.project_plan_id
      GROUP BY table1.id ${havingString}`, { type: db.QueryTypes.SELECT });

    }


    if (sanction_releasedFund.length > 0) {
      for (let j = 0; j < sanction_releasedFund.length; j++) {
        let fund = sanction_releasedFund[j];
        // number formetted in crores
        let s = formatNumberToCrores(fund.allocated_budget);
        let r = formatNumberToCrores(fund.released_amt);

        sanctionFund.push(s);
        releasedFund.push(r);
        projectList.push(fund.project_name);
      }
    }

    for (let k = 0; k < utilizeFund.length; k++) {
      let u = formatNumberToCrores(utilizeFund[k].fund_utilized);
      utilizationFund.push(u);
    }

    //for 2nd row graph 
    // let subCatagoryList = await ProjectActivity.findAll();
    let whereOfSectorWiseActivity = {}
      if (req.body.centre_name) {
        whereOfSectorWiseActivity.centre_name = req.body.centre_name;
      }

      if (req.body.project_name) {
        whereOfSectorWiseActivity.project_name = req.body.project_name;
      }

      let subCatagoryList = 0;
     
      if (Object.keys(whereOfSectorWiseActivity).length === 0) {

        subCatagoryList = await db.query(`SELECT pa.project_plan_id, pa.project_master_activity_id, pa.project_master_activity_name, pa.project_master_sub_activity_id, pa.project_master_sub_activity_name, pa.start_date, pa.end_date, pa.duration, pa.expected_entries, pa.current_entries, pa.year,pp.centre_name, pp.project_name FROM project_activity AS pa INNER JOIN project_plan pp 
        ON pp.id = pa.project_plan_id`, { type: db.QueryTypes.SELECT });
      } else {
        let whereString = 'ON pp.id = pa.project_plan_id';
        if(whereOfSectorWiseActivity.centre_name) {
          whereString += ' AND pp.centre_name =' + whereOfSectorWiseActivity.centre_name;
        }
        if(whereOfSectorWiseActivity.project_name) {
          whereString += ' AND pp.project_name =' + whereOfSectorWiseActivity.project_name;
        }
        
        subCatagoryList = await db.query(`SELECT pa.project_plan_id, pa.project_master_activity_id, pa.project_master_activity_name, pa.project_master_sub_activity_id, pa.project_master_sub_activity_name, pa.start_date, pa.end_date, pa.duration, pa.expected_entries, pa.current_entries, pa.year,pp.centre_name, pp.project_name FROM project_activity AS pa INNER JOIN project_plan pp 
        ${whereString}`, { type: db.QueryTypes.SELECT });
      }
     

      if(subCatagoryList) {
        for (i = 0; i < subCatagoryList.length; i++) {
          var obj = subCatagoryList[i];
    
          // for Mou
          if (obj.project_master_activity_id === 1) {
            //get round figure value for series
            let x = (obj.current_entries * 100) / obj.expected_entries
            customObj.push({
              name: obj.project_master_activity_name,
              totalActivities: obj.expected_entries,
              currentActivities: obj.current_entries,
              series: [Math.trunc(x)],
              label: "Activity (" + obj.current_entries + "/" + obj.expected_entries + ")"
            })
          }
    
          // for Geographic Spread or Locations
          if (obj.project_master_activity_id === 2) {
            let x = (obj.current_entries * 100) / obj.expected_entries
            customObj2.push({
              name: obj.project_master_activity_name,
              totalActivities: obj.expected_entries,
              currentActivities: obj.current_entries,
              series: [Math.trunc(x)],
              label: "Activity (" + obj.current_entries + "/" + obj.expected_entries + ")"
            })
          }
    
          // for Advocacy and Capacity Building
          if (obj.project_master_activity_id === 3) {
            let x = (obj.current_entries * 100) / obj.expected_entries;
            customObj3.push({
              name: obj.project_master_activity_name,
              totalActivities: obj.expected_entries,
              currentActivities: obj.current_entries,
              series: [Math.trunc(x)],
              label: "Activity (" + obj.current_entries + "/" + obj.expected_entries + ")"
            })
          }
    
          // for Knowledge management
          if (obj.project_master_activity_id === 4) {
            let x = (obj.current_entries * 100) / obj.expected_entries;
            customObj4.push({
              name: obj.project_master_activity_name,
              totalActivities: obj.expected_entries,
              currentActivities: obj.current_entries,
              series: [Math.trunc(x)],
              label: "Activity (" + obj.current_entries + "/" + obj.expected_entries + ")"
            })
          }
    
          // for Other (such as Prog/Proj devt: partnerships)
          if (obj.project_master_activity_id === 5) {
            let x = (obj.current_entries * 100) / obj.expected_entries;
            customObj5.push({
              name: obj.project_master_activity_name,
              totalActivities: obj.expected_entries,
              currentActivities: obj.current_entries,
              series: [Math.trunc(x)],
              label: "Activity (" + obj.current_entries + "/" + obj.expected_entries + ")"
            })
          }
        }
      }


    // Allocation column
    let whereOfAllocation = {}
    if (req.body.centre_name) {
      whereOfAllocation.centre_name = req.body.centre_name;
    }

    if (req.body.project_name) {
      whereOfAllocation.project_name = req.body.project_name;
    }

    let budgetList = 0;
    let receivedAmt = 0;
    if (Object.keys(whereOfAllocation).length === 0) {

      budgetList = await db.query(`SELECT project_plan_id,budget_head, sum(allocated_fund) as allocated_fund , SUM(expenditure)as expenditure FROM finances GROUP by budget_head`, { type: db.QueryTypes.SELECT });

      receivedAmt = await db.query(`SELECT sum(fr.amount_recieved) as amount_recieved
     FROM finance_recieved as fr INNER JOIN project_plan AS pr ON pr.id=fr.project_plan_id
      where (fr.is_adjustment is null or fr.is_adjustment = false)`,
        { type: db.QueryTypes.SELECT });
    } else {
      let whereString = ' WHERE 1=1';
      let whereString2 = ' WHERE (fr.is_adjustment IS NULL OR fr.is_adjustment = false)';
      if (whereOfAllocation.centre_name) {
        whereString += ' AND t.centre_name =' + whereOfAllocation.centre_name;
        whereString2 += ' AND pr.centre_name =' + whereOfAllocation.centre_name;
      }
      if (whereOfAllocation.project_name) {
        whereString += ' AND t.project_name =' + whereOfAllocation.project_name;
        whereString2 += ' AND pr.project_name =' + whereOfAllocation.project_name;
      }

      budgetList = await db.query(`SELECT t.centre_name, t.project_name, t1.project_plan_id, t1.budget_head, SUM(t1.allocated_fund) as allocated_fund, SUM(t1.expenditure) as expenditure FROM project_plan t INNER JOIN finances t1 ON t.id = t1.project_plan_id ${whereString} GROUP BY t.centre_name, t.project_name, t1.project_plan_id, t1.budget_head`, { type: db.QueryTypes.SELECT });


      receivedAmt = await db.query(`SELECT SUM(fr.amount_recieved) as amount_recieved
                                      FROM finance_recieved as fr
                                      INNER JOIN project_plan AS pr ON pr.id = fr.project_plan_id ${whereString2}`, { type: db.QueryTypes.SELECT });

    }// End Allocation column


    //Expenditure Till Date
    let whereOfExpenditure = {}
    if (req.body.centre_name) {
      whereOfExpenditure.centre_name = req.body.centre_name;
    }

    if (req.body.project_name) {
      whereOfExpenditure.project_name = req.body.project_name;
    }

    let utilizedAmt = 0;

    if (Object.keys(whereOfExpenditure).length === 0) {

      utilizedAmt = await db.query(`SELECT sum(f.expenditure) as expenditure FROM finances as f INNER JOIN project_plan AS pp ON pp.id=f.project_plan_id`,
        { type: db.QueryTypes.SELECT });

    } else {
      let whereString = ' ON pp.id=f.project_plan_id';
      if (whereOfExpenditure.centre_name) {
        whereString += ' AND pp.centre_name =' + whereOfExpenditure.centre_name;
      }
      if (whereOfExpenditure.project_name) {
        whereString += ' AND pp.project_name =' + whereOfExpenditure.project_name;
      }
      utilizedAmt = await db.query(`SELECT sum(f.expenditure) as expenditure FROM finances as f INNER JOIN project_plan AS pp ${whereString}`, { type: db.QueryTypes.SELECT });
    }//End Expenditure Till Date

    // Last Received Amount
    let whereOfReceivedAmountDate = {}
    if (req.body.centre_name) {
      whereOfReceivedAmountDate.centre_name = req.body.centre_name;
    }

    if (req.body.project_name) {
      whereOfReceivedAmountDate.project_name = req.body.project_name;
    }
    let receivedAmtAndDate = 0;
    if (Object.keys(whereOfReceivedAmountDate).length === 0) {

      receivedAmtAndDate = await db.query(`SELECT max(amount_recieved)as amount_recieved ,max(amount_recieved_date)as amount_recieved_date FROM finance_recieved WHERE is_adjustment !=1`, { type: db.QueryTypes.SELECT });
    } else {
      let whereString = ' WHERE fr.is_adjustment !=1';
      if (whereOfReceivedAmountDate.centre_name) {
        whereString += ' AND pp.centre_name =' + whereOfReceivedAmountDate.centre_name;
      }
      if (whereOfReceivedAmountDate.project_name) {
        whereString += ' And pp.project_name =' + whereOfReceivedAmountDate.project_name;
      }
      receivedAmtAndDate = await db.query(`SELECT max(fr.amount_recieved)as amount_recieved ,max(fr.amount_recieved_date)as amount_recieved_date FROM finance_recieved fr INNER JOIN project_plan pp ON fr.project_plan_id = pp.id ${whereString}`, { type: db.QueryTypes.SELECT });
    }// End Last Received Amount

    //Amount Allocated Till Date
    let whereOfAmountAllocation = {}
    if (req.body.centre_name) {
      whereOfAmountAllocation.centre_name = req.body.centre_name;
    }

    if (req.body.project_name) {
      whereOfAmountAllocation.project_name = req.body.project_name;
    }
    let amountTillDate = 0;
    if (Object.keys(whereOfAmountAllocation).length === 0) {

      amountTillDate = await db.query(`SELECT SUM(f.allocated_fund) AS allocated_fund
          FROM finances f INNER JOIN project_plan pp ON pp.id = f.project_plan_id
          WHERE f.year < YEAR(CURRENT_DATE)`, { type: db.QueryTypes.SELECT });

    } else {
      let whereString = 'WHERE f.year < YEAR(CURRENT_DATE)';
      if (whereOfAmountAllocation.centre_name) {
        whereString += ' AND pp.centre_name = ' + whereOfAmountAllocation.centre_name;
      }
      if (whereOfAmountAllocation.project_name) {
        whereString += ' AND pp.project_name = ' + whereOfAmountAllocation.project_name;
      }
      amountTillDate = await db.query(`SELECT SUM(f.allocated_fund) AS allocated_fund
          FROM finances f INNER JOIN project_plan pp ON pp.id = f.project_plan_id
          ${whereString}`, { type: db.QueryTypes.SELECT });
    }//End Amount Allocated Till Date


    // Project Status (how many project are running, complited, delayed) 
    let whereOfProjectStatus = {}
      if (req.body.centre_name) {
        whereOfProjectStatus.centre_name = req.body.centre_name;
      }

      if (req.body.project_name) {
        whereOfProjectStatus.project_name = req.body.project_name;
      }
      let projectStatus = 0;
      let projectStatusList =0;
      if (Object.keys(whereOfProjectStatus).length === 0) {

        projectStatus = await db.query(`SELECT SUM(CASE WHEN CURDATE() BETWEEN start_date AND end_date THEN 1 ELSE 0 END) AS running_projects,
        SUM(CASE WHEN CURDATE() > end_date THEN 1 ELSE 0 END) AS completed_projects, 
        SUM(CASE WHEN CURDATE() < start_date  THEN 1 ELSE 0 END) AS pipeline_projects  FROM project_plan`, { type: db.QueryTypes.SELECT });

        //  Project status list Wise
        projectStatusList = await db.query(`SELECT pp.id,p.project_name, pp.project_name as project_code, pp.start_date, pp.end_date,
        CASE
            WHEN CURDATE() < pp.start_date THEN 'Pipeline'
            WHEN CURDATE() BETWEEN pp.start_date AND pp.end_date THEN 'Running'
            WHEN CURDATE() > pp.end_date THEN 'Completed'
            ELSE 'Unknown' -- Handle any other cases here
        END AS project_status
        from project_plan pp
        INNER JOIN project p 
        ON pp.project_name = p.project_code`
      , { type: db.QueryTypes.SELECT });
      //  End Project status list

      }else {
        let whereString = ' WHERE 1=1';
        let whereString2 = 'WHERE 1=1';
        if(whereOfProjectStatus.centre_name) {
          whereString += ' And centre_name ='+ whereOfProjectStatus.centre_name;
          whereString2 += ' And pp.centre_name ='+ whereOfProjectStatus.centre_name;
        } 
        if(whereOfProjectStatus.project_name) {
          whereString += ' AND project_name ='+ whereOfProjectStatus.project_name;
          whereString2 += ' AND pp.project_name ='+ whereOfProjectStatus.project_name;
        }

        projectStatus = await db.query(`SELECT SUM(CASE WHEN CURDATE() BETWEEN start_date AND end_date THEN 1 ELSE 0 END) AS running_projects,
        SUM(CASE WHEN CURDATE() > end_date THEN 1 ELSE 0 END) AS completed_projects, 
        SUM(CASE WHEN CURDATE() < start_date  THEN 1 ELSE 0 END) AS pipeline_projects  FROM project_plan ${whereString}`, { type: db.QueryTypes.SELECT });

        projectStatusList = await db.query(`SELECT pp.id,p.project_name, pp.project_name as project_code, pp.start_date, pp.end_date,
        CASE
            WHEN CURDATE() < pp.start_date THEN 'Pipeline'
            WHEN CURDATE() BETWEEN pp.start_date AND pp.end_date THEN 'Running'
            WHEN CURDATE() > pp.end_date THEN 'Completed'
            ELSE 'Unknown' -- Handle any other cases here
        END AS project_status
        from project_plan pp
        INNER JOIN project p 
        ON pp.project_name = p.project_code ${whereString2}`
      , { type: db.QueryTypes.SELECT });
      }
      if (!projectStatusList) {
        projectStatusList = 0;
      }
    
    let project_status = [];
    project_status.push(parseInt(projectStatus[0].running_projects));
    project_status.push(parseInt(projectStatus[0].completed_projects));
    project_status.push(parseInt(projectStatus[0].pipeline_projects));
    // End Project Status how many running, complited, delayed

  // Project Activity (MOU'S)
    let whereOfMous = {}
    if (req.body.centre_name) {
      whereOfMous.centre_name = req.body.centre_name;
    }

    if (req.body.project_name) {
      whereOfMous.project_name = req.body.project_name;
    }
    let mouList = 0;
    if (Object.keys(whereOfMous).length === 0) {
      mouList = await db.query(`SELECT m.project_plan_id, m.project_code, m.project_name, m.funding_agency_code, m.funding_agency,m.key_deliverables,m.performance_indicators, m.output_target, m.status FROM mous m`, { type: db.QueryTypes.SELECT });
    }else {
      let whereString = 'ON pp.id = m.project_plan_id';
      if(whereOfMous.centre_name) {
        whereString += ' AND pp.centre_name ='+ whereOfMous.centre_name ;
      }
      if(whereOfMous.project_name) {
        whereString += ' And pp.project_name ='+ whereOfMous.project_name;
      }

      mouList = await db.query(`SELECT m.project_plan_id, m.project_code, m.project_name, m.funding_agency_code, m.funding_agency,m.key_deliverables,m.performance_indicators, m.output_target, m.status, pp.centre_name FROM mous m INNER JOIN project_plan pp ${whereString}`, { type: db.QueryTypes.SELECT });
    }

    
  //Project Activity End Mou's

     
    


    return res.status(200).json({
      status: true,
      "centres": centres,
      "projects": projects,
      "totalFund": totalAllocatedBudget,
      "totalProject": totalProject,
      "totalEmployee": totalEmployee,
      "totalKnowledgeProducts": totalKnowledgeProducts,
      "totalMou": totalMou,
      "FundingAgency": fundingAgency,
      "FundingAmt": fundingAmt,
      //second graph for welcome page
      "projectList": projectList,
      "budgetList": budgetList,
      "totalReceivedAmt": receivedAmt[0].amount_recieved,
      "balanceAmt": receivedAmt[0].amount_recieved - utilizedAmt[0].expenditure,
      "lastAmtReceived": receivedAmtAndDate[0].amount_recieved,
      "lastAmtDate": receivedAmtAndDate[0].amount_recieved_date,
      "amountTillDate": amountTillDate[0].allocated_fund,
      "utilizedAmt": utilizedAmt[0].expenditure,
      "sanctionFund": sanctionFund,
      "releasedFund": releasedFund,
      "utilizationFund": utilizationFund,
      "balanceAmt": receivedAmt[0].amount_recieved - utilizedAmt[0].expenditure,
      "utilizedAmt": utilizedAmt[0].expenditure,
      //2nd row graph
      "projectActivity": customObj,
      "projectActivity2": customObj2,
      "projectActivity3": customObj3,
      "projectActivity4": customObj4,
      "projectActivity5": customObj5,
      "mouList": mouList,
      "project_status": project_status,
      "projectStatusList": projectStatusList
    })

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    })
  }
}

async function projectWiseFunding(req, res, next) {
  let isChecked = req.body.isChecked;
  let fundingAgency = [];
  let fundingAmt = [];
  if (isChecked) {
    const FundingAgancyDetails = await db.query(`SELECT pp.centre_name as centre_code, pp.project_name as project_code, pp.funding_agency, sum(pp.allocated_budget)as allocated_budget , p.project_name,p.short_name FROM project_plan as pp inner JOIN project as p ON pp.project_name = p.project_code GROUP by pp.project_name`,
      { type: db.QueryTypes.SELECT });

    //bind data according to Overall Fund graph
    for (let i = 0; i < FundingAgancyDetails.length; i++) {
      let agency = FundingAgancyDetails[i];
      fundingAgency.push(agency.short_name);
      fundingAmt.push(agency.allocated_budget);
    }
    return res.status(200).json({
      status: true,
      "FundingAgency": fundingAgency,
      "FundingAmt": fundingAmt,
    })


  } else {
    const FundingAgancyDetails = await db.query(`SELECT pp.id, pp.centre_name, pp.project_name, sum(pp.allocated_budget)as allocated_budget, pp.funding_agency as funding_agency_code, fa.agency_name, fa.short_name FROM project_plan as pp Inner JOIN funding_agency as fa ON pp.funding_agency = fa.agency_code GROUP by pp.funding_agency`,
      { type: db.QueryTypes.SELECT });

    //bind data according to Overall Fund graph
    for (let i = 0; i < FundingAgancyDetails.length; i++) {
      let agency = FundingAgancyDetails[i];
      fundingAgency.push(agency.short_name);
      fundingAmt.push(agency.allocated_budget);
    }

    return res.status(200).json({
      status: true,
      "FundingAgency": fundingAgency,
      "FundingAmt": fundingAmt,
    })
  }
}

module.exports = {
  overView,
  projectWiseFunding
}
