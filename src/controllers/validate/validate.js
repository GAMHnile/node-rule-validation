const Yup = require("yup");
//import errors constants to use with schema validation 
const { errors, missingFieldMessageGenerator } = require("./validateUtilities");

const validateHandler = (req, res) => {
    const { body } = req;
    console.log(body);
    if (typeof body !== "object" || Array.isArray(body) ){
      return res.status(400).json({
        message: "Invalid JSON payload passed.",
        status: "error",
        data: null
      }
      );
    }

    // create request schema with yup
  
    //main issues how to make sure object is required before validating its properties
    const requestSchema = Yup.object().shape({
      rule: Yup.object().required(errors.NO_RULE_FIELD).shape({
          field: Yup.mixed()
            .required(errors.NO_RULE_DOT_FIELD)
            .test(
              "is valid rule.field",
              errors.INVALID_RULE_DOT_FIELD_TYPE,
              (value) => {
                const isString = typeof value === "string" ? true : false;
                const isNumber = typeof value === "number" ? true : false;
                return isString || isNumber;
              }
            ), //confirm it is required
          condition: Yup.mixed()
            .required(errors.NO_RULE_DOT_CONDITION)
            .oneOf(
              ["eq", "neq", "gt", "gte", "contains"],
              errors.INVALID_RULE_DOT_CONDITION
            ),
          condition_value: Yup.mixed().required(
            errors.NO_RULE_DOT_CONDITION_VALUE
          ),
        }),
      data: Yup.mixed()
        .required(errors.NO_DATA_FIELD)
        .test("is data valid", errors.INVALID_DATA_FIELD_TYPE, (value) => {
          const isObject = typeof value === "object" ? true : false;
          const isString = typeof value === "string" ? true : false;
          return Array.isArray(value) || isObject || isString;
        }),
    });
    
  //check that rule key is available
    try{
      if (body.rule === undefined) {
          throw new Error(errors.NO_RULE_FIELD);
      }
    } catch (err){
      if (err.message === errors.NO_RULE_FIELD) {
        return res.status(400).json(missingFieldMessageGenerator(errors.NO_RULE_FIELD));
      }
    }
    requestSchema.validate(body).catch((err) => {
      //return res.json(err);
      const error = err.message;
      if (error === errors.NO_RULE_FIELD) {
        return res.status(400).json(missingFieldMessageGenerator(errors.NO_RULE_FIELD));
      }
      if (error === errors.NO_DATA_FIELD) {
        return res.status(400).json(missingFieldMessageGenerator(errors.NO_DATA_FIELD));
      }
      if (error === errors.NO_RULE_DOT_FIELD) {
        return res.status(400).json(missingFieldMessageGenerator(errors.NO_RULE_DOT_FIELD));
      }
      if (error === errors.NO_RULE_DOT_CONDITION) {
        return res.status(400).json(missingFieldMessageGenerator(errors.NO_RULE_DOT_CONDITION));
      }
      if (error === errors.NO_RULE_DOT_CONDITION_VALUE) {
        return res.status(400).json(missingFieldMessageGenerator(errors.NO_RULE_DOT_CONDITION_VALUE));
      }
      if (error === errors.INVALID_DATA_FIELD_TYPE) {
        return res.status(400).json({
          message: "data should be an object, an array, or a string.",
          status: "error",
          data: null,
        });
      }
      if (error === errors.INVALID_RULE_DOT_CONDITION) {
        return res.status(400).json({
          message: "field.condition should be one of 'eq', 'neq', 'gt', 'gte', 'contains'.",
          status: "error",
          data: null,
        });
      }
  
      if (error === errors.INVALID_RULE_DOT_FIELD_TYPE) {
        return res.status(400).json({
          message: "rule.field should be a number, or a string.",
          status: "error",
          data: null,
        });
      }
      
    });
    //handle invalid json payload case
  
    //check if field from rule is missing in data
    if(body.data[body.rule.field] === undefined){
      return res.status(400).json({
        message: `field ${body.rule.field} is missing from data.`,
        status: "error",
        data: null
      })
    }
    //if request is valid perform rule comparism
    //'eq', 'neq', 'gt', 'gte', 'contains'
    const ruleCondition = {
      eq: 'eq',
      neq: 'neq',
      gt: 'gt',
      gte: 'gte',
      contains: 'contains'
    }
  
    const successResponse = {
      message: `field ${body.rule.field} successfully validated.`,
      status: "success",
      data: {
        validation: {
          error: false,
          field: body.rule.field,
          field_value: body.data[body.rule.field],
          condition: body.rule.condition,
          condition_value: body.rule.condition_value
        }
      }
    }
  
    const failureResponse = {
      message: `field ${body.rule.field} failed validation.`,
      status: "error",
      data: {
        validation: {
          error: true,
          field: body.rule.field,
          field_value: body.data[body.rule.field],
          condition: body.rule.condition,
          condition_value: body.rule.condition_value
        }
      }
    }
    //swith based on rule.condition
    switch (body.rule.condition){
      case ruleCondition.eq:
        if(body.data[body.rule.field] === body.rule.condition_value){
         return res.status(200).json(successResponse);
        }else {
          return res.status(400).json(failureResponse);
        }
      case ruleCondition.neq:
        if(body.data[body.rule.field] !== body.rule.condition_value){
          return res.status(200).json(successResponse);
         }else {
           return res.status(400).json(failureResponse);
         }
      case ruleCondition.gt:
        if(body.data[body.rule.field] > body.rule.condition_value){
          return res.status(200).json(successResponse);
         }else {
           return res.status(400).json(failureResponse);
         }
      case ruleCondition.gte:
        if(body.data[body.rule.field] >= body.rule.condition_value){
          return res.status(200).json(successResponse);
         }else {
           return res.status(400).json(failureResponse);
         }
  
      case ruleCondition.contains:
        if(body.data[body.rule.field].includes(body.rule.condition_value)){
          return res.status(200).json(successResponse);
         }else {
           return res.status(400).json(failureResponse);
         }
    }
  }


module.exports = {validateHandler};