const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};
exports.handler = async function () {
  return {
    statusCode: 200,
    headers,
    body: `Protected: Hello World!`,
  };
};
