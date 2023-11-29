const LoginUserInfo = require("../../models/LoginUserInfo");
const Role = require("../../models/Role");
const User = require("../../models/User");
const UserRole = require("../../models/UserRole");
var moment = require('moment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


async function login(req, res, next) {
   try {

    const { email_id, password } = req.body;


    //Validation  for Employee Code and Password is required
    if (!email_id || !password) {
            throw new Error("Email id & Password both are required");
        }

    // Find the user by emailId
    const user = await User.findOne({
                    where: { email_id: `${email_id}` } 
                });
    
    // When user is not exist
    if(!user) {
      throw new Error("Authntication faieled");
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) { 
      throw new Error("Authntication faieled ");
    }

    // check This user already login or not
    let loginUserInfo = await LoginUserInfo.findOne({
                            where: { user_id: `${user.id}` } 
                        });

    

    let date = moment().format() 
    // ADD 30 Minutes More
    date = moment(date).add({minutes: 30});

    //  MAKE OBJECT FOR PASS JWT TOKEN
    let payload = {
        user_id:user.id,
        email_id: user.email_id,
        employee_code: user.employee_code,
        time: date
    }

    // CREATE TOKEN
    let token = jwt.sign( payload , 'secret', { expiresIn: '1h' });

    if(!loginUserInfo) {
        loginInfo = {
              username:user.first_name+' '+ user.last_name,
              user_id:user.id,
              expire_date: date,
              token: token
              } 
       
  
        //CREATE USER_LOGIN_INFO
      await LoginUserInfo.create(loginInfo);

      }else{
        
          await LoginUserInfo.update({
                      expire_date : date,
                      token: token
                      }, {
                  where: { id: loginUserInfo.id },
                  })
      }

    // SEND RESPONSE
    return res.status(200).json({
        status: true,
        message: "Logged in Successfully!",
        tokenKey: token,
    
    });

   }catch(error) {
    return res.status(401).json({
        status: false,
        message: error.message,
    });
   }
    
  }

async function create(req, res, next) {
    const { first_name, last_name, email_id, password, employee_code, role } = req.body;
       try{
        let hashedPassword = await bcrypt.hash(password, 5);

        let user = await User.create({
            first_name: first_name,
            last_name: last_name,
            email_id: email_id,
            password: hashedPassword,
            employee_code : employee_code
        });

        if(req.body.role) {
            let userRole = await UserRole.create({
                user_id : user.id,
                role_id : parseInt(role)
            })
        }
        return res.status(200).json({
            status:true,
            message: "User Created Successfully",
            data: user
        })
       }catch(e) {
        return res.status(500).json({
            status: false,
            message:e.message,
            data: e
        })
       }
  }

  module.exports = {
    login,
    create
  }