export const downloadURI = (uri, name) => {
  var link = document.createElement("a");
  link.download = name;
  // Construct the URI
  link.href = uri;
  document.body.appendChild(link);
  link.click();
    // Cleanup the DOM
  document.body.removeChild(link);
};

export const ToStringBase64 = (url) => {
  Buffer.from(url, "binary").toString("base64");
};
