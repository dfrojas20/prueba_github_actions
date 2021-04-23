import { APIGatewayEvent, Context, Callback } from "aws-lambda";
import * as calcs from "../calcs";

interface Input {
  salary: number;
  payment_frecuency: string;
}

const result = {
  salary_amount: null,
  salary_amount_hour: null,
  salary_amount_net: null,
  anual_salary_amount: null,
  social_security_amount: null,
  educational_insurance_amount: null,
  anual_islr_amount: null,
  islr_amount: null,
  payment_frecuency: null,
  conversation: null
};

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

  result.payment_frecuency = input.payment_frecuency;
  result.conversation = "simple_payroll";

  if (input.salary > 50) {
    result.salary_amount = input.salary;
    result.salary_amount_hour = 0;
  } else if (input.salary <= 50) {
    result.salary_amount_hour = input.salary;
    result.salary_amount = calcs.salary_conversion(input.salary, input.payment_frecuency);
  }
  result.social_security_amount = calcs.social_security(result.salary_amount, false);
  result.educational_insurance_amount = calcs.educational_insurance(result.salary_amount);

  var period_number = calcs.search_period(input.payment_frecuency);
  result.anual_salary_amount = calcs.anual_salary(result.salary_amount, period_number);
  result.anual_islr_amount = calcs.anual_islr(result.anual_salary_amount);
  result.islr_amount = calcs.islr(result.anual_islr_amount, period_number);
  result.salary_amount_net = calcs.round(
    result.salary_amount -
      result.social_security_amount -
      result.educational_insurance_amount -
      result.islr_amount,
    2
  );
  console.log("result: %o", result);
  return result;
};
