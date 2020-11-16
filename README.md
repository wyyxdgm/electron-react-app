# electron-react-app

![](icons/app.png)

整合`react-app`和`electron`的独立开发模式

- [环境要求](#环境要求)
- [开发&打包](#开发相关)
- [项目概要](#项目概要)

## 环境要求

### 版本

node: `v12.18.1`
npm: `6.14.8`
yarn: `1.22.4`
electron-forge: `6.0.0-beta.54`

### 全局依赖安装

- [node](https://nodejs.org/en/)
- [yarn](https://yarn.bootcss.com/docs/install/#mac-stable)
- [electron](https://www.electronforge.io/)

## 开发相关

### 初始化

```bash
yarn binit
```

### 本地开发

```bash
yarn bstart
```

### 打包&&编译应用

```bash
yarn bmake
```

## 项目概要

### electron初始化

```bash
yarn create electron-app electron-react-app
```

### react初始化

```bash
yarn create react-app react-app --template typescript
cd react-app
yarn add antd
yarn start
```

### 更改react打包路径

默认生成目标路径为`react-app/build`，调整为`src/view`，(配置文件`react-app/config/paths.js`)

相关代码：

```js
{
  appBuild: resolveApp('../src/view'),
}
```

### 启动浏览器替换成启动electron

通过修改`react-app/scripts/start.js`添加`startElectron`变量，决定否同步启动`electron`

相关代码：

```js
require("child_process").spawn("yarn", ["startElectron"]);
```

### 系统引入其他支持

- 数据存储：使用`electron-store`进行数据持久化
- 志打印：使用`electron-log`打印日志
- 调试主线程: 可使用`vscode`调试主线程
