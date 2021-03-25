import { APIGatewayEvent, Context, Callback } from "aws-lambda";
import * as calcs from "../calcs"

interface Input {
    salary: number;
    payment_frecuency: string;
}

const result = {
  salary_amount: null,
  salary_amount_hour: null,
  monthly_salary: null,
  thirteenth_month_base: null,
  thirteenth_month_net: null,
  anual_salary_amount: null,
  social_security_amount: null,
  anual_islr_amount: null,
  islr_amount: null
}

module.exports.sync = (event, context: Context, callback: Callback) => {
    try {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ result: thirteenthMonth(JSON.parse(event.body)) }),
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

const thirteenthMonth = (input: Input) => {
    console.log("input: %o", input);
    if (input.salary > 50){
      result.salary_amount = input.salary;
      result.salary_amount_hour = 0;
    }
    else if (input.salary<= 50){
      result.salary_amount_hour = input.salary;
      result.salary_amount = calcs.salary_conversion(input.salary, input.payment_frecuency);
    }
    var period_number = calcs.search_period(input.payment_frecuency);
    result.monthly_salary = calcs.monthly_salary(result.salary_amount, input.payment_frecuency);
    result.thirteenth_month_base = calcs.thirteenth_month(result.monthly_salary);
    result.social_security_amount = calcs.social_security(result.thirteenth_month_base, true);

    result.anual_salary_amount = calcs.anual_salary(result.monthly_salary, period_number);
    result.anual_islr_amount = calcs.anual_islr(result.anual_salary_amount);
    result.islr_amount = calcs.islr(result.anual_islr_amount, period_number);

    result.thirteenth_month_net = calcs.round(result.thirteenth_month_base - result.social_security_amount - result.islr_amount, 2)
    console.log("result: %o", result);
    return result;
};