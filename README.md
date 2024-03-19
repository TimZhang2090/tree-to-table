# tree-to-table
Convert tree-structured data to table data, table data has `rowspan` field.

## Installation
npm install tree-to-table  

## Example
[Example Page](https://tree-to-table.vercel.app/)

```js
import TreeToTable from 'tree-to-table'

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

const treeToTableIns = new TreeToTable()

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
`columnNum` in `columns` represents the number of columns in which the cell resides.

`tableColumns` represents the number of columns owned by the table.


## API
```js
// The first parameter specifies the key representing the child node, default is `children`.
// The second specifies the key representing the name, default is `name`.
const treeToTableIns = new TreeToTable('children', 'name')
```

## use in `JSX`
``` jsx
<table>
  <thead>
    <tr>
      {
        Array.from({ length: tableColumns }).map((item, index) => {
          return <th>Level {index + 1}</th>
        })
      }
    </tr>
  </thead>

  <tbody>
    {
      rows.map((oneRow, rowIndex) => {
        return <tr>
          {
            oneRow.columns.map((oneColumn) => {
              return <td rowspan={oneColumn.rowspan}>{ oneColumn.name }</td>
            })
          }
        </tr>
      })
    }
  </tbody>
</table>
```
****