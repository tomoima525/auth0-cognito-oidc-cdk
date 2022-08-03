import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";

export const ExternalApiComponent = () => {
  const history = useHistory();
  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const callApi = async () => {
    try {
      const response = await API.get("Auth0API", "/hello")
      console.log({ response });

      setState({
        ...state,
        showResult: true,
        apiMessage: response,
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        error,
      });
    }
  };

  const redirectLogin = () => {
    history.replace("/");
  }

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };
  console.log({ state });
  return (
    <>
      <div className="mb-5">
        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, redirectLogin)}
            >
              log in again
            </a>
          </Alert>
        )}

        <h1>External API</h1>
        <p className="lead">
          Ping an external API by clicking the button below.
        </p>

        <p>
          This will call Protected APIGateway. It will fail unless you have signed in.
        </p>


        <Button
          color="primary"
          className="mt-5"
          onClick={callApi}
        >
          Ping API
        </Button>
      </div>

      <div className="result-block-container">
        {state.showResult && (
          <div className="result-block" data-testid="api-result">
            <h6 className="muted">Result</h6>
            <Highlight>
              <span>{JSON.stringify(state.apiMessage, null, 2)}</span>
            </Highlight>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});
