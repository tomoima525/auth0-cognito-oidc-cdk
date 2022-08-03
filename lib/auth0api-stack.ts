import { Construct } from "constructs";
import {
  aws_apigateway as apigateway,
  aws_iam as iam,
  aws_lambda_nodejs as lambda,
  CfnOutput,
} from "aws-cdk-lib";

interface Auth0ApiSetupProps {
  authRole: iam.Role;
  helloWorldLambda: lambda.NodejsFunction;
}

export class Auth0ApiSetup extends Construct {
  constructor(scope: Construct, id: string, props: Auth0ApiSetupProps) {
    super(scope, id);

    const api = new apigateway.RestApi(this, "AuthApi", {
      restApiName: "Auth0 protected API",
      description: "Protected API",
      deployOptions: {
        stageName: "dev",
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "x-amz-security-token",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"],
      },
    });

    const { helloWorldLambda } = props;
    const helloWorldResource = api.root.addResource("hello");
    const helloMethod = helloWorldResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(helloWorldLambda),
      {
        authorizationType: apigateway.AuthorizationType.IAM,
      },
    );
    props.authRole.attachInlinePolicy(
      new iam.Policy(this, "Protected", {
        statements: [
          new iam.PolicyStatement({
            actions: ["execute-api:Invoke"],
            effect: iam.Effect.ALLOW,
            resources: [helloMethod.methodArn],
          }),
        ],
      }),
    );
    new CfnOutput(this, "Auth0ApiUrl", { value: api.url });
  }
}
