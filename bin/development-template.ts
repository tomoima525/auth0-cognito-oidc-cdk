#!/usr/bin/env node
import { randomBytes } from "crypto";
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();
new PipelineStack(app, `AuthTesttomo`, {
  // Rename your stack name for visibility
});

// instantiate with the account and region where we want to deploy
app.synth();
