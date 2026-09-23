# 蘑菇项目指挥台

`mushroom-project-console` 是 **mushroom-farm-platform / 食用菌种植管理平台** 的构建台账。一页看完进度、阻塞和 Day-0/1 清单。

这里不放菇房、设备、MQTT 客户端或业务大屏。那些留在平台仓库。

## 本地运行

```bash
pnpm install
pnpm dev
```

也可以：

```bash
npm install
npm run dev
```

浏览器打开 [http://127.0.0.1:47231](http://127.0.0.1:47231)。

其他脚本：

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` / `npm run dev` | 本地预览 |
| `pnpm build` / `npm run build` | 类型检查并构建 |
| `pnpm preview` / `npm run preview` | 预览构建结果 |

只通过这些 package scripts 启动，没有单独的 CLI。

## 页面上有什么

- 项目抬头：`mushroom-farm-platform` 与「食用菌种植管理平台」
- 七条工作流：招标样本、计划/需求文档、架构硬墙、脚手架MVP、GitHub公开推送、大屏UI、MQTT联调
- 当前阻塞
- 快速链接（仓库路径或外链）
- Day-0 / Day-1 架构清单

状态全部来自 `public/status.json`。组件只负责展示。

## 给 agent：如何更新进度

只改 `public/status.json`，然后让页面重新读取（刷新，或点右上角「重新读取」）。

不要把「已完成 / 进行中 / 阻塞」写进 Vue 组件。不要把 `GH_TOKEN` 或任何密钥写进这个文件。

改完后同步这些字段：

1. 对应工作流的 `status` 和 `note`（一句话）
2. `blockers`：解除了就删掉该条；新阻塞追加一条
3. `checklist[].done`：做完改为 `true`
4. `project.updatedAt`：写成当前时间，带时区，例如 `2026-09-23T10:30:00+08:00`
5. `project.headline` 和 `project.next`：各留一句，让打开页面的人不用翻聊天记录

`status` 只允许三个值：

| 值 | 页面显示 |
| --- | --- |
| `done` | 已完成 |
| `active` | 进行中 |
| `blocked` | 阻塞 |

页面若读失败，会直接写出字段错误（缺字段、状态写错、`id` 重复）。修 JSON，不要去改解析器来迁就坏数据。

### 字段

```json
{
  "schemaVersion": 1,
  "project": {
    "slug": "mushroom-farm-platform",
    "name": "食用菌种植管理平台",
    "console": "蘑菇项目指挥台",
    "phase": "Day-1",
    "headline": "一句话现状",
    "next": "一句话下一步",
    "updatedAt": "2026-09-23T10:30:00+08:00"
  },
  "workstreams": [
    { "id": "github", "name": "GitHub公开推送", "status": "done", "note": "一句话" }
  ],
  "blockers": [
    {
      "id": "github-push",
      "title": "阻塞标题",
      "detail": "需要谁做什么",
      "since": "2026-09-23"
    }
  ],
  "links": [
    { "label": "进度真源", "href": "public/status.json", "note": "路径或 https 链接" }
  ],
  "checklist": [
    { "id": "d1-public-repo", "day": "Day-1", "text": "事项", "done": false }
  ]
}
```

约定：

- `schemaVersion` 保持 `1`
- `id` 用小写字母、数字、连字符，且在同一数组内不重复
- `links[].href` 以 `http://` 或 `https://` 开头时，页面提供「打开」；否则当作仓库路径，只显示文字和「复制」
- 平台文档若只是路径，写在 `links` 里即可，不必把正文拷进本仓库
- 外链用完整 `https://` 地址。平台仓库：<https://github.com/lijiaaaaa-bot/mushroom-farm-platform>

## 当前状态

- 已完成：招标样本、计划/需求、架构硬墙、脚手架 + HTTP 接入 + 告警冒烟、GitHub 公开仓库、STATUS.md 与 Issues #1–#4、工作日摘要与 PR 监听
- 进行中：MQTT 竖切（#1）、管理端暗色 UI（#3）、大屏壳（#2）
- 硬阻塞：无。不要再写 GH_TOKEN / 公开仓库未创建
