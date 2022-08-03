import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Auth0ApiSetup } from "./auth0api-stack";
import { CognitoSetup } from "./cognito-stack";
import { LambdaSetup } from "./lambda-stack";

export class DevelopmentTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Cognito
    const cognito = new CognitoSetup(this, "Cognito");

    // lambda
    const lambda = new LambdaSetup(this, "Lambda");

    // API Gateway
    new Auth0ApiSetup(this, "APIGateway", {
      authRole: cognito.userCognitoGroupRole,
      helloWorldLambda: lambda.helloWorld,
    });
  }
}
