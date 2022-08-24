import { Stage, CfnOutput, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { randomBytes } from "crypto";
import { DevelopmentTemplateStack } from "./development-template-stack";

const envname = process.env.YOUR_NAME || randomBytes(10).toString("hex");

/**
 * Deployable unit of Stack
 */
export class PipelineStage extends Stage {
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new DevelopmentTemplateStack(this, `AuthTest${envname}`);

    this.urlOutput = service.urlOutput;
  }
}
