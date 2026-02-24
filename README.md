# Code EOL

在 VS Code 中显示换行符的扩展

支持 `\n`（LF）、`\r\n`（CRLF）和 `\r`（CR）换行符

## 功能特性

- 支持三种换行符类型：LF、CRLF、CR
- 自定义换行符颜色
- 调整换行符透明度
- 自定义换行符显示符号

## 使用示例

**LF 换行符示例**

![sample](sample.png)

**CRLF 换行符示例**

![sample](sample_cl.png)

## 配置项

### `code-eol.color`

换行符显示颜色

- 类型：`string`
- 默认值：`#ffd86e`（黄色）
- 示例：`"code-eol.color": "#00ff00"`

### `code-eol.opacity`

换行符透明度

- 类型：`number`
- 范围：`0` - `1`
- 默认值：`1`（完全不透明）
- 说明：`0` 为完全透明，`1` 为完全不透明
- 示例：`"code-eol.opacity": 0.7`

### `code-eol.lfSymbol`

LF（`\n`）换行符显示的符号

- 类型：`string`
- 默认值：`↓`
- 示例：`"code-eol.lfSymbol": "¶"`

### `code-eol.crlfSymbol`

CRLF（`\r\n`）换行符显示的符号

- 类型：`string`
- 默认值：`↵`
- 示例：`"code-eol.crlfSymbol": "⏎"`

### `code-eol.crSymbol`

CR（`\r`）换行符显示的符号

- 类型：`string`
- 默认值：`←`
- 示例：`"code-eol.crSymbol": "⇠"`

## 完整配置示例

```json
{
  "code-eol.color": "#ff0000",
  "code-eol.opacity": 0.8,
  "code-eol.lfSymbol": "↓",
  "code-eol.crlfSymbol": "↵",
  "code-eol.crSymbol": "←"
}
```

## License

MIT