import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Progress } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0,
      uploaded: 0
    };
  }

  maxSelectFile = event => {
    let files = event.target.files; // create file object
    if (files.length > 3) {
      const msg = "Only 3 images can be uploaded at a time";
      event.target.value = null; // discard selected file
     // console.log(msg);
      toast.warning(msg);
      return false;
    }
    return true;
  };

  checkMimeType = event => {
    //getting file object
    let files = event.target.files;
    //define message container
    let err = "";
    // list allow mime type
    const types = ["image/png", "image/jpeg", "image/gif", "application/pdf"];
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container
        err += files[x].type + " is not a supported format\n";
      }
    }

    if (err !== "") {
      // if message not same old that mean has error
      event.target.value = null; // discard selected file
      toast.error(err);
      return false;
    }
    return true;
  };

  checkFileSize = event => {
    let files = event.target.files;
    let size = 15000;
    let err = "";
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err += files[x].type + "is too large, please pick a smaller file\n";
      }
    }
    if (err !== "") {
      event.target.value = null;
      console.log(err);
      return false;
    }

    return true;
  };
  onChangeHandler = event => {
    var files = event.target.files;
    if (this.maxSelectFile(event) && this.checkMimeType(event)) {
      // && this.checkMimeType(event)){
      // &&    this.checkMimeType(event){}
      // if return true allow to setState
      this.setState({
        selectedFile: files
      });
    }
    //  console.log(files);
  };
  onClickHandler = () => {
    if (this.state.selectedFile !== null) {
      const data = new FormData();
      for (var x = 0; x < this.state.selectedFile.length; x++) {
        data.append("files", this.state.selectedFile[x]);
      }

      axios
        .post("https://localhost:44363/api/FileUpload", data, {
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
            });
          }
        })
        .then(res => {
          // then print response status
          toast.success("upload success");

          this.setState({
            selectedFile: null,
            loaded: 0
          });
        })
        .catch(err => {
          toast.error("upload fail");
        });
      // Clear percentage
      //  setTimeout(() => this.setState({ loaded: 0 }), 10000);
      document.getElementById("multifile").value = "";
    }
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group files">
                <label>Upload Your File </label>
                <input
                  id="multifile"
                  type="file"
                  className="form-control"
                  multiple
                  onChange={this.onChangeHandler}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <ToastContainer />
        </div>

        <input
          type="button"
          value="Upload"
          class="btn btn-success btn-block"
          onClick={this.onClickHandler}
        />
      </div>
    );
  }
}

export default App;
