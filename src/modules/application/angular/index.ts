import "angular";

import {StarComponent} from "./components/star/StarComponent";
import {CodeViewerApplicationComponent} from "./components/codeViewerApplication/CodeViewerApplicationComponent";
angular.module("app.application", [])
    .component("codeViewerApplication", new CodeViewerApplicationComponent())
    .component("star",  new StarComponent());
