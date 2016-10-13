export class PageExplorerComponent implements ng.IComponentOptions {
    public controller: Function = PageExplorerController;
    public template: string = `

    TODO
    <call-tree tree="$ctrl.prestack">{{line}}</call-tree>
    <hr />
    <call-tree tree="$ctrl.stack">{{line}}</call-tree>
    <hr />
    <div ng-repeat="line in $ctrl.code track by $index"
        ng-click="$ctrl.clickLine($index)">
        <pre>{{line}}</pre>
    </div>`;
}

export class PageExplorerController {
    // code and AST tree
    code = [];
    astTree = [];

    mapLineToCode = {};
    mapNameToCode = {};
    mapCallTargetToCode = {};

    // current function stack
    prestack = [];
    stack = [];

    constructor() {
        this.code = `
        class DataSetPersistenceWorker {
            DataSetPersistenceWorker worker;
            public void runOneIteration() {
                processItem();
            }
            public void processItem() {
                if (val) {
                    worker.processCreate();
                } else {
                    worker.processUpdate();
                }
            }
            public void processCreate() {
                ManagedDataSetPersistenceTask.persistCreate();
            }
            public void processUpdate() {
            }
        }
        class ManagedDataSetPersistenceTask {
            public void persistCreate() {
                syncCreateHiveTable();
            }
            public void syncCreateHiveTable() {
                HiveMetadataClient.createTable();
                HiveMetadataClient.createSnapshotTable();
            }
        }`.split("\n");

        this.astTree = [{
            "line": 1,
            "type": "class",
            "name": "DataSetPersistenceWorker",
            "methods": [{
                "line": 3,
                "name": "runOneIteration",
                "statements": [{
                    "line": 4,
                    "type": "call",
                    "class": "DataSetPersistenceWorker",
                    "method": "processItem"
                }]
            }, {
                "line": 6,
                "type": "method",
                "name": "processItem",
                "statements": [{
                    "type": "branch",
                    "branches": [[{
                        "line": 8,
                        "type": "call",
                        "class": "DataSetPersistenceWorker",
                        "method": "processCreate"
                    }], [{
                        "line": 10,
                        "type": "call",
                        "class": "DataSetPersistenceWorker",
                        "method": "processUpdate"
                    }]]
                }]
            }, {
                "line": 13,
                "type": "method",
                "name": "processCreate",
                "statements": [{
                    "line": 14,
                    "type": "call",
                    "class": "ManagedDataSetPersistenceTask",
                    "method": "persistCreate"
                }]
            }, {
                "line": 16,
                "name": "processUpdate",
                "statements": []
            }]
        }, {
            "line": 19,
            "type": "class",
            "name": "ManagedDataSetPersistenceTask",
            "methods": [{
                "line": 20,
                "type": "method",
                "name": "persistCreate",
                "statements": [{
                    "line": 21,
                    "type": "call",
                    "class": "ManagedDataSetPersistenceTask",
                    "method": "syncCreateHiveTable"
                }]
            }, {
                "line": 23,
                "type": "method",
                "name": "syncCreateHiveTable",
                "statements": [{
                    "line": 24,
                    "type": "call",
                    "class": "HiveMetadataClient",
                    "method": "createTable"
                }, {
                    "line": 25,
                    "type": "call",
                    "class": "HiveMetadataClient",
                    "method": "createSnapshotTable"
                }]
            }]
        }];

        this.createCodeIndex(this.astTree);
    }

    public clickLine(index: number) {
        if (index in this.mapLineToCode) {
            let codeBlock = this.mapLineToCode[index];
            this.stack = [];
            this.prestack = [];

            this.addCodeBlockToStack(codeBlock);
            this.addCodeBlockToPrestack(codeBlock);
        }
    }

    addCodeBlockToPrestack(codeBlock: any) {
        this.prestack.push(codeBlock.name);

        switch (codeBlock.type) {
            case "call":
                if (codeBlock.parentMethod in this.mapNameToCode) {
                    this.addCodeBlockToPrestack(this.mapNameToCode[codeBlock.parentMethod]);
                }
                break;
            case "method":
                if (codeBlock.name in this.mapCallTargetToCode) {
                    this.addCodeBlockToPrestack(this.mapCallTargetToCode[codeBlock.name]);
                }
                break;
            case "branch":
                this.addCodeBlockToPrestack(codeBlock.branches[0][0]);
                break;
        }
    }

    // add to stack and traverse downwards
    addCodeBlockToStack(codeBlock: any) {
        this.stack.push(codeBlock.name);
        // TODO: branch, multi statement
        switch (codeBlock.type) {
            case "call":
                let callTarget: string = codeBlock.method;
                if (callTarget in this.mapNameToCode) {
                    this.addCodeBlockToStack(this.mapNameToCode[callTarget]);
                }
                break;
            case "method":
                this.addCodeBlockToStack(codeBlock.statements[0]);
                break;
            case "branch":
                this.addCodeBlockToStack(codeBlock.branches[0][0]);
                break;
        }
    }

    createCodeIndex(parseTree) {
        for (var codeClass of parseTree) {
            this.mapLineToCode[codeClass['line']] = codeClass;
            for (var method of codeClass['methods']) {
                this.createCodeIndexMethod(method);
                this.mapNameToCode[method['name']] = method;
            }
        }
    }

    createCodeIndexMethod(method) {
        this.mapLineToCode[method['line']] = method;
        for (var stmt of method['statements']) {
            if (stmt['type'] == "branch") {
                var branches: Array<any> = stmt['branches'];
                for (var branch of branches) {
                    for (var bstmt of branch) {
                        // tie statement back to method
                        bstmt['parentMethod'] = method.name;

                        this.mapLineToCode[bstmt['line']] = bstmt;
                        this.mapCallTargetToCode[bstmt['method']] = method;
                    }
                }
            } else {
                // tie statement back to method
                stmt['parentMethod'] = method.name;

                this.mapLineToCode[stmt['line']] = stmt;
                this.mapCallTargetToCode[stmt['method']] = method;
            }
        }
    }
}

