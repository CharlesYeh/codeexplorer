export class PageExplorerComponent implements ng.IComponentOptions {
    public controller: Function = PageExplorerController;
    public template: string = `
    <div ng-repeat="line in $ctrl.code track by $index">
        <div ng-click="$ctrl.clickLine($index)">{{line}}</div>
    </div>`;
}

export class PageExplorerController {
    classes = [];
    code = [];
    lineToCode = {};

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

        this.classes = [{
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
                "name": "persistCreate",
                "statements": [{
                    "line": 21,
                    "type": "call",
                    "class": "ManagedDataSetPersistenceTask",
                    "method": "syncCreateHiveTable"
                }]
            }, {
                "line": 23,
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
        this.lineToCode = {};
        this.createCodeIndex(this.classes, this.lineToCode);
    }

    public clickLine(index: number) {
        if (index in this.lineToCode) {
            console.log(this.lineToCode[index]);
        }
    }

    createCodeIndex(parseTree, index) {
        for (var codeClass of parseTree) {
            index[codeClass['line']] = codeClass;
            for (var method of codeClass['methods']) {
                this.createCodeIndexMethod(method, index);
            }
        }
    }

    createCodeIndexMethod(method, index) {
        index[method['line']] = method;
        for (var stmt of method['statements']) {
            if (stmt['type'] == "branch") {
                var branches: Array<any> = stmt['branches'];
                for (var branch of branches) {
                    for (var bstmt of branch) {
                        index[bstmt['line']] = bstmt;
                    }
                }
            } else {
                index[stmt['line']] = stmt;
            }
        }
    }
}

