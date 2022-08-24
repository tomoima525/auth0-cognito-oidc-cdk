import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Auth0ApiSetup } from "./auth0api-stack";
import { CognitoSetup } from "./cognito-stack";
import { LambdaSetup } from "./lambda-stack";

export class DevelopmentTemplateStack extends Stack {
  /**
   * The URL of the API Gateway endpoint, for use in the integ tests
   */
  public readonly urlOutput: CfnOutput;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Cognito
    const cognito = new CognitoSetup(this, "Cognito");

    // lambda
    const lambda = new LambdaSetup(this, "Lambda");

    // API Gateway
    const authApi = new Auth0ApiSetup(this, "APIGateway", {
      authRole: cognito.userCognitoGroupRole,
      helloWorldLambda: lambda.helloWorld,
    });
    this.urlOutput = new CfnOutput(this, "Auth0ApiUrl", {
      value: authApi.api.url,
    });
  }
}
