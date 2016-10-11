import "angular";
import "angular-route";
import {config as routesConfig} from "./configs/routes";
import {PageExplorerComponent} from "./components/pageExplorer/PageExplorerComponent";

angular.module("app.explorer", ["ngRoute"])
    .component("pageExplorer", new PageExplorerComponent())
    .config(routesConfig);
