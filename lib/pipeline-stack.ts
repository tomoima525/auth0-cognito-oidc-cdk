import { Stack, StackProps, aws_iam as iam } from "aws-cdk-lib";
import {
  ShellStep,
  CodePipelineSource,
  CodePipeline,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineStage } from "./pipeline-stage";

// This should be changed per project
const connectionArn = `arn:aws:codestar-connections:${process.env.CDK_DEFAULT_REGION}:${process.env.CDK_DEFAULT_ACCOUNT}:connection/5eb9d94e-d8a4-4102-8571-d1862aad1522`;

/**
 * The stack that defines the application pipeline
 */
export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Check process env passed properly
    if (!connectionArn.includes("us-west-2")) {
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
      dockerEnabledForSynth: true,
      dockerEnabledForSelfMutation: true,
      codeBuildDefaults: {
        rolePolicy: [
          new iam.PolicyStatement({
            actions: ["sts:AssumeRole"],
            resources: ["*"],
          }),
        ],
      },
    });

    pipeline.addStage(new PipelineStage(this, "Dev"));

    // TODO: Add manual approval step for production
  }
}
