const errors = {
    NO_RULE_FIELD: "NO_RULE_FIELD",//
    NO_DATA_FIELD: "NO_DATA_FIELD",//
    NO_RULE_DOT_FIELD: "NO_RULE_DOT_FIELD",//
    NO_RULE_DOT_CONDITION: "NO_RULE_DOT_CONDITION",//
    NO_RULE_DOT_CONDITION_VALUE: "NO_RULE_DOT_CONDITION_VALUE",//
    INVALID_RULE_DOT_FIELD_TYPE: "INVALID_RULE_DOT_FIELD_TYPE",
    INVALID_RULE_DOT_CONDITION: "INVALID_RULE_DOT_CONDITION",
    INVALID_DATA_FIELD_TYPE: "INVALID_DATA_FIELD_TYPE",
  };

const missingFieldMessageGenerator = (message) =>{
    let field;
    
    if (message === errors.NO_RULE_FIELD){
        field = "rule";
    }else if (message === errors.NO_DATA_FIELD){
        field = "data";
    }else if (message === errors.NO_RULE_DOT_FIELD){
        field = "rule.field";
    }else if (message === errors.NO_RULE_DOT_CONDITION) {
        field = "rule.condition";
    } else if (message === errors.NO_RULE_DOT_CONDITION_VALUE){
        field = "rule.condition_value";
    }

    return {
        message: `${field} is required.`,
        status: "error",
        data: null,
      }
}



module.exports = {
    missingFieldMessageGenerator,
    errors
}