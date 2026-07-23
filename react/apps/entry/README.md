# @zhizao/frontend-entry

共用登录/注册入口 SPA（**不是第六业务系统**）。  
静态 HTML 源：`D:\zhizao\内容\代码\前端页面\入口`。  
全平台约定见 [`../../SYSTEMS.md`](../../SYSTEMS.md)。  
**页面盘点只写在** [`PAGE_MAP.md`](./PAGE_MAP.md)。

| 项 | 值 |
|----|-----|
| systemId | `entry` |
| 包名 | `@zhizao/frontend-entry` |
| 端口 | **5175**（独立于营销 5173） |
| 运行时 | `html[data-system="entry"]` |

## 运行

```bash
cd D:\zhizao\zhizao\react
npm install
npm run dev            # 同时 :5173 营销 + :5175 入口
npm run build:entry
```

| URL | 说明 |
|-----|------|
| http://localhost:5175 | **默认重定向** → `/login`（客户工作台） |
| http://localhost:5175/login | 客户登录 → 成功后 :5174 |
| http://localhost:5175/hub | 多系统清单（Admin/MES/供应商暂未外链） |

## 环境变量

| 变量 | 默认 | 用途 |
|------|------|------|
| `VITE_MARKETING_ORIGIN` | `http://localhost:5173` | 返回营销站 |
| `VITE_USER_ORIGIN` | `http://localhost:5174` | 客户工作台 |
| `VITE_ADMIN_ORIGIN` | `http://localhost:5176` | 管理后台 |
| `VITE_MES_ORIGIN` | `http://localhost:5177` | MES |
| `VITE_SUPPLIER_ORIGIN` | `http://localhost:5178` | 供应商 |
