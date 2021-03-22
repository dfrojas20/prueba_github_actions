import { APIGatewayEvent, Context, Callback } from "aws-lambda";

interface Input {
    salary: number;
    payment_frecuency: string;
}

const result = {
  salary_amount: null,
  salary_amount_hour: null,
  salary_amount_net: null,
  social_security_amount: null,
  edcucational_insurance_amount: null,
  anual_islr_amount: null,
  islr_amount: null
}

module.exports.sync = (event, context: Context, callback: Callback) => {
    try {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ result: simplePayroll(JSON.parse(event.body)) }),
      });
    } catch (e) {
      const errorMessage = e?.message || e;
      console.error(errorMessage);
      callback(null, {
        statusCode: e.statusCode || 500,
        body: JSON.stringify({ message: errorMessage }),
      });
    }
  };

const simplePayroll = (input: Input) => {
    console.log("input: %o", input);
    if (input.salary > 50){
      result.salary_amount = input.salary;
    }
    else if (input.salary<= 50){
      result.salary_amount_hour = input.salary;
      result.salary_amount = salary_conversion(input.salary, input.payment_frecuency);
    }
    result.social_security_amount = social_security(result.salary_amount);
    result.edcucational_insurance_amount = edcucational_insurance(result.salary_amount);
    var period_number = search_period(input.payment_frecuency);
    result.anual_islr_amount = anual_islr(result.salary_amount, period_number);
    result.islr_amount = islr(result.anual_islr_amount, period_number)
    result.salary_amount_net = result.salary_amount - result.social_security_amount - result.edcucational_insurance_amount - result.islr_amount;
    console.log("result: %o", result);
    return result;
};

var social_security = (salary) => {
  var socialSecurity = (salary * 0.0975);
  return socialSecurity;
}

var edcucational_insurance = (salary) => {
  var edcucationalInsurance = (salary * 0.0125);
  return edcucationalInsurance;
}

var search_period = (payment_frecuency) => {
  var period_number = null;
  if (payment_frecuency == "Semanal"){
    period_number = 56.33;
  }
  else if (payment_frecuency == "Bisemanal"){
    period_number = 28.17;
  }
  else if (payment_frecuency == "Quincenal"){
    period_number = 26;
  }
  else if (payment_frecuency == "Mensual"){
    period_number = 13;
  }
  return period_number
}

var anual_islr = (salary, period_number) => {
  var islr_amount = 0
  var anual_salary = salary * period_number;
  if (anual_salary <= 11000){
    return islr_amount;
  }
  else if (anual_salary > 11000 || anual_salary <= 50000){
    islr_amount = (anual_salary - 11000)* 0.15;
  }
  else if (anual_salary > 50000) {
    var islr_amount_first = (anual_salary - 50000) * 0.25;
    var islr_amount_second = 50000 * 0.15;
    islr_amount = islr_amount_first + islr_amount_second;
  }
  return islr_amount;
}

var islr = (anual_islr_amount, period_number) => {
  var islr_amount = anual_islr_amount / period_number;
  return islr_amount;
}

var salary_conversion = (salary, payment_frecuency) => {
  var salary_amount = null;
  if (payment_frecuency == "Semanal"){
    salary_amount = salary * 48;
  }
  else if (payment_frecuency == "Bisemanal"){
    salary_amount = salary * 96;
  }
  else if (payment_frecuency == "Quincenal"){
    salary_amount = salary * 120;
  }
  else if (payment_frecuency == "Mensual"){
    salary_amount = salary * 207.84;
  }
  return salary_amount;
}