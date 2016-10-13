export class CallTreeComponent implements ng.IComponentOptions {
    public controller: Function = CallTreeController;
    public template: string = `
    <div>
        <div ng-repeat='line in $ctrl.tree track by $index'>
            {{line}}
        </div>
    </div>`;
    public bindings: { [binding: string]: string } = {
        tree: '='
    };
}

export class CallTreeController {
    tree: Array<string>;

    constructor() {
    }
}
