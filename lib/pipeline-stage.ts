import { Stage, CfnOutput, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DevelopmentTemplateStack } from "./development-template-stack";

/**
 * Deployable unit of Stack
 */
export class PipelineStage extends Stage {
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new DevelopmentTemplateStack(this, `AuthTest`);

    this.urlOutput = service.urlOutput;
  }
}
