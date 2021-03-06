'use strict'

const test = require('tape')
const renderColorscheme = require('../src/render-colorscheme.js')
const estiloVersion = require('../package.json').version

const testStr = `"
" Aname 2.1.0
" description d
" url u
" author: author a
" license: MIT
"
" Generated by Estilo ${estiloVersion}
" https://github.com/jacoborus/estilo

let g:colors_name="Aname"
hi clear
if exists("syntax_on")
  syntax reset
endif
if has("gui_running")
  set background=dark
endif

hi hitest guifg=#bbddff ctermfg=153 guibg=#ffffff ctermbg=15 gui=NONE cterm=NONE
hi other guifg=#ff0000 ctermfg=9 guibg=NONE ctermbg=NONE gui=Bold,underline,Italic cterm=Bold,underline,Italic
hi link linked other\n`

test('renderColorscheme', t => {
  const info = {
    author: 'author a',
    description: 'description d',
    license: 'MIT',
    url: 'url u',
    version: '2.1.0'
  }
  const palette = {
    azul: '#bbddff',
    blanco: '#ffffff'
  }
  const colorscheme = {
    background: 'dark',
    name: 'Aname'
  }
  const templates = {
    hitest: 'azul blanco',
    other: '#ff0000 - bui',
    linked: '@other'
  }

  let result = renderColorscheme(info, colorscheme, palette, templates)
  t.is(result, testStr)
  t.end()
})
