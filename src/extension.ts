import * as vscode from 'vscode'

// this method is called when vs code is activated
export function activate (context: vscode.ExtensionContext) {
  let nullDecoration: vscode.TextEditorDecorationType
  let activeEditor = vscode.window.activeTextEditor

  function createDecoration () {
    const configuration = vscode.workspace.getConfiguration('code-eol')
    const decorationColor = configuration.color
    const fontSize = configuration.fontSize || 1

    // Build CSS-like styles for the decoration
    const styles: any = {}
    if (decorationColor) {
      styles.color = decorationColor
    }

    // Create decoration with custom CSS through textDecoration
    nullDecoration = vscode.window.createTextEditorDecorationType(styles)
  }

  function updateDecorations () {
    if (!activeEditor) {
      return
    }
    const configuration = vscode.workspace.getConfiguration('code-eol')
    const decorationColor = configuration.color
    const fontSize = configuration.fontSize || 1
    const regEx = /(\r(?!\n))|(\r?\n)/g
    const text = activeEditor.document.getText()
    const newLines: vscode.DecorationOptions[] = []
    let match
    while ((match = regEx.exec(text))) {
      const decTxt = getDecTxt(match[0], configuration)
      const startPos = activeEditor.document.positionAt(match.index)
      const endPos = activeEditor.document.positionAt(match.index)

      // Build after decoration options with custom styles
      const afterOptions: any = {
        contentText: decTxt
      }
      if (decorationColor) {
        afterOptions.color = decorationColor
      }
      if (fontSize !== 1) {
        // Use CSS-like styling through the style property
        afterOptions.style = `font-size: ${fontSize}em;`
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

  // Initial setup
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

  // Re-create decoration when configuration changes
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('code-eol')) {
      createDecoration()
      updateDecorations()
    }
  }, null, context.subscriptions)
}

function getDecTxt (match, configuration) {
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
