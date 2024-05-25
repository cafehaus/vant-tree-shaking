# vant-tree-shaking
微信小程序按需引入 vant 组件，自动清除项目中未使用的 vant 组件，减少代码包大小，避免因未使用到的 vant 组件触发隐私协议提交审核时被拒

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
  "dependencies": {
    "@vant/weapp": "^1.11.5"
  },
  "devDependencies": {
    "vant-tree-shaking": "^1.0.0"
  }
}
```
在小程序开发者工具中上传小程序代码前，直接在项目根目录终端中运行命令：npm run vant，成功后会在控制台打印出：vant-tree-shaking success

## 注意事项
* 本工具只针对 vant 的 1.x 版本，如果你使用的还是老的 0.x 版本建议先升级到最新的 1.x 版本后再使用

## 主要解决的问题
### 减少代码包大小
因为小程序主包有 2M 的限制，如果我们本身只用到了几个组件，最终却打包进了整个组件库，这样不仅不合理也额外占用了咱小程序的包大小。想要按需引入的办法只能自己手动去把 miniprogram_npm 目录中没用到的组件删掉，然后再打包上传。不过每次我们提交版本都要这样去操作的话，不光容易出错也很费时间。

利用 vant-tree-shaking，通过类似 npm run vant 这样一条命令 1 秒钟就可以删除掉未使用到的多余组件，实现了按需引入。

### 未使用到的 vant 组件也会触发隐私协议
除了减少代码包大小这一项外，其实还有一个更大的痛点，vant 的部分组件会自动触发小程序的隐私协议，比如上传组件 uploader 中用到的：收集你选中的照片或视频信息（wx.chooseImage、wx.chooseMedia、wx.chooseVideo）、收集你选中的文件（wx.chooseMessageFile），这类 api 会自动触发隐私协议授权。

即使你的项目中压根没使用这类组件，上传版本提审的时候小程序还是会自动扫描你 miniprogram_npm 目录下的所有文件，只要代码中有相关的 api 代码就会认为你用到了，然后霸道地强制要求你填写和更新相关隐私说明，随便瞎填一个 99% 会被拒，也不能填写：项目中暂未使用，这样那你自己说未使用就会让你先去把项目中相关的代码删掉再来提审。