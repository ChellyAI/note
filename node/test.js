const fs = require('fs');
const readline = require('readline');

main();

function main () {
  // duwen 
  const readliner = readline.createInterface({
    input: fs.createReadStream('./test.txt')
  });

  const rightList = []
  readliner.on('line', function(chunk) {
    rightList.push(chunk)
  })

  readliner.on('close', function() {
    const obj = {}
    lines.forEach(line => {
      if (!line) {
        return
      }
      const item = JSON.parse(line)
      const index = item.__CONTENT__.indexOf('channelappid')
      const id = item.__CONTENT__.substring(index + 15, index + 25)
      if (!obj[id]) {
        obj[id] = []
      }
      obj[id].push(line)
    })

    let len = 0
    const keys = Object.keys(obj)
    keys.forEach(key => {
      len += obj[key].length
      console.log(key, obj[key].length)
    })
    console.log('总数量', len)
    console.log('执行结束')
  })





  // // 读取文件
  // const file = fs.readFileSync('./test.txt', { encoding: 'utf-8' });
  // // 处理行数
  // const lines = file.split('\n');
  // // 对每条行判断对错，对的记录下来
  // const rightList = []
  // lines.forEach(line => {
  //   rightList.push(line)
  // })

  // const obj = {}
  // lines.forEach(line => {
  //   if (!line) {
  //     return
  //   }
  //   const item = JSON.parse(line)
  //   const index = item.__CONTENT__.indexOf('channelappid')
  //   const id = item.__CONTENT__.substring(index + 15, index + 25)
  //   if (!obj[id]) {
  //     obj[id] = []
  //   }
  //   obj[id].push(line)
  // })

  // let len = 0
  // const keys = Object.keys(obj)
  // keys.forEach(key => {
  //   len += obj[key].length
  //   console.log(key, obj[key].length)
  // })
  // console.log('总数量', len)

  // // 写入文件
  // // fs.writeFileSync('./errorList.txt', errorList, { encoding: 'utf-8' })
  // // fs.writeFileSync('./rightList.txt', rightList, { encoding: 'utf-8' })
  // console.log('执行结束')
}