import configJson from "./auth_config.json";

export function getConfig() {
  return {
    domain: configJson.domain,
    clientId: configJson.clientId,
    apiUrl: process.env.REACT_APP_AUTH_ENDPOINT,
    authEndpoint: process.env.REACT_APP_AUTH_ENDPOINT,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    openidProvider: process.env.REACT_APP_OPENID_PROVIDER
  };
}
