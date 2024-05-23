#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const IGNORE_DIRS = ['node_modules', 'miniprogram_npm'] // 需要忽略的目录
const COMMON_DIRS = ['common', 'mixins', 'wxs', 'definitions'] // vant 公共目录（不能删除的）
const VANT_PATH = 'miniprogram_npm/@vant/weapp' // vant 组件目录路径

let vantSet = new Set() // 项目中使用的 vant 组件
let dependentSet = new Set() // 项目中使用到的 vant 组件内部依赖的其他 vant 组件

// 1、扫描项目中的所有 json 文件，找出项目中使用到的所有 vant 组件
function readFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return

  if (fs.statSync(filePath).isDirectory()) {
    let files = fs.readdirSync(filePath) || []
		files.map(m => {
      if (!IGNORE_DIRS.includes(m)) {
        let curPath = path.join(filePath, m)
        readFile(curPath)
      }
		})
  } else {
    getUsingComponents(filePath, vantSet)
  }
}
readFile('./')

// 2、项目中使用到的 vant 组件依赖的其他 vant 组件
function readVantDir() {
  const files = fs.readdirSync(VANT_PATH) || []
  files.map(m => {
    if (!COMMON_DIRS.includes(m) && vantSet.has(`van-${m}`)) {
      const curPath = path.join(VANT_PATH, m, 'index.json')
      getUsingComponents(curPath, dependentSet)
    }
  })

  // 3、删除未使用到 vant 组件目录
  const usedVant = new Set([...vantSet, ...dependentSet])
  for (let i = files.length - 1; i >= 0; i--) {
    const cur = files[i]
    if (!COMMON_DIRS.includes(cur) && !usedVant.has(`van-${cur}`)) {
      const curPath = path.join(VANT_PATH, cur)
      deleteDir(curPath)
    }
  }
  console.log('vant-tree-shaking success')
}
readVantDir()

/**
 * 读取 json 文件中的 usingComponents 属性值
 * @param {*} filePath 路径
 * @param {*} setList 存符合条件的 vant 组件名的列表
 */
function getUsingComponents(filePath, setList) {
  if (!filePath || !fs.existsSync(filePath) || !isJsonFile(filePath)) return

  try {
    const data = fs.readFileSync(filePath, 'utf8')
    const json = JSON.parse(data)
    const usingComponents = json.usingComponents || {}
    for (const key in usingComponents) {
      if (key.startsWith('van-')) {
        setList.add(key)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * 根据路径判断是否为 json 文件
 * @param {String} filePath 路径
 */
function isJsonFile(filePath) {
  const extension = filePath.split('.').pop()
  return extension.toLowerCase() === 'json'
}

/**
 * 递归删除文件夹(要先删除里面的文件)
 * @param {String} dirPath 目录路径
 */
function deleteDir(dirPath) {
	if (!dirPath || !fs.existsSync(dirPath)) return

  if (fs.statSync(dirPath).isDirectory()) {
		const files = fs.readdirSync(dirPath) || []

		files.map(m => {
			const curPath = path.join(dirPath, m)
			if (fs.statSync(curPath).isDirectory()) {
				deleteDir(curPath)
			} else {
				fs.unlinkSync(curPath)
			}
		})

		// 删除目录
		fs.rmdirSync(dirPath)
	} else {
		fs.unlinkSync(dirPath)
	}
}