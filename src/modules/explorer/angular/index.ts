import "angular";
import "angular-route";
import {config as routesConfig} from "./configs/routes";
import {PageExplorerComponent} from "./components/pageExplorer/PageExplorerComponent";
import {CallTreeComponent } from "./components/callTree/CallTreeComponent";

angular.module("app.explorer", ["ngRoute"])
    .component("pageExplorer", new PageExplorerComponent())
    .component("callTree", new CallTreeComponent())
    .config(routesConfig);
