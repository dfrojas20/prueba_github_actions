import { APIGatewayEvent, Context, Callback } from "aws-lambda";

interface Input {
  numbers: number[];
}

module.exports.handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  try {
    const input: Input = JSON.parse(event.body);
    console.log("input: %o", input);

    const result: number = input.numbers.reduce((total, number) => total + number, 0);
    console.log("result: " + result);

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ result }),
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
