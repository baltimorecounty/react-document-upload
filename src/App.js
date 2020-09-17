import React from "react";
import { Run, getValue } from "./Startup";
import DocumentUpload from "./component/DocumentUpload";
Run();

function App() {
  return <DocumentUpload apiEndpoint={getValue("apiRoot")} />;
}

export default App;
