import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoSetup } from "./cognito-stack";

export class DevelopmentTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Reference your resouces
    // Cognito
    new CognitoSetup(this, "Cognito");
  }
}
