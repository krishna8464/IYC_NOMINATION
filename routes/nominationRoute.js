const express = require("express");
const Nominationroute = express.Router();
const { logger } = require("../middleware/logger");
// const { State } = require("../models/stateModel");
const { Nomination } = require("../models/nomination");



Nominationroute.get("/database", async (req, res) => {
    res.send("Working");
});

Nominationroute.post("/create", async ( req,res) =>{
  let body = req.body;
  // console.log(body)
  try {
    let nominemember = await Nomination.create(body);
    res.status(201).json(nominemember);
  } catch (error) {
    res.status(409).json({ message: "member already exist" });
  }
})

Nominationroute.get("/get", async(req,res)=>{
    try {
        const assembly = await Nomination.findAll();
        res.status(200).send(assembly)
    } catch (error) {
        console.log(error)

        res.status(500).json({message : error});
    }
});


Nominationroute.get("/getuserbyid/:id" , async(req,res) => {
    const ID = req.params["id"];
    try {
      const user = await Nomination.findByPk(ID);
      const MEMBER_ID = user.MEMBER_ID;
      
      const STATE_CODE = user.LEVEL1;
      user.dataValues.DOB_PROOF = `https://memberdoc.ycea.in/MEMBERSHIP/${STATE_CODE}/OM/${MEMBER_ID}/${MEMBER_ID}_DOB.jpg`
      user.dataValues.ID_FRONT = `https://memberdoc.ycea.in/MEMBERSHIP/${STATE_CODE}/OM/${MEMBER_ID}/${MEMBER_ID}_ID_FRONT_DOC.jpg`;
      user.dataValues.ID_BACK = `https://memberdoc.ycea.in/MEMBERSHIP/${STATE_CODE}/OM/${MEMBER_ID}/${MEMBER_ID}_ID_BACK_DOC.jpg`;
      user.dataValues.PHOTO_LINK = `https://memberdoc.ycea.in/MEMBERSHIP/${STATE_CODE}/OM/${MEMBER_ID}/${MEMBER_ID}_P.jpg`;
      user.dataValues.VIDEO = `https://memberdoc.ycea.in/MEMBERSHIP/${STATE_CODE}/OM/${MEMBER_ID}/${MEMBER_ID}.mp4`;
      user.dataValues.Caste_Certificate = `https://memberdoc.ycea.in/MEMBERSHIP/${STATE_CODE}/OM/${MEMBER_ID}/${MEMBER_ID}_CATEGORY_DOC.jpg`
      user.dataValues.BPL_CERTIFICATE = `https://memberdoc.ycea.in/MEMBERSHIP/${STATE_CODE}/OM/${MEMBER_ID}/${MEMBER_ID}_BPL_CARD_DOC.jpg`
      // console.log(user)
      res.status(200).send(user);
    } catch (error) {
      console.log(error)
      res
      .status(500)
      .json({ message: "Some thing went wrong in the users search route" });
    }
  });

  Nominationroute.get("/getdatabystatedistrictassembly/:state_code/:district_code/:assembly_code/:key/:value/:CONTESTING_FOR/:BPL_CARD/:COURT_CASE_PENDING/:CRIMINAL_CASES/:PAYMENT_STATUS/:NOMINATION_STATUS/:GENDER/:BLOOD_GROUP/:page" , async (req,res)=> {
      const key = req.params["key"];
      const value = req.params["value"];
      const state_code = req.params["state_code"];
      const district_code = req.params["district_code"];
      const assembly_code = req.params["assembly_code"];
      const CONTESTING_FOR = req.params["CONTESTING_FOR"];
      const BPL_CARD = req.params["BPL_CARD"];
      const COURT_CASE_PENDING = req.params["COURT_CASE_PENDING"];
      const CRIMINAL_CASES = req.params["CRIMINAL_CASES"];
      const PAYMENT_STATUS = req.params["PAYMENT_STATUS"];
      const NOMINATION_STATUS = req.params["NOMINATION_STATUS"];
      const GENDER = req.params["GENDER"];
      const BLOOD_GROUP = req.params["BLOOD_GROUP"]
      const page = req.params["page"] || 1
      try {
        const whereConditions = {};
        if (state_code != 0) {
          whereConditions.state_code = state_code;
        }
    
        if (district_code != 0) {
          whereConditions.district_code = district_code;
        }
    
        if (assembly_code != 0) {
          whereConditions.assembly_code = assembly_code;
        }
  
        if(CONTESTING_FOR != 0){
          whereConditions.CONTESTING_FOR = CONTESTING_FOR
         };

         if(BPL_CARD != 0){
          whereConditions.BPL_CARD = BPL_CARD
         };

         if(COURT_CASE_PENDING != 0){
          whereConditions.COURT_CASE_PENDING = COURT_CASE_PENDING
         };

         if(CRIMINAL_CASES != 0){
          whereConditions.CRIMINAL_CASES = CRIMINAL_CASES
         };

         if(PAYMENT_STATUS != 0){
          whereConditions.PAYMENT_STATUS = PAYMENT_STATUS
         };

         if(NOMINATION_STATUS != 0){
          whereConditions.NOMINATION_STATUS = NOMINATION_STATUS
         };

         if(GENDER != 0){
          whereConditions.GENDER = GENDER
         };

         if(BLOOD_GROUP != 0){
          whereConditions.BLOOD_GROUP = BLOOD_GROUP
         };
  
        if(key === "0" && value === "0"){
          const limit = 100;
          const offset = (page - 1) * limit;
          const userRecords = await Nomination.findAndCountAll({
            where: whereConditions,
            limit: limit,
            offset: offset,
          });
          res.status(200).send(userRecords);
        }else{
          const limit = 100;
          const offset = (page - 1) * limit;
          const lowerCaseValue = value.toLowerCase(); // Convert the query value to lowercase
  
  
      
          const records = await Nomination.findAndCountAll({
            where: {
              ...whereConditions,
              [Op.or]: [
                sequelize.where(sequelize.fn("LOWER", sequelize.col(key)), lowerCaseValue),
                {
                  [key]: {
                    [Op.regexp]: `.*${lowerCaseValue}.*`,
                  },
                },
              ],
            },
            limit: limit,
            offset: offset,
          });
          res.status(200).send(records);
        }
      } catch (error) {
        console.log(error)
        res
        .status(500)
        .json({ message: "Some thing went wrong in the users search route" });
      }
  });


Nominationroute.patch("/update/:id",async(req,res)=>{
    let ID = req.params['id']
    // let venderid = req.body.venderId;
    let updateData = req.body;
    try {
        let updated = await Nomination.update(updateData,{ where : { id : ID} });

        if(updated[0]==1){
            let user = await Nomination.findOne({ where : { id : ID } });
            res.status(200).json (user);
        }else{
            res.status(400).json({message : "No one present with the id"});
        }
    } catch (error) {
        res.status(500).json({message : "something went wrong with the route"});
    }
});



  

module.exports={Nominationroute}