import "dotenv/config";
import AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

AWS.config.region = process.env.AWS_REGION;
AWS.config.apiVersions = {
  ssm: "2014-11-06",
};

const ssm: AWS.SSM = new AWS.SSM();

const serviceName = process.env.APP_SERVICE_NAME + "-" + process.env.APP_STAGE;
const posfix = process.env.APP_STAGE === "dev" ? "" : "_" + process.env.APP_STAGE;

const plainVariables = {
  APP_SERVICE_NAME: process.env.APP_SERVICE_NAME,
  APP_STAGE: process.env.APP_STAGE,
  AWS_REGION: process.env.AWS_REGION,
};

const secretVariables = {
  // EXAMPLE: process.env[`EXAMPLE${posfix}`],
};

const commonParams = {
  Overwrite: true,
  Tier: "Standard",
};

const main = async () => {
  await Promise.all(
    Object.keys(plainVariables).map(async (variableKey) => {
      await ssm
        .putParameter({
          ...commonParams,
          Name: `${serviceName}-${variableKey}`,
          Value: plainVariables[variableKey],
          Type: "String",
        })
        .promise();
    })
  );

  await Promise.all(
    Object.keys(secretVariables).map(async (variableKey) => {
      await ssm
        .putParameter({
          ...commonParams,
          Name: `${serviceName}-${variableKey}`,
          Value: secretVariables[variableKey],
          Type: "SecureString",
        })
        .promise();
    })
  );
};

main()
  .then(() => {
    console.log(`Env variables for stage: ${plainVariables.APP_STAGE}`);
    console.log("%o", { plainVariables, secretVariables });
  })
  .catch((err: Error) => {
    console.error(err);
  })
  .finally(() => {
    process.exit(0);
  });
