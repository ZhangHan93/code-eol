import * as vscode from 'vscode'

// 此方法在 VS Code 激活时调用
export function activate (context: vscode.ExtensionContext) {
  let nullDecoration: vscode.TextEditorDecorationType
  let activeEditor = vscode.window.activeTextEditor

  function createDecoration () {
    // 如果已有装饰器，先释放
    if (nullDecoration) {
      nullDecoration.dispose()
    }
    const configuration = vscode.workspace.getConfiguration('code-eol')
    const decorationColor = configuration.color

    // 构建装饰器的 CSS 样式
    const styles: any = {}
    if (decorationColor) {
      styles.color = decorationColor
    }

    // 通过 textDecoration 创建装饰器
    nullDecoration = vscode.window.createTextEditorDecorationType(styles)
  }

  function updateDecorations () {
    if (!activeEditor) {
      return
    }
    const configuration = vscode.workspace.getConfiguration('code-eol')
    const decorationColor = configuration.color
    const regEx = /(\r(?!\n))|(\r?\n)/g
    const text = activeEditor.document.getText()
    const newLines: vscode.DecorationOptions[] = []
    let match
    while ((match = regEx.exec(text))) {
      const decTxt = getDecTxt(match[0], configuration)
      const startPos = activeEditor.document.positionAt(match.index)
      const endPos = activeEditor.document.positionAt(match.index)

      // 构建带有自定义样式的装饰选项
      const afterOptions: any = {
        contentText: decTxt
      }
      if (decorationColor) {
        afterOptions.color = decorationColor
      }
      // 应用透明度
      const opacity = configuration.opacity || 1
      if (opacity !== 1) {
        afterOptions.opacity = opacity.toString()
      }

      const decoration: vscode.DecorationOptions = {
        range: new vscode.Range(startPos, endPos),
        renderOptions: {
          after: afterOptions
        }
      }
      newLines.push(decoration)
    }
    activeEditor.setDecorations(nullDecoration, newLines)
  }

  // 初始化设置
  createDecoration()
  if (activeEditor) {
    updateDecorations()
  }

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor
      if (editor) {
        createDecoration()
        updateDecorations()
      }
    },
    null,
    context.subscriptions
  )

  vscode.workspace.onDidChangeTextDocument(
    () => {
      updateDecorations()
    },
    null,
    context.subscriptions
  )

// 当配置更改时重新创建装饰器
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('code-eol')) {
      createDecoration()
      updateDecorations()
    }
  }, null, context.subscriptions)
}

function getDecTxt (match: string, configuration: vscode.WorkspaceConfiguration): string {
  const lfSymbol = configuration.lfSymbol || '↓'
  const crlfSymbol = configuration.crlfSymbol || '↵'
  const crSymbol = configuration.crSymbol || '←'

  switch (match) {
    case '\n':
      return lfSymbol
    case '\r\n':
      return crlfSymbol
    case '\r':
      return crSymbol
    default:
      return ''
  }
}
