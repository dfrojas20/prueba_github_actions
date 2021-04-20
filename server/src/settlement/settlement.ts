import { APIGatewayEvent, Context, Callback } from "aws-lambda";
import * as calcs from "../calcs";

interface Input {
  salary_input: number;
  accumulated_salary_input: number;
  settlement_entry_date: Date;
  settlement_egress_date: Date;
  settlement_dismissal_type: string;
}

const result = {
  total_years: null,
  extra_month: null,
  average_weekly_salary: null,
  seniority_premium: null,
  social_security_amount: null,
  educational_insurance_amount: null,
  total_settlement_amount: null,
};

module.exports.sync = (event, context: Context, callback: Callback) => {
  try {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ result: settlement(JSON.parse(event.body)) }),
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

const settlement = (input: Input) => {
  console.log("input: %o", input);
  var settlement_entry_reformated = reformateDate(input.settlement_entry_date);
  var settlement_egress_reformated = reformateDate(input.settlement_egress_date);
  var settlement_entry_year = parseInt(settlement_entry_reformated[0]);
  var settlement_egress_year = parseInt(settlement_egress_reformated[0]);

  result.total_years = calcs.total_years(settlement_entry_year, settlement_egress_year);
  result.average_weekly_salary = calcs.average_weekly_salary(input.accumulated_salary_input, result.total_years);
  result.extra_month = parseInt(settlement_egress_reformated[1]);

  result.seniority_premium = calcs.seniority_premium(
    result.average_weekly_salary,
    result.total_years,
    input.settlement_dismissal_type,
    result.extra_month
  );
  result.social_security_amount = calcs.social_security(result.seniority_premium, false);
  result.educational_insurance_amount = calcs.educational_insurance(result.seniority_premium);
  result.total_settlement_amount = calcs.round(
    result.seniority_premium - result.social_security_amount - result.educational_insurance_amount,
    2
  );
  return result;
};

function reformateDate(date) {
  var date_split = date.split("T");
  var date_reformated = date_split[0].split("-");
  return date_reformated;
}
