import { APIGatewayEvent, Context, Callback } from "aws-lambda";
import * as calcs from "../calcs"

interface Input {
    first_fortnightly_amount: any;
    second_fortnightly_amount: any;
    first_month_amount: any;
    second_month_amount: any;
    third_month_amount: any;
}

const result = {
    average_amount: null,
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
        body: JSON.stringify({ result: thirteenthMonth_exact(JSON.parse(event.body)) }),
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

const thirteenthMonth_exact = (input: Input) => {
    console.log("input: %o", input);

    result.average_amount = calcs.average_amount(parseFloat(input.first_fortnightly_amount), parseFloat(input.second_fortnightly_amount), 
    parseFloat(input.first_month_amount), parseFloat(input.second_month_amount), parseFloat(input.third_month_amount));
    result.thirteenth_month_base = calcs.thirteenth_month(result.average_amount);
    result.social_security_amount = calcs.social_security(result.thirteenth_month_base, true);
    
    var period_number = calcs.search_period("Mensual");
    result.anual_salary_amount = calcs.anual_salary(result.average_amount, period_number);
    result.anual_islr_amount = calcs.anual_islr(result.anual_salary_amount);
    var islr = calcs.islr(result.anual_islr_amount, period_number)/3
    result.islr_amount = calcs.round(islr, 2);

    result.thirteenth_month_net = calcs.round(result.thirteenth_month_base - result.social_security_amount, 2)
    console.log("result: %o", result);
    return result;
};