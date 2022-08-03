import {
  Aws,
  aws_lambda_nodejs as lambda_nodejs,
  aws_dynamodb as dynamodb,
  aws_cognito as cognito,
  aws_lambda as lambda,
  Duration,
} from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as path from "path";

export class LambdaSetup extends Construct {
  public readonly helloWorld: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.helloWorld = new lambda_nodejs.NodejsFunction(this, "helloWorld", {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: "handler",
      entry: path.join(`${__dirname}/../`, "functions", "hello/index.ts"),
    });
  }
}
