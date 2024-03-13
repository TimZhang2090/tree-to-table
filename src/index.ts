// 1 times BFS
// 4 times DFS
export default class TreeToTable {
    private childNodeKey
    private maxDep

    constructor(childNodeKey = 'children') {
      this.childNodeKey = childNodeKey
    }
  
    getMaxDepth(root) {
      if (!root) return 0
  
      let queue = [root]
      let deep = 0
  
      while (queue.length) {
        let len = queue.length
  
        // 把上一轮注入的全部取出
        while (len) {
          const cur = queue.shift()
          if (cur[this.childNodeKey] && cur[this.childNodeKey].length) {
            queue = [...queue, ...cur[this.childNodeKey]]
          }
  
          len--
        }
  
        deep++
      }
  
      return deep
    }
  
    complementEmptyUnit(treeNode, curDep) {
      if (curDep < this.maxDep && !treeNode[this.childNodeKey]?.length) {
        // 补一个空节点，显示为空单元格
        treeNode[this.childNodeKey] = [{}]
      }
  
      if (treeNode[this.childNodeKey] && treeNode[this.childNodeKey].length) {
        for (const child of treeNode[this.childNodeKey]) {
          this.complementEmptyUnit(child, curDep + 1)
        }
      }
    }
  
    calculateSpan(treeNode) {
      if (treeNode[this.childNodeKey] && treeNode[this.childNodeKey].length) {
        let occupiedSpan = 0
  
        for (const item of treeNode[this.childNodeKey]) {
          this.calculateSpan(item)
          occupiedSpan += item.occupiedSpan
        }
  
        treeNode.occupiedSpan = occupiedSpan
      } else {
        treeNode.occupiedSpan = 1
      }
    }
  
    calculateRowNum(treeNode) {
      if (treeNode[this.childNodeKey] && treeNode[this.childNodeKey].length) {
        treeNode[this.childNodeKey].forEach((item, index) => {
          // 首个子元素，所在行数与父节点相同
          if (index === 0) {
            item.rowNum = treeNode.rowNum
          } else {
            const preNode = treeNode[this.childNodeKey][index - 1]
  
            // 第二个子元素起，所在行数是 同级前一个节点行数 + Span 值
            item.rowNum = preNode.rowNum + preNode.occupiedSpan
          }
  
          item.columnNum = treeNode.columnNum + 1
  
          this.calculateRowNum(item)
        })
      }
    }
  
    collectItem(treeNode, rows) {
      const rowIndex = treeNode.rowNum - 1
  
      if (!rows[rowIndex]) {
        rows[rowIndex] = {
          columns: [],
        }
      }
  
      rows[rowIndex].columns.push({
        rowspan: treeNode.occupiedSpan,
        columnNum: treeNode.columnNum,
        name: treeNode.name,
      })
  
      if (treeNode[this.childNodeKey] && treeNode[this.childNodeKey].length) {
        for (const item of treeNode[this.childNodeKey]) {
          this.collectItem(item, rows)
        }
      }
    }
  
    treeToTable(topTreeNode) {
      this.maxDep = this.getMaxDepth(topTreeNode)
  
      this.complementEmptyUnit(topTreeNode, 1)
  
      this.calculateSpan(topTreeNode)
  
      topTreeNode.rowNum = 1
      topTreeNode.columnNum = 1
      this.calculateRowNum(topTreeNode)
  
      const rows = []
      this.collectItem(topTreeNode, rows)
  
      return {
        rows,
        // 树的深度 既 表格列数
        tableColumns: this.maxDep,
      }
    }
  }
  