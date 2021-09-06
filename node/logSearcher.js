const fs = require('fs');

const url = './logs/' // 需要查找文件的路由
const findKeyList = [
  'ERROR',
  'AND',
  'EXCEPTION'
] // 需要查找的字符串列表

main(); // 执行主函数

function main() {
  // 读取相关数据
  const folders = getFolderContent(url, 'folder')
  const folderObj = {}
  folders.forEach(folder => {
    const folderUrl = url + folder
    const files = getFolderContent(folderUrl, 'file')
    // 开始读取文件
    files.forEach(file => {
      const fileUrl = url + folder + '/' + file
      const fileData = fs.readFileSync(fileUrl, { encoding: 'utf-8' })
      const fileLines = fileData.split('\n')
      // 根据不同的错误开始提取
      findKeyList.forEach(key => {
        const errIndexList = searchLineString(fileLines, key)

        if (errIndexList.length) {
          if (!folderObj[folder]) {
            folderObj[folder] = {}
          }
          if (!folderObj[folder][file]) {
            folderObj[folder][file] = []
          }
          folderObj[folder][file] = folderObj[folder][file].concat(errIndexList)
        }
      })
    })
  })

  const resultPath = './res/'
  const listPath = resultPath + 'list'
  if (fs.existsSync(resultPath)) { // 如果检测到有这个文件夹，继续检测
    if (fs.existsSync(listPath)) { // 再检测是否有list文件夹，有就删除底下的文件
      const fileList = getFolderContent(listPath, 'file')
      fileList.forEach(file => {
        const filePath = listPath + '/' + file
        fs.unlinkSync(filePath)
      })
    } else { // 没有就创建
      fs.mkdirSync(listPath)
    }
  } else { // 如果没有就创建一下文件夹
    fs.mkdirSync(resultPath)
    fs.mkdirSync(listPath)
  }

  // 写入总数据
  const totalString = `
    数量: ${Object.keys(folderObj).length},
    涉及的机型: ${Object.keys(folderObj)}
  `
  fs.writeFileSync(resultPath + 'total.txt', totalString, { encoding: 'utf-8' })
  
  // 写入详细数据
  const keys = Object.keys(folderObj)
  if (!keys.length) { // 没有出现错误直接返回
    console.log('执行完成')
    return
  }
  keys.forEach(key => {
    const detailItem = folderObj[key]
    const url = `${listPath}/${key}.txt`
    let content = ''
    const fileKeys = Object.keys(detailItem)
    fileKeys.forEach(fileKey => {
      const file = detailItem[fileKey]
      file.map(line => {
        content += `所属文件: ${fileKey} \n`
        content += `问题类型: ${line.key} \n`
        content += `问题位置: ${line.index} \n`
        content += `具体问题原因: ${line.text} \n\n\n`
      })
    })
    fs.writeFileSync(url, content, { encoding: 'utf-8' })
  })
  console.log('执行完成')
}

/**
 * 查找指定文件夹下的内容
 * @param {string} url 路径
 * @param {string} type 类型，默认all（file, folder, all）
 */

function getFolderContent (enterUrl, type = 'all') {
  const url = enterUrl[enterUrl.length - 1] === '/' ? enterUrl : enterUrl + '/' // 处理最后一位不是/的情况
  const arr = fs.readdirSync(url)
  const folderList = []
  const fileList = []
  arr.forEach(item => {
    const path = url + item
    const stats = fs.statSync(path)
    if (stats.isDirectory()) {
      folderList.push(item)
    } else {
      fileList.push(item)
    }
  })
  if (type === 'all') {
    return [...folderList, ...fileList]
  } else if (type === 'folder') {
    return folderList
  } else {
    return fileList
  }
}

/**
 * 读取每行是否有对应字符的方法
 * @param {Array} lineList 
 * @param {String} str 
 * @param {Object} otherKeys 
 * @returns 
 */
function searchLineString (lineList, str, otherKeys) {
  const hasLines = []
  lineList.forEach((line, index) => {
    if (line.includes(str)) {
      const item = {
        ...otherKeys,
        index,
        key: str,
        text: line
      }
      hasLines.push(item)
    }
  })
  return hasLines
}