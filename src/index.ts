import "./modules/application/angular/index";
import "./modules/explorer/angular/index";
import "angular";

// load our default (non specific) css
import "font-awesome/css/font-awesome.css";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/screen.scss";

angular.module("app", ["app.application", "app.explorer"]);
angular.bootstrap(document, ["app"], {
    strictDi: true
});
