import { APIGatewayEvent, Context, Callback } from "aws-lambda";

interface Input {
  numbers: number[];
}

module.exports.sync = (event, context: Context, callback: Callback) => {
  try {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ result: add(JSON.parse(event.body)) }),
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

module.exports.async = async (event, context: Context, callback: Callback) => {
  try {
    setTimeout(() => {
      add(JSON.parse(event.body));
    }, 5000);
  } catch (e) {
    const errorMessage = e?.message || e;
    console.error(errorMessage);
  }
};

const add = (input: Input): number => {
  console.log("input: %o", input);
  const result: number = input.numbers.reduce((total, number) => total + number, 0);
  console.log("result: " + result);
  return result;
};
