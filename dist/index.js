var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// 1 times BFS
// 4 times DFS
var TreeToTable = /** @class */ (function () {
    function TreeToTable(childNodeKey) {
        if (childNodeKey === void 0) { childNodeKey = 'children'; }
        this.childNodeKey = childNodeKey;
    }
    TreeToTable.prototype.getMaxDepth = function (root) {
        if (!root)
            return 0;
        var queue = [root];
        var deep = 0;
        while (queue.length) {
            var len = queue.length;
            // 把上一轮注入的全部取出
            while (len) {
                var cur = queue.shift();
                if (cur[this.childNodeKey] && cur[this.childNodeKey].length) {
                    queue = __spreadArray(__spreadArray([], queue, true), cur[this.childNodeKey], true);
                }
                len--;
            }
            deep++;
        }
        return deep;
    };
    TreeToTable.prototype.complementEmptyUnit = function (treeNode, curDep) {
        var _a;
        if (curDep < this.maxDep && !((_a = treeNode[this.childNodeKey]) === null || _a === void 0 ? void 0 : _a.length)) {
            // 补一个空节点，显示为空单元格
            treeNode[this.childNodeKey] = [{}];
        }
        if (treeNode[this.childNodeKey] && treeNode[this.childNodeKey].length) {
            for (var _i = 0, _b = treeNode[this.childNodeKey]; _i < _b.length; _i++) {
                var child = _b[_i];
                this.complementEmptyUnit(child, curDep + 1);
            }
        }
    };
    TreeToTable.prototype.calculateSpan = function (treeNode) {
        if (treeNode[this.childNodeKey] && treeNode[this.childNodeKey].length) {
            var occupiedSpan = 0;
            for (var _i = 0, _a = treeNode[this.childNodeKey]; _i < _a.length; _i++) {
                var item = _a[_i];
                this.calculateSpan(item);
                occupiedSpan += item.occupiedSpan;
            }
            treeNode.occupiedSpan = occupiedSpan;
        }
        else {
            treeNode.occupiedSpan = 1;
        }
    };
    TreeToTable.prototype.calculateRowNum = function (treeNode) {
        var _this = this;
        if (treeNode[this.childNodeKey] && treeNode[this.childNodeKey].length) {
            treeNode[this.childNodeKey].forEach(function (item, index) {
                // 首个子元素，所在行数与父节点相同
                if (index === 0) {
                    item.rowNum = treeNode.rowNum;
                }
                else {
                    var preNode = treeNode[_this.childNodeKey][index - 1];
                    // 第二个子元素起，所在行数是 同级前一个节点行数 + Span 值
                    item.rowNum = preNode.rowNum + preNode.occupiedSpan;
                }
                item.columnNum = treeNode.columnNum + 1;
                _this.calculateRowNum(item);
            });
        }
    };
    TreeToTable.prototype.collectItem = function (treeNode, rows) {
        var rowIndex = treeNode.rowNum - 1;
        if (!rows[rowIndex]) {
            rows[rowIndex] = {
                columns: [],
            };
        }
        rows[rowIndex].columns.push({
            rowspan: treeNode.occupiedSpan,
            columnNum: treeNode.columnNum,
            name: treeNode.name,
            attributionType: treeNode.attributionType,
        });
        if (treeNode[this.childNodeKey] && treeNode[this.childNodeKey].length) {
            for (var _i = 0, _a = treeNode[this.childNodeKey]; _i < _a.length; _i++) {
                var item = _a[_i];
                this.collectItem(item, rows);
            }
        }
    };
    TreeToTable.prototype.treeToTable = function (topTreeNode) {
        this.maxDep = this.getMaxDepth(topTreeNode);
        this.complementEmptyUnit(topTreeNode, 1);
        this.calculateSpan(topTreeNode);
        topTreeNode.rowNum = 1;
        topTreeNode.columnNum = 1;
        this.calculateRowNum(topTreeNode);
        var rows = [];
        this.collectItem(topTreeNode, rows);
        return {
            rows: rows,
            // 树的深度 既 表格列数
            tableColumns: this.maxDep,
        };
    };
    return TreeToTable;
}());
export default TreeToTable;
