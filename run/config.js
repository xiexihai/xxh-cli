import fs from 'fs'
import path from 'path'
import chalk from 'chalk' // 设置终端log颜色
import symbols from 'log-symbols' // 设置终端log图标
import download from 'download-git-repo' // 下载git模版
import handlebars from 'handlebars' // 字符串模版
import ora from 'ora' // node.js 命令行环境的 loading效果
import exec from 'child_process' // shell命令

const INSTALL_NODE_MODULES = false // 是否下载完模版就安装项目依赖

// 模版地址
export const templateUrl = 'direct:https://gitee.com/xiexihai/books.git'

// 获取版本号
export const getVersion = () => {
  try {
    const filePath = path.resolve(process.cwd(), 'package.json')
    const pack = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return pack?.version
  } catch {
    return '获取版本号失败！'
  }
}

// 下载模版
export const downloadTempl = (opts) => {
  const { name, answers } = opts
  const process = ora(chalk.cyan('正在拉取模版，请耐心等候...'))
  process.start()
  download(templateUrl, name, { clone: true }, (err) => {
    if (err) {
      process.fail()
      console.log(symbols.error, chalk.red(err))
    } else {
      process.succeed()

      // 替换package.json
      const fileName = `${name}/package.json`
      const meta = {
        name,
        author: answers.author,
        description: answers.description,
        eslint: answers.eslint.toLocaleLowerCase() === 'y' ? true : false
      }
      console.log(meta)
      if (fs.existsSync(fileName)) { // 如果路径存在则返回 true，否则返回 false
        const content = fs.readFileSync(fileName).toString()
        // console.log(content)
        const result = handlebars.compile(content)(meta)
        // console.log(result)
        fs.writeFileSync(fileName, result)
      }
      console.log(symbols.success, chalk.cyan('拉取完成...'))

      // 拉取完成直接安装依赖
      if (INSTALL_NODE_MODULES) {
        installNodeModules(name)
      } else {
        console.log(
          "\r\n" +
          chalk.bold.magenta(`cd ${name}`) +
          "\r\n" +
          chalk.bold.magenta(`yarn`) +
          "\r\n" +
          chalk.bold.magenta(`yarn start`)
        );
      }
    }
  })
}

// 安装项目依赖
export const installNodeModules = (name) => {
  const process = ora(chalk.cyan('正在安装依赖...'))
  process.start()
  const cmd = `cd ${name} && yarn`
  exec.exec(cmd, (error) => {
    if (error) {
      process.fail()
      console.log(symbols.error, chalk.red(error))
    } else {
      process.succeed()
      console.log(symbols.success, chalk.green('安装依赖成功!'))
      console.log(
        "\r\n" +
        chalk.bold.magenta(`cd ${name}`) +
        "\r\n" +
        chalk.bold.magenta(`yarn start`)
      );
      process.exit()
    }
  })
}

// 选项列表
export const options = [
  {
    type: 'input',
    name: 'author',
    message: '请输入作者名称！'
  },
  {
    type: 'description',
    name: 'description',
    message: '请输入项目介绍！'
  },
  {
    type: 'list',
    name: 'template',
    message: '请选择开发语言!',
    choices: ['react', 'vue'],
    default: 'react'
  },
  {
    type: 'input',
    name: 'eslint',
    message: '请选择是否使用ESLINT（Y/N）？',
    validate: (val) => {
      if (
        val.toLocaleLowerCase() === 'y' ||
        val.toLocaleLowerCase() === 'n'
      ) return true
      return '请重新选择是否使用ESLINT（Y/N）?'
    }
  }
]

