'use strict'

const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')

const renderColorscheme = require('./render-colorscheme.js')
const checkPalette = require('./check-palette.js')
const renderAirline = require('./render-airline.js')
const renderLightline = require('./render-lightline.js')
const chalk = require('chalk')
const log = console.log

module.exports = function (project) {
  return new Promise((resolve, reject) => {
    const palettes = project.palettes
    const info = project.info
    const airlineStyles = project.airlineStyles
    const lightlineStyles = project.lightlineStyles

    // search for errors in color palettes
    Object.keys(palettes).forEach(k => checkPalette(palettes[k], k))

    if (info.colorschemes && info.colorschemes.length) {
      // check colorschemes to render
      info.colorschemes.forEach(c => {
        if (!c.name) {
          throw new Error('Error reading estilo.yml, colorschemes need a name')
        }
        if (c.background) {
          if (c.background !== 'dark' && c.background !== 'light') {
            throw new Error(c.name + ' colorscheme has a wrong background')
          }
        }
        if (!c.palette) {
          throw new Error(c.name + ' colorscheme has not a color palette')
        }
        if (!palettes[c.palette]) {
          throw new Error('Colorscheme: ' + c.name + ' palette doesn\'t exists: ' + c.palette)
        }
      })

      // render colorschemes
      info.colorschemes.forEach(c => {
        c.rendered = renderColorscheme(info, c, palettes[c.palette], project.syntax)
      })

      // write colorschemes to disk
      mkdirp.sync(path.resolve(project.path, 'colors'))
      info.colorschemes.forEach(c => {
        fs.writeFileSync(path.resolve(project.path, 'colors', c.name + '.vim'), c.rendered)
        log(chalk.cyan('Rendering colorscheme:'), c.name + ' ...', chalk.green.bold('OK'))
      })
    }

    if (info.airline && info.airline.length) {
      // check colorschemes to render
      info.airline.forEach(t => {
        if (!t.name) {
          throw new Error('Error reading estilo.yml, airline themes need a name')
        }
        if (!t.style) {
          throw new Error(t.name + ' airline theme has a wrong style')
        }
        if (!airlineStyles[t.style]) {
          throw new Error('Airline theme: ' + t.name + ' style doesn\'t exists: ' + t.style)
        }
        if (!t.palette) {
          throw new Error(t.name + ' airline theme has not a color palette')
        }
        if (!palettes[t.palette]) {
          throw new Error('Airline theme: ' + t.name + ' palette doesn\'t exists: ' + t.palette)
        }
      })

      // render colorschemes
      info.airline.forEach(t => {
        t.rendered = renderAirline(info.name, t.name, airlineStyles[t.style], palettes[t.palette])
      })

      // write colorschemes to disk
      mkdirp.sync(path.resolve(project.path, 'plugin'))
      info.airline.forEach(t => {
        fs.writeFileSync(path.resolve(project.path, 'plugin', t.name + '-airline.vim'), t.rendered)
        log(chalk.cyan('Rendering Airline theme:'), t.name + ' ...', chalk.green.bold('OK'))
      })
    }

    if (info.lightline && info.lightline.length) {
      // check colorschemes to render
      info.lightline.forEach(t => {
        if (!t.name) {
          throw new Error('Error reading estilo.yml, lightline themes need a name')
        }
        if (!t.style) {
          throw new Error(t.name + ' lightline theme has a wrong style')
        }
        if (!lightlineStyles[t.style]) {
          throw new Error('lightline theme: ' + t.name + ' style doesn\'t exists: ' + t.style)
        }
        if (!t.palette) {
          throw new Error(t.name + ' lightline theme has not a color palette')
        }
        if (!palettes[t.palette]) {
          throw new Error('lightline theme: ' + t.name + ' palette doesn\'t exists: ' + t.palette)
        }
      })

      // render colorschemes
      info.lightline.forEach(t => {
        t.rendered = renderLightline(info.name, t.name, lightlineStyles[t.style], palettes[t.palette])
      })

      // write colorschemes to disk
      mkdirp.sync(path.resolve(project.path, 'plugin'))
      info.lightline.forEach(t => {
        fs.writeFileSync(path.resolve(project.path, 'plugin', t.name + '-lightline.vim'), t.rendered)
        log(chalk.cyan('Rendering Lightline theme:'), t.name + ' ...', chalk.green.bold('OK'))
      })
    }

    resolve(project)
  })
}
