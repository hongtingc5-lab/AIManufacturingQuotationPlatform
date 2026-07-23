# apps — 五系统前端

正式说明见上级 [`../SYSTEMS.md`](../SYSTEMS.md)。

根目录为 npm workspaces；已接入的包列在根 `package.json` 的 `workspaces` 中。

| 目录 | 系统 | 状态 |
|------|------|------|
| [`marketing/`](./marketing/) | 营销页 | **正式工程**（`@zhizao/frontend-marketing`） |
| [`user/`](./user/) | 用户端 | 待迁 |
| [`admin/`](./admin/) | 管理后台 | 待迁 |
| [`mes/`](./mes/) | MES 工作台 | 待迁 |
| [`supplier/`](./supplier/) | 供应商端 | 待迁 |

```bash
cd ..
npm install
npm run dev:marketing
```
