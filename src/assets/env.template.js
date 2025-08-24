// (function(window) {
//   window["env"] = window["env"] || {};
//   // Default fallback (local dev)
//   window["env"]["apiUrl"] = "http://localhost:5000/api";
// })(this);
(function(window) {
  window["env"] = window["env"] || {};
  window["env"]["API_URL"] = "${API_URL}";
})(this);