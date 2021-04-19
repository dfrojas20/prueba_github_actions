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
  average_weekly_salary: null,
  seniority_premium: null,
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
  var settlement_entry_year = getYear(input.settlement_entry_date);
  var settlement_egress_year = getYear(input.settlement_egress_date);
  result.total_years = calcs.total_years(settlement_entry_year, settlement_egress_year);
  result.average_weekly_salary = calcs.average_weekly_salary(input.accumulated_salary_input);
  var extra_month = getMonth(input.settlement_egress_date);
  result.seniority_premium = calcs.seniority_premium(
    result.average_weekly_salary,
    result.total_years,
    input.settlement_dismissal_type,
    extra_month
  );
  return result;
};

function getYear(date) {
  var date_reformated = date.split("T");
  var year = date_reformated[0].split("-");
  return year[0];
}

function getMonth(date) {
  var date_reformated = date.split("T");
  var month = date_reformated[0].split("-");
  return month[1];
}
