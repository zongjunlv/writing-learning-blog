# 网文新手学习日志

一个开源个人学习日志站：每天从热门完本男频玄幻、东方玄幻、高武或修真升级向样本中，提炼新手作者可执行的写作规则。

## 内容边界

本站只发布：

- 抽象写作规律
- 文字执行方法
- 反向错误
- 检查清单
- 自我练习题
- 来源链接

本站不发布：

- 连续原文摘录
- 大段剧情复述
- 样本章节路线图
- 专有人物关系复刻
- 可替代原作阅读的详细总结

## 本地开发

```bash
npm install
npm run dev
```

打开终端输出的本地地址。

## 检查与构建

```bash
npm run validate:posts
npm run check
npm run build
```

## 生成每日文章

默认从全局写作规律文件读取今日样本：

```bash
npm run generate:daily
```

也可以指定来源：

```bash
HOT_PATTERNS_PATH=/absolute/path/to/hot-male-xuanhuan-patterns.md npm run generate:daily
```

## 自动发布

生成、验证、构建并提交每日文章：

```bash
npm run publish:daily
```

生成、验证、构建、提交并推送：

```bash
npm run publish:daily -- --push
```

推送到 GitHub 后，Vercel 会从仓库自动部署。

## Vercel 部署

1. 把包含本目录的仓库推送到 GitHub。
2. 在 Vercel 新建项目，导入该 GitHub 仓库。
3. 将项目 Root Directory 设置为 `writing-learning-blog`。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `dist`。
6. 部署成功后，在 Vercel 项目设置中绑定自定义域名。

## 文章结构

每篇每日学习文章应包含：

1. 今天学哪本
2. 为什么选它
3. 我作为新手最想学什么
4. 本次学到什么
5. 我容易犯的反向错误
6. 可执行检查清单
7. 自我练习
8. 来源与版权边界
