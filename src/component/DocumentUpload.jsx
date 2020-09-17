import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const DocumentUpload = (props) => {
  const [selectedFile, setselectedFile] = useState(null);

  const maxSelectFile = (files) => {
    if (files.length > 3) {
      const msg = "Only 3 images can be uploaded at a time";
      document.getElementById("multifile").value = ""; // discard selected file
      toast.warning(msg);
      return false;
    }
    return true;
  };

  const checkMimeType = (files) => {
    let err = "";
    // list allow mime type
    const types = ["image/png", "image/jpeg", "image/gif", "application/pdf"];

    // if (types.every(type => files.forEach(e => e.type !== type))) {
    //   // create error message and assign to container
    //   console.log("type does not match");
    //   err += e => e.type + " is not a supported format\n";
    // }
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every((type) => files[x].type !== type)) {
        // create error message and assign to container
        err += files[x].type + " is not a supported format\n";
      }
    }

    if (err !== "") {
      // if message not same old that mean has error
      document.getElementById("multifile").value = ""; // discard selected file
      toast.error(err);
      return false;
    }
    return true;
  };
  const onChangeHandler = (files) => {
    if (maxSelectFile(files) && checkMimeType(files)) {
      removeElement("gallery");

      // files.forEach(previewFile);
      for (var x = 0; x < files.length; x++) {
        previewFile(files[x]);
      }
      setselectedFile(files);
    }
  };

  useEffect(() => {
    let dropArea = document.getElementById("drop-area");
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });
    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });

    //Handle dropped files
    dropArea.addEventListener("drop", handleDrop, false);
  }, ["dragenter", "dragover", "dragleave", "drop"]);

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const highlight = (e) => {
    document.getElementById("drop-area").classList.add("highlight");
  };

  const unhighlight = (e) => {
    document.getElementById("drop-area").classList.remove("active");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    onChangeHandler(event.dataTransfer.files);
  };
  const previewFile = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      let img = document.createElement("img");
      img.src = reader.result;
      document.getElementById("gallery").appendChild(img);
    };
  };
  const removeElement = (elementId) => {
    var element = document.getElementById(elementId);
    element.innerHTML = "";
    setselectedFile(null);
  };

  const onClickClear = () => {
    setselectedFile(null);
    removeElement("gallery");
    document.getElementById("multifile").value = "";
  };

  const onClickHandler = () => {
    if (selectedFile !== null) {
      const data = new FormData();
      for (var x = 0; x < selectedFile.length; x++) {
        data.append("files", selectedFile[x]);
      }

      axios
        .post(
          "https://localhost:44393/api/FileUpload",
          data
          // , {
          //   onUploadProgress: ProgressEvent => {
          //     this.setState({
          //       loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
          //     });
          //   }
          // }
        )
        .then((res) => {
          // then print response status
          toast.success("upload success");
          onClickClear();
        })
        .catch((err) => {
          toast.error("upload fail");
        });
    }
  };

  const ActionButtons = (
    <div>
      <button type="button" className="dg_button" onClick={onClickHandler}>
        Upload
      </button>
      <button type="button" className="dg_button" onClick={onClickClear}>
        Clear
      </button>
    </div>
  );

  return (
    <div id="drop-area" style={{ border: "none" }}>
      <form className="my-form">
        <input
          id="multifile"
          type="file"
          multiple={true}
          onChange={(e) => onChangeHandler(e.target.files)}
        />
        <div className="form-group">
          <ToastContainer />
        </div>
      </form>
      <div id="gallery"></div>
      {selectedFile ? ActionButtons : null}
    </div>
  );
};
export default DocumentUpload;
