import { Stack, StackProps } from "aws-cdk-lib";
import {
  ShellStep,
  CodePipelineSource,
  CodePipeline,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

const connectionArn = process.env.CONNECTION_ARN as string;
/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    if (!connectionArn) {
      throw new Error("No connection Arn");
    }
    const input = CodePipelineSource.connection(
      "tomoima525/auth0-cognito-oidc-cdk",
      "main",
      {
        connectionArn,
      },
    );
    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "Auth0Test",
      synth: new ShellStep("Synth", {
        input,
        commands: ["yarn install --immutable", "yarn cdk synth"],
      }),
    });
  }
}
