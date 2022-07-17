import inquirer from 'inquirer' // 一个用户与命令行交互的工具
import { downloadTempl, options } from './config.js'

export default (name) => {
  inquirer.prompt(options).then((answers) => {
    const opt = {
      name,
      answers
    }
    downloadTempl(opt)
  })
}