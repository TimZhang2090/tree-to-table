# tree-to-table
Convert tree-structured data to table data, table data has `rowspan` field.

## Installation
npm install tree-to-table  

## Example
```js
import TreeToTable from 'tree-to-table'
const treeToTableIns = new TreeToTable('children')

let treeData = {
  name: '1-1',
  children: [
    {
      name: '2-1',
      children: [
        {
            name: '3-1',
        },
        {
            name: '3-2',
        },
      ]
    },
    {
        name: '2-2'
    }
  ],
}

const { rows, tableColumns } = treeToTableIns.treeToTable(treeData)
// console.log('rows :', rows)
// [
//     {
//         "columns": [
//             {
//                 "rowspan": 3,
//                 "columnNum": 1,
//                 "name": "1-1"
//             },
//             {
//                 "rowspan": 2,
//                 "columnNum": 2,
//                 "name": "2-1"
//             },
//             {
//                 "rowspan": 1,
//                 "columnNum": 3,
//                 "name": "3-1"
//             }
//         ]
//     },
//     {
//         "columns": [
//             {
//                 "rowspan": 1,
//                 "columnNum": 3,
//                 "name": "3-2"
//             }
//         ]
//     },
//     {
//         "columns": [
//             {
//                 "rowspan": 1,
//                 "columnNum": 2,
//                 "name": "2-2"
//             },
//             {
//                 "rowspan": 1,
//                 "columnNum": 3
//             }
//         ]
//     }
// ]
```

`columnNum` in `columns` means the column in which the cell resides.

`tableColumns` means the number of columns in the table.

[Live Example](https://tree-to-table.vercel.app/)
