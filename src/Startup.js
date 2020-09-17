import "@baltimorecounty/dotgov-components/lib/styles/dotgov.min.css";

import { Config } from "@baltimorecounty/javascript-utilities";

const { setConfig, getValue } = Config;

const testApiRoot =
  "https://testservices.baltimorecountymd.gov/api/hub/structuredContent/FileUpload";
const prodApiRoot =
  "https://services.baltimorecountymd.gov/hub/api/hub/structuredContent/FileUpload";

// HACK - the Config utiltiy does not account for beta.
// TODO: This will need to be addressed when we get closer to launch
const localApiRoot =
  window.location.hostname.indexOf("beta") > -1
    ? testApiRoot
    : "http://localhost:54727/api/hub/structuredContent/FileUpload";

const configValues = {
  local: {
    apiRoot: localApiRoot,
  },
  development: {
    apiRoot: testApiRoot,
  },
  staging: {
    apiRoot: testApiRoot,
  },
  production: {
    apiRoot: prodApiRoot,
  },
};

/**
 * Runs startup code for our create react app
 */
const Run = () => {
  setConfig(configValues);
};

export { Run, getValue };
