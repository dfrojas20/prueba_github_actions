import { APIGatewayEvent, Context, Callback } from "aws-lambda";
import * as calcs from "../calcs"

interface Input {
  first_month_salary: any;
  second_month_salary: any;
  third_month_salary: any;
  fourth_month_salary: any;
  fifth_month_salary: any;
  sixth_month_salary: any;
  seventh_month_salary: any;
  eighth_month_salary: any;
  ninth_month_salary: any;
  tenth_month_salary: any;
  eleventh_month_salary: any;
}

const result = {
  anual_islr_amount: null,
  anual_salary_amount: null,
  educational_insurance_amount: null,
  islr_amount: null,
  social_security_amount: null,
  vacation_amount_base: null,
  vacation_amount_net: null,
}

module.exports.sync = (event, context: Context, callback: Callback) => {
  try {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ result: vacations(JSON.parse(event.body)) }),
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

const vacations = (input: Input) => {
  console.log("input: %o", input);

  result.vacation_amount_base = calcs.find_vacation_amount(input);
  result.social_security_amount = calcs.social_security(result.vacation_amount_base, false);
  result.educational_insurance_amount = calcs.educational_insurance(result.vacation_amount_base);

  var period_number = calcs.search_period("Mensual");
  result.anual_salary_amount = calcs.anual_salary(result.vacation_amount_base, period_number);
  result.anual_islr_amount = calcs.anual_islr(result.anual_salary_amount);
  var islr = calcs.islr(result.anual_islr_amount, period_number);
  result.islr_amount = calcs.round(islr, 2);

  result.vacation_amount_net = (result.vacation_amount_base - result.educational_insurance_amount - result.social_security_amount);
  console.log("result: %o", result);
  return result;
};