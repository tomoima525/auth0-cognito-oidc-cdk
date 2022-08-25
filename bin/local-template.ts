#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DevelopmentTemplateStack } from "../lib/development-template-stack";

const app = new cdk.App();
new DevelopmentTemplateStack(app, `AuthTestLocal`, {
  // Rename your stack name for visibility
});
