# vant-tree-shaking
微信小程序按需引入 vant 组件，自动清除项目中未使用的 vant 组件，减少代码包大小

## 在微信小程序项目中使用

### 全局安装
```
npm install -g vant-tree-shaking
```
在小程序开发者工具中上传小程序代码前，直接在项目根目录终端中运行命令：vant-tree-shaking，成功后会在控制台打印出：vant-tree-shaking success

### 本地安装
```
npm install -D vant-tree-shaking
```
需要自己在 package.json 配置文件中配置 script 脚本命令，如直接配置自定义命令 vant：
```
{
  "name": "miniapp",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "vant": "vant-tree-shaking",
  },
  "devDependencies": {
    "vant-tree-shaking": "^1.0.0"
  }
  "dependencies": {
    "@vant/weapp": "^1.11.5"
  }
}
```
在小程序开发者工具中上传小程序代码前，直接在项目根目录终端中运行命令：npm run vant，成功后会在控制台打印出：vant-tree-shaking success