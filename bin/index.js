#!/usr/bin/env node

import fs from 'fs'
import chalk from 'chalk' // 设置终端log颜色
import symbols from 'log-symbols' // 设置终端log图标
import figlet from 'figlet' // 酷炫文字工具
import program from 'commander' // 命令行工具
import run from '../run/index.js'
import { getVersion } from '../run/config.js'

console.log(
  "\r\n" +
  chalk.blue(figlet.textSync("WELCOME XXH CLI", 'Big Money-nw'))
);

program
  .version(getVersion(), '-v, --version')
  .command('create <name>')
  .action((name) => {
    fs.exists(name, (exists) => {
      if (exists) {
        console.log(symbols.error, chalk.red(`创建失败，当前目录已经存在名为${name}的目录`))
      } else {
        run(name)
      }
    })
  })
program.parse(process.argv)
