import { CfnOutput, aws_iam as iam, aws_cognito as cognito } from "aws-cdk-lib";
import { Construct } from "constructs";

// These should be updated based on your project
const clientId = "4YTAHzEge2bYlERdS0eF5Mq2UlpRXXXX";
const providerUrl = "https://dev-a-xxxx.us.auth0.com";
const thumbprint = "B3DD7606D2B5A8B4A13771DBECC9EE1CECAFXXXX";
export class CognitoSetup extends Construct {
  public readonly identityPool: cognito.CfnIdentityPool;
  public readonly userCognitoGroupRole: iam.Role;
  public readonly anonymousCognitoGroupRole: iam.Role;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const provider = new iam.OpenIdConnectProvider(this, "Auth0Provider", {
      url: providerUrl,
      clientIds: [clientId], // audience
      thumbprints: [thumbprint],
    });

    this.identityPool = new cognito.CfnIdentityPool(
      this,
      "auth0-identitypool",
      {
        identityPoolName: "auth0-identity-pool",
        allowUnauthenticatedIdentities: true,
        openIdConnectProviderArns: [provider.openIdConnectProviderArn],
      },
    );

    this.anonymousCognitoGroupRole = new iam.Role(
      this,
      "auth0-anon-group-role",
      {
        description: "Default role for anonymous users",
        assumedBy: new iam.FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity",
        ),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole",
          ),
        ],
      },
    );

    this.userCognitoGroupRole = new iam.Role(this, "auth0-auth-group-role", {
      description: "Default role for authenticated users",
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole",
        ),
      ],
    });

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      "auth0-identitypool-role-attachment",
      {
        identityPoolId: this.identityPool.ref,
        roles: {
          authenticated: this.userCognitoGroupRole.roleArn,
          unauthenticated: this.anonymousCognitoGroupRole.roleArn,
        },
      },
    );

    new CfnOutput(this, "identityPoolId", {
      value: this.identityPool.ref,
    });
  }
}
