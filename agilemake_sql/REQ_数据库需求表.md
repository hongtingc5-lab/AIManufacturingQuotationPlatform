# 数据库需求表（可调整稿）

> **用途**：字段级需求确认，内容未定稿前以本文件为准；确认后再改 SQL、再写后端代码。  
> **库**：PostgreSQL `agilemake_sql`  
> **范围**：本期仅「系统字典 + 账号鉴权」；其他业务域只列规划，不展开字段。  
> **状态说明**：`待确认` / `已确认` / `调整中` / `暂缓`

| 文档版本 | 日期 | 说明 |
|---------|------|------|
| v0.1 | 2026-07-23 | 首稿：字典 + 用户登录相关表 |
| v0.2 | 2026-07-23 | 强化：门户下角色细分；预留角色→套餐/服务绑定 |
| v0.3 | 2026-07-23 | 客户改为个人/企业；去掉客户工程师与供应商报价员；报价归平台 |

---

## 使用方式

1. 直接在本文件改「字段中文名 / 是否必填 / 备注 / 状态」。  
2. 文末「待确认事项」打勾或改意见。  
3. 表结构定稿后，再同步 `01_sys_dict.sql`、`02_auth_user.sql`，最后才搭登录注册接口。

---

## A. 全库域规划（仅清单，本期不建表）

| 序号 | 域前缀 | 域名称 | 本期 | 状态 | 备注（可改） |
|------|--------|--------|------|------|--------------|
| 01 | `sys_` | 系统基础（字典/配置/文件/日志） | 字典先做 | 待确认 | |
| 02 | `sys_` / 鉴权表 | 账号鉴权（用户/组织/角色/登录） | 完整字段需求 | 待确认 | 表名前缀暂用 sys_ |
| 03 | `quote_` | 智能报价 / RFQ / DFM | 否 | 暂缓 | |
| 04 | `order_` | 订单与履约 | 否 | 暂缓 | |
| 05 | `model_` | 模型库 / 社区 | 否 | 暂缓 | |
| 06 | `scan_` | 扫描服务 | 否 | 暂缓 | |
| 07 | `mes_` | 车间 MES | 否 | 暂缓 | |
| 08 | `spl_` | 供应商业务 | 否 | 暂缓 | |
| 09 | `cs_` | 客服中心 | 否 | 暂缓 | |
| 10 | `mbr_` | 会员 / 积分 / **套餐·服务** | 否（先定与角色关系） | 暂缓 | 套餐挂 `sys_role`，见 C4 |
| 11 | `ai_` | AI 调用 / Token | 否 | 暂缓 | |
| 12 | `cms_` | 营销 / 资源内容 | 否 | 暂缓 | |
| 13 | `fin_` | 财务 / 充值结算 | 否 | 暂缓 | |

---

## B. 公共字段约定（各业务表建议统一）

| 字段名 | 类型建议 | 必填 | 默认 | 说明 | 状态 |
|--------|----------|------|------|------|------|
| `id` | BIGSERIAL | 是 | 自增 | 主键 | 待确认 |
| `created_at` | TIMESTAMPTZ | 是 | NOW() | 创建时间 | 待确认 |
| `updated_at` | TIMESTAMPTZ | 是 | NOW() | 更新时间 | 待确认 |
| `is_deleted` | SMALLINT | 是 | 0 | 软删：0否 1是 | 待确认 |

---

## C. 使用者模型需求（定稿前重点看）

### C0. 业务边界（先定清，避免角色设计跑偏）

| 事项 | 结论（按当前业务） | 状态 |
|------|-------------------|------|
| 谁做报价？ | **平台侧提供报价服务**（谈客、算价、抛 RFQ），不是客户账号职责，也不是供应商「报价员」职责 | 已确认方向 |
| 客户怎么分？ | 只分 **个人版** 与 **企业版**；**个人是最小单位** | 已确认方向 |
| 个人与企业关系 | 个人可关联企业；**企业开通服务后，可授权到关联的个人使用** | 已确认方向 |
| 供应商在报价链中做什么？ | 平台谈拢并计算后 **抛出 RFQ**；供应商侧是能力接单、履约、质检等，**不做平台报价** | 已确认方向 |

### C1. 身份与套餐模型

```text
门户 portal_type
  CUSTOMER / ADMIN / SUPPLIER / MES
        │
        ├─【客户】个人账号 = 最小单位
        │     ├─ 可买个人版套餐（绑 USER）
        │     └─ 可创建/加入企业 org
        │           └─ 企业开通服务（绑 ORG）→ 授权给 org 下个人使用
        │
        ├─【供应商/MES/管理】仍用角色区分职责与权限
        │
        └─ 套餐/服务 mbr_（后做）
              个人订购 | 企业订购 + 成员可用
```

| 概念 | 存哪 | 作用 | 是否绑套餐 |
|------|------|------|------------|
| 门户 portal_type | `sys_user.portal_type` | 登录入口 | 否 |
| **客户个人账号** | `sys_user`（CUSTOMER） | **最小使用单位** | 个人版套餐绑 USER |
| **客户企业** | `sys_org`（CUSTOMER_COMPANY） | 企业开通服务的主体 | 企业版套餐绑 ORG |
| **企业成员关系** | `sys_org_member` | 个人关联企业后享用企业服务 | 授权通道 |
| 角色 role | `sys_role` | 权限；客户侧主要区分个人/企业管理员/企业成员 | 客户套餐优先绑「个人/企业」而非岗位 |
| 岗位 job_title | 可选资料字段 | 仅展示，不驱动套餐 | 否 |

### C2. 门户大类（字典 `user_portal_type`）

| 编码 | 中文名 | 对应注册页 | 其下怎么分 | 是否保留 | 状态 |
|------|--------|------------|------------|----------|------|
| CUSTOMER | 客户 | 注册页.html | **个人 / 企业**（见 C3.1） | 是 | 待确认 |
| ADMIN | 管理员 | 管理员注册.html | 超管/运营/客服/审核/财务… | 是 | 待确认 |
| SUPPLIER | 供应商 | 供应商注册.html | 主账号/生产/质检…（无报价员） | 是 | 待确认 |
| MES | MES生产 | MES注册.html | 负责人/计划/车间/操作/质检… | 是 | 待确认 |

### C3. 四端角色细分清单

#### C3.1 客户 CUSTOMER（个人 / 企业）

> **不做**采购/工程师/项目/财务等岗位角色；报价是平台服务，不在客户侧设「报价工程师」。

| role_code | 角色名 | 注册默认 | 可推套餐 | 说明 | 状态 |
|-----------|--------|----------|----------|------|------|
| CUSTOMER_PERSONAL | 个人用户 | **是** | **是（个人版）** | 最小单位；默认可自购个人服务 | 待确认 |
| CUSTOMER_ENTERPRISE_ADMIN | 企业管理员 | 否 | **是（企业版，绑组织）** | 创建/管理企业；开通企业服务；授权成员 | 待确认 |
| CUSTOMER_ENTERPRISE_MEMBER | 企业成员 | 否 | 否（用企业已开通服务） | 个人关联企业后加入；使用企业授权额度 | 待确认 |

**客户账号流转（需求）**：

```text
1. 注册 → 始终先成为「个人用户」(CUSTOMER_PERSONAL)
2. 个人可单独开通个人版套餐（订购主体 = USER）
3. 个人可「创建企业」或「加入企业」
   - 创建者 → 同时具备企业管理员角色，并写入 sys_org_member
   - 加入者 → 企业成员角色 + sys_org_member
4. 企业开通企业版服务（订购主体 = ORG）
5. 企业把服务使用权关联到成员个人（成员即可用，无需每人再买一份）
```

| # | 规则 | 建议 | 状态 |
|---|------|------|------|
| 1 | 个人是否必须先注册再关联企业？ | 是，个人是最小单位 | 待确认 |
| 2 | 未关联企业时能否用企业服务？ | 否 | 待确认 |
| 3 | 个人版与企业版权益能否叠加？ | 可叠加（后定细则） | 待确认 |
| 4 | 一个人能否加入多个企业？ | 预留支持（多条 org_member） | 待确认 |

#### C3.2 管理员 ADMIN

| role_code | 角色名 | 注册默认 | 可推套餐 | 典型职责 | 状态 |
|-----------|--------|----------|----------|----------|------|
| ADMIN_SUPER | 超级管理员 | 视开户策略 | 否 | 全平台配置 | 待确认 |
| ADMIN_OPERATOR | 营销/SEO运营 | 否 | 否 | 前端营销页内容、SEO 运营 | 待确认 |
| ADMIN_CS_LEAD | 客服主管 | 否 | 否 | 客服分配与监管 | 待确认 |
| ADMIN_CS | 客服 | 否 | 否 | 客户/供应商对接 | 待确认 |
| ADMIN_AUDITOR | 审核员 | 否 | 否 | 模型/内容/企业认证审核 | 待确认 |
| ADMIN_FINANCE | 财务管理员 | 否 | 否 | 平台财务与结算 | 待确认 |

> 平台报价、谈客、抛 RFQ 等能力，归 **后台管理/业务人员**（及后续 quote_ 域），不做成客户或供应商角色。

#### C3.3 供应商 SUPPLIER

> **删除「报价员」**。报价与 RFQ 发起在平台侧完成：谈客 → 算价 → 抛 RFQ；供应商侧看单、接单、履约、质检。

| role_code | 角色名 | 注册默认 | 可推套餐 | 典型职责 | 状态 |
|-----------|--------|----------|----------|----------|------|
| SUPPLIER_OWNER | 供应商主账号 | 是 | 是 | 入驻、能力资料、接单额度管理 | 待确认 |
| SUPPLIER_PRODUCTION | 生产对接 | 否 | 是 | 订单履约、交期协同 | 待确认 |
| SUPPLIER_QC | 质检对接 | 否 | 是 | 质检报告、FAI 协同 | 待确认 |
| SUPPLIER_MEMBER | 普通成员 | 否 | 否 | 受限协同 | 待确认 |

#### C3.4 MES生产 MES

| role_code | 角色名 | 注册默认 | 可推套餐 | 典型服务方向（示例，可改） | 状态 |
|-----------|--------|----------|----------|----------------------------|------|
| MES_OWNER | 系统负责人 | 是 | 是 | 工厂 MES 总包、设备/工位席位 | 待确认 |
| MES_PLANNER | 计划员 | 否 | 是 | 排产/计划模块 | 待确认 |
| MES_SHOP_LEAD | 车间主任 | 否 | 是 | 车间看板、派工 | 待确认 |
| MES_OPERATOR | 操作工 | 否 | 是 | 工位终端、报工 | 待确认 |
| MES_QC | 质检员 | 否 | 是 | 质检录入、不合格流程 | 待确认 |

### C4. 套餐/服务绑定（规划，本期不落完整字段）

| 规划表（mbr_ 域） | 用途 | 与客户个人/企业关系 | 本期 |
|------------------|------|---------------------|------|
| `mbr_package` | 套餐定义 | 区分 `PERSONAL` / `ENTERPRISE` 适用对象 | 暂缓 |
| `mbr_subscription` | 开通记录 | `owner_type=USER` 个人订购；`owner_type=ORG` 企业订购 | 暂缓 |
| `mbr_entitlement`（或等价） | 企业服务→个人授权 | org 订阅后，授权给哪些 `user_id` 可用 | 暂缓 |
| `mbr_service` / `mbr_package_service` | 服务项与套餐包含关系 | | 暂缓 |
| `mbr_package_role` | 套餐↔角色（供应商/MES 等） | 客户侧可弱化，优先个人/企业维度 | 暂缓 |

**客户侧推荐开通方式**：

| 方案 | 说明 | 是否采用 |
|------|------|----------|
| 个人订购 | 绑 `USER`，仅本人用 | **要** |
| 企业订购 | 绑 `ORG`，再授权成员个人 | **要** |
| 按岗位角色卖客户套餐 | 如「工程师包」 | **不要**（已否决） |

### C5. 账号策略（请确认对错）

| # | 需求描述 | 建议 | 你的决定 | 状态 |
|---|---------|------|----------|------|
| 1 | 四端是否共用一张账号主表 | 共用 `sys_user`，用 portal_type 区分 | | 待确认 |
| 2 | 主登录方式 | 手机号 + 密码；兼短信验证码 | | 待确认 |
| 3 | 邮箱 | 可选；可作登录标识 | | 待确认 |
| 4 | 同手机号能否跨端注册 | 允许 | | 待确认 |
| 5 | 第三方登录 | Google / LinkedIn / Facebook / 微信；首次需绑手机 | | 待确认 |
| 6 | 客户是否按岗位拆角色 | **否**；只分个人/企业管理员/企业成员 | | 待确认 |
| 7 | 客户注册是否先个人 | **是**；企业后关联 | | 待确认 |
| 8 | 一个账号可否多角色 | 允许（如个人 + 企业管理员） | | 待确认 |
| 9 | 组织表 | `sys_org` + `sys_org_member` 承载企业关联 | | 待确认 |
| 10 | 短信验证码落库 | 不落库，走 Redis | | 待确认 |

### C6. 注册字段映射（前端 → 库表）

| 前端字段 | 客户 | 管理员 | 供应商 | MES | 落库位置 | 状态 |
|----------|------|--------|--------|-----|----------|------|
| 公司/组织名称 | 个人注册可空；建企业时必填 | 管理组织 | 供应商名称 | 工厂/组织名称 | `sys_org.org_name` | 待确认 |
| 联系人/负责人 | 联系人（个人显示名） | 超级管理员 | 对接人 | 系统负责人 | `sys_user.display_name` | 待确认 |
| 职位/部门 | 可选展示，不驱动套餐 | — | — | — | `sys_user_profile.job_title_text` | 待确认 |
| 手机号 | 有 | 有 | 有 | 有 | `sys_user.mobile` | 待确认 |
| 短信验证码 | 有 | — | — | — | Redis，不建表 | 待确认 |
| 邮箱 | 可选 | 可选 | 可选 | 可选 | `sys_user.email` | 待确认 |
| 密码 | 有 | 有 | 有 | 有 | `sys_user.password_hash` | 待确认 |

---

## D. 表需求明细（字段级）

> 列说明：**必填**=建表约束；**字典绑定**=引用字典 type/item；状态默认都是「待确认」，你改完把该行改成「已确认」。

### D1. `sys_dict_type` 字典类型

| 字段名 | 中文名 | 类型 | 必填 | 默认 | 字典绑定 | 唯一/索引 | 备注 | 状态 |
|--------|--------|------|------|------|----------|-----------|------|------|
| id | 主键 | BIGSERIAL | 是 | | | PK | | 待确认 |
| type_code | 类型编码 | VARCHAR(64) | 是 | | | UK | 如 user_portal_type | 待确认 |
| type_name | 类型名称 | VARCHAR(128) | 是 | | | | | 待确认 |
| remark | 备注 | VARCHAR(512) | 否 | | | | | 待确认 |
| status | 启用状态 | SMALLINT | 是 | 1 | | | 1启用 0停用 | 待确认 |
| sort_no | 排序 | INT | 是 | 0 | | | | 待确认 |
| created_at | 创建时间 | TIMESTAMPTZ | 是 | NOW() | | | | 待确认 |
| updated_at | 更新时间 | TIMESTAMPTZ | 是 | NOW() | | | | 待确认 |
| is_deleted | 软删 | SMALLINT | 是 | 0 | | | | 待确认 |

### D2. `sys_dict_item` 字典项

| 字段名 | 中文名 | 类型 | 必填 | 默认 | 字典绑定 | 唯一/索引 | 备注 | 状态 |
|--------|--------|------|------|------|----------|-----------|------|------|
| id | 主键 | BIGSERIAL | 是 | | | PK | | 待确认 |
| type_code | 类型编码 | VARCHAR(64) | 是 | | → dict_type | IDX + FK | | 待确认 |
| item_code | 项编码 | VARCHAR(64) | 是 | | | UK(type,item) | 业务表引用此值 | 待确认 |
| item_label | 中文标签 | VARCHAR(128) | 是 | | | | | 待确认 |
| item_label_en | 英文标签 | VARCHAR(128) | 否 | | | | | 待确认 |
| item_value | 扩展值 | VARCHAR(128) | 否 | | | | 可选 | 待确认 |
| css_class | 样式类 | VARCHAR(64) | 否 | | | | 前端展示用 | 待确认 |
| remark | 备注 | VARCHAR(512) | 否 | | | | | 待确认 |
| status | 启用状态 | SMALLINT | 是 | 1 | | | | 待确认 |
| sort_no | 排序 | INT | 是 | 0 | | | | 待确认 |
| created_at / updated_at / is_deleted | 公共字段 | | 是 | | | | 同约定 | 待确认 |

#### 预置字典清单（可增删改）

| 类型编码 | 类型名称 | 项编码 | 项名称 | 是否保留 | 状态 |
|----------|----------|--------|--------|----------|------|
| user_portal_type | 用户门户类型 | CUSTOMER / ADMIN / SUPPLIER / MES | 客户/管理员/供应商/MES | 是 | 待确认 |
| user_status | 账号状态 | ACTIVE / DISABLED / PENDING / LOCKED | 正常/禁用/待审核/锁定 | 是 | 待确认 |
| org_type | 组织类型 | CUSTOMER_COMPANY / SUPPLIER_COMPANY / MES_FACTORY / ADMIN_ORG | 客户企业/供应商/工厂/管理组织 | 是 | 待确认 |
| oauth_provider | 第三方渠道 | GOOGLE / LINKEDIN / FACEBOOK / WECHAT | | 是 | 待确认 |
| customer_job_title | 客户职位（可选展示） | 自由文本为主；字典可后补，**不驱动套餐** | 暂缓细项 | 待确认 |
| admin_job_title | 管理员岗位 | SUPER_ADMIN / OPERATOR / CS_LEAD / AUDITOR | 是 | 待确认 |
| supplier_job_title | 供应商岗位 | OWNER / PRODUCTION / QC（无报价员） | 是 | 待确认 |
| mes_job_title | MES岗位 | FACTORY_ADMIN / PLANNER / OPERATOR / QC | 是 | 待确认 |
| package_owner_type | 套餐主体 | USER / ORG | 个人订购 / 企业订购 | 是 | 待确认 |

### D3. `sys_org` 组织

| 字段名 | 中文名 | 类型 | 必填 | 默认 | 字典绑定 | 唯一/索引 | 备注 | 状态 |
|--------|--------|------|------|------|----------|-----------|------|------|
| id | 主键 | BIGSERIAL | 是 | | | PK | | 待确认 |
| org_code | 组织编码 | VARCHAR(64) | 否 | | | UK | 可后期规则生成 | 待确认 |
| org_name | 组织名称 | VARCHAR(256) | 是 | | | IDX | 注册页公司名 | 待确认 |
| org_type | 组织类型 | VARCHAR(32) | 是 | | org_type | IDX | | 待确认 |
| parent_id | 上级组织 | BIGINT | 否 | | | | 集团树预留 | 待确认 |
| contact_name | 联系人 | VARCHAR(64) | 否 | | | | | 待确认 |
| contact_mobile | 联系电话 | VARCHAR(32) | 否 | | | | | 待确认 |
| contact_email | 联系邮箱 | VARCHAR(128) | 否 | | | | | 待确认 |
| country_code | 国家 | VARCHAR(16) | 否 | | | | | 待确认 |
| province | 省 | VARCHAR(64) | 否 | | | | | 待确认 |
| city | 市 | VARCHAR(64) | 否 | | | | | 待确认 |
| address | 详细地址 | VARCHAR(512) | 否 | | | | | 待确认 |
| status | 状态 | VARCHAR(32) | 是 | ACTIVE | user_status（或另建 org_status） | | | 待确认 |
| remark | 备注 | VARCHAR(512) | 否 | | | | | 待确认 |
| created_at / updated_at / is_deleted | 公共字段 | | 是 | | | | | 待确认 |

### D4. `sys_user` 统一账号（核心）

| 字段名 | 中文名 | 类型 | 必填 | 默认 | 字典绑定 | 唯一/索引 | 备注 | 状态 |
|--------|--------|------|------|------|----------|-----------|------|------|
| id | 主键 | BIGSERIAL | 是 | | | PK | | 待确认 |
| user_no | 用户编号 | VARCHAR(32) | 否 | | | UK | 对外展示号 | 待确认 |
| username | 登录名 | VARCHAR(64) | 否 | | | UK | 历史账号兼容 | 待确认 |
| mobile | 手机号 | VARCHAR(32) | 条件 | | | UK(portal+mobile) 未删 | 与邮箱/用户名至少一个 | 待确认 |
| mobile_verified | 手机已验证 | SMALLINT | 是 | 0 | | | 0否 1是 | 待确认 |
| email | 邮箱 | VARCHAR(128) | 否 | | | UK(portal+email) 未删 | | 待确认 |
| email_verified | 邮箱已验证 | SMALLINT | 是 | 0 | | | | 待确认 |
| password_hash | 密码哈希 | VARCHAR(255) | 否 | | | | 第三方首登可空 | 待确认 |
| portal_type | 门户类型 | VARCHAR(32) | 是 | | user_portal_type | IDX | | 待确认 |
| status | 账号状态 | VARCHAR(32) | 是 | ACTIVE | user_status | IDX | | 待确认 |
| display_name | 显示名称 | VARCHAR(64) | 否 | | | | 联系人姓名 | 待确认 |
| avatar_url | 头像 | VARCHAR(512) | 否 | | | | | 待确认 |
| last_login_at | 最后登录时间 | TIMESTAMPTZ | 否 | | | | | 待确认 |
| last_login_ip | 最后登录IP | VARCHAR(64) | 否 | | | | | 待确认 |
| password_updated_at | 密码更新时间 | TIMESTAMPTZ | 否 | | | | | 待确认 |
| created_at / updated_at / is_deleted | 公共字段 | | 是 | | | | | 待确认 |

### D5. `sys_user_profile` 账号扩展资料

| 字段名 | 中文名 | 类型 | 必填 | 默认 | 字典绑定 | 唯一/索引 | 备注 | 状态 |
|--------|--------|------|------|------|----------|-----------|------|------|
| id | 主键 | BIGSERIAL | 是 | | | PK | | 待确认 |
| user_id | 用户ID | BIGINT | 是 | | | UK + FK→user | 一对一 | 待确认 |
| job_title_code | 岗位编码 | VARCHAR(64) | 否 | | *_job_title | | 按门户选字典 | 待确认 |
| job_title_text | 岗位自由文本 | VARCHAR(128) | 否 | | | | 注册页手填 | 待确认 |
| gender | 性别 | SMALLINT | 否 | | | | 0未知1男2女 | 待确认 |
| locale | 语言 | VARCHAR(16) | 否 | zh-CN | | | | 待确认 |
| timezone | 时区 | VARCHAR(64) | 否 | Asia/Shanghai | | | | 待确认 |
| extra_json | 扩展JSON | JSONB | 否 | | | | 少改表用 | 待确认 |
| created_at / updated_at | 公共字段 | | 是 | | | | 本表可不加软删 | 待确认 |

### D6. `sys_org_member` 组织成员

| 字段名 | 中文名 | 类型 | 必填 | 默认 | 字典绑定 | 唯一/索引 | 备注 | 状态 |
|--------|--------|------|------|------|----------|-----------|------|------|
| id | 主键 | BIGSERIAL | 是 | | | PK | | 待确认 |
| org_id | 组织ID | BIGINT | 是 | | | UK(org,user) FK | | 待确认 |
| user_id | 用户ID | BIGINT | 是 | | | IDX FK | | 待确认 |
| is_primary | 是否主组织 | SMALLINT | 是 | 1 | | | | 待确认 |
| is_org_admin | 是否组织管理员 | SMALLINT | 是 | 0 | | | 注册者通常为1 | 待确认 |
| member_status | 成员状态 | VARCHAR(32) | 是 | ACTIVE | | | | 待确认 |
| joined_at | 加入时间 | TIMESTAMPTZ | 是 | NOW() | | | | 待确认 |
| created_at / updated_at / is_deleted | 公共字段 | | 是 | | | | | 待确认 |

### D7. `sys_role` 角色（门户下细分；权限 + 套餐对象）

| 字段名 | 中文名 | 类型 | 必填 | 默认 | 字典绑定 | 唯一/索引 | 备注 | 状态 |
|--------|--------|------|------|------|----------|-----------|------|------|
| id | 主键 | BIGSERIAL | 是 | | | PK | | 待确认 |
| role_code | 角色编码 | VARCHAR(64) | 是 | | | UK | 全局唯一 | 待确认 |
| role_name | 角色名称 | VARCHAR(128) | 是 | | | | | 待确认 |
| portal_type | 所属门户 | VARCHAR(32) | 是 | | user_portal_type | IDX | 四端之一 | 待确认 |
| data_scope | 数据范围 | SMALLINT | 是 | 1 | | | 1全部2本组织3本人 | 待确认 |
| is_default | 注册默认角色 | SMALLINT | 是 | 0 | | | 1=该门户注册自动赋予 | 待确认 |
| package_eligible | 可推套餐 | SMALLINT | 是 | 0 | | | 1=可作为套餐/服务售卖对象 | 待确认 |
| package_owner_type | 套餐主体偏好 | VARCHAR(16) | 否 | | | | ORG / USER / BOTH；给 mbr_ 参考 | 待确认 |
| remark | 备注 | VARCHAR(512) | 否 | | | | | 待确认 |
| status | 启用 | SMALLINT | 是 | 1 | | | | 待确认 |
| sort_no | 排序 | INT | 是 | 0 | | | | 待确认 |
| created_at / updated_at / is_deleted | 公共字段 | | 是 | | | | | 待确认 |

#### 预置角色（与 C3 对齐，可增删）

| role_code | 角色名 | portal_type | is_default | package_eligible | 状态 |
|-----------|--------|-------------|------------|------------------|------|
| CUSTOMER_PERSONAL | 个人用户 | CUSTOMER | 1 | 1 | 待确认 |
| CUSTOMER_ENTERPRISE_ADMIN | 企业管理员 | CUSTOMER | 0 | 1（企业版绑ORG） | 待确认 |
| CUSTOMER_ENTERPRISE_MEMBER | 企业成员 | CUSTOMER | 0 | 0 | 待确认 |
| ADMIN_SUPER | 超级管理员 | ADMIN | 1 | 0 | 待确认 |
| ADMIN_OPERATOR | 营销/SEO运营 | ADMIN | 0 | 0 | 待确认 |
| ADMIN_CS_LEAD | 客服主管 | ADMIN | 0 | 0 | 待确认 |
| ADMIN_CS | 客服 | ADMIN | 0 | 0 | 待确认 |
| ADMIN_AUDITOR | 审核员 | ADMIN | 0 | 0 | 待确认 |
| ADMIN_FINANCE | 财务管理员 | ADMIN | 0 | 0 | 待确认 |
| SUPPLIER_OWNER | 供应商主账号 | SUPPLIER | 1 | 1 | 待确认 |
| SUPPLIER_PRODUCTION | 生产对接 | SUPPLIER | 0 | 1 | 待确认 |
| SUPPLIER_QC | 质检对接 | SUPPLIER | 0 | 1 | 待确认 |
| SUPPLIER_MEMBER | 普通成员 | SUPPLIER | 0 | 0 | 待确认 |
| MES_OWNER | 系统负责人 | MES | 1 | 1 | 待确认 |
| MES_PLANNER | 计划员 | MES | 0 | 1 | 待确认 |
| MES_SHOP_LEAD | 车间主任 | MES | 0 | 1 | 待确认 |
| MES_OPERATOR | 操作工 | MES | 0 | 1 | 待确认 |
| MES_QC | 质检员 | MES | 0 | 1 | 待确认 |

### D8. `sys_permission` 权限资源

| 字段名 | 中文名 | 类型 | 必填 | 默认 | 字典绑定 | 唯一/索引 | 备注 | 状态 |
|--------|--------|------|------|------|----------|-----------|------|------|
| id | 主键 | BIGSERIAL | 是 | | | PK | | 待确认 |
| perm_code | 权限编码 | VARCHAR(128) | 是 | | | UK | | 待确认 |
| perm_name | 权限名称 | VARCHAR(128) | 是 | | | | | 待确认 |
| perm_type | 权限类型 | SMALLINT | 是 | 1 | | | 1菜单2按钮3接口 | 待确认 |
| parent_id | 父节点 | BIGINT | 否 | 0 | | | 树 | 待确认 |
| path | 路由/路径 | VARCHAR(256) | 否 | | | | | 待确认 |
| method | HTTP方法 | VARCHAR(16) | 否 | | | | 接口权限 | 待确认 |
| portal_type | 门户范围 | VARCHAR(32) | 否 | | user_portal_type | | 空=跨门户 | 待确认 |
| remark / status / sort_no / 公共字段 | | | | | | | | 待确认 |

> 权限明细菜单树建议在「后台菜单定稿」后再灌种子数据；本期可只建空表。

### D9. `sys_user_role` / `sys_role_permission` 关联表

| 表名 | 字段 | 说明 | 状态 |
|------|------|------|------|
| sys_user_role | id, user_id, role_id, created_at | UK(user_id, role_id) | 待确认 |
| sys_role_permission | id, role_id, permission_id, created_at | UK(role_id, permission_id) | 待确认 |

### D10. `sys_user_oauth` 第三方绑定

| 字段名 | 中文名 | 类型 | 必填 | 默认 | 字典绑定 | 唯一/索引 | 备注 | 状态 |
|--------|--------|------|------|------|----------|-----------|------|------|
| id | 主键 | BIGSERIAL | 是 | | | PK | | 待确认 |
| user_id | 用户ID | BIGINT | 是 | | | IDX FK | | 待确认 |
| provider | 渠道 | VARCHAR(32) | 是 | | oauth_provider | UK(provider,open_id) | | 待确认 |
| open_id | 开放ID | VARCHAR(128) | 是 | | | | | 待确认 |
| union_id | 联合ID | VARCHAR(128) | 否 | | | | 微信等 | 待确认 |
| nickname | 昵称 | VARCHAR(128) | 否 | | | | | 待确认 |
| avatar_url | 头像 | VARCHAR(512) | 否 | | | | | 待确认 |
| raw_profile | 原始资料 | JSONB | 否 | | | | | 待确认 |
| bound_at | 绑定时间 | TIMESTAMPTZ | 是 | NOW() | | | | 待确认 |
| created_at / updated_at / is_deleted | 公共字段 | | 是 | | | | | 待确认 |

### D11. `sys_login_log` 登录日志

| 字段名 | 中文名 | 类型 | 必填 | 默认 | 字典绑定 | 唯一/索引 | 备注 | 状态 |
|--------|--------|------|------|------|----------|-----------|------|------|
| id | 主键 | BIGSERIAL | 是 | | | PK | | 待确认 |
| user_id | 用户ID | BIGINT | 否 | | | IDX | 失败时可能为空 | 待确认 |
| portal_type | 门户 | VARCHAR(32) | 否 | | user_portal_type | | | 待确认 |
| login_type | 登录方式 | VARCHAR(32) | 是 | | | | PASSWORD/SMS/OAUTH | 待确认 |
| identifier | 登录标识 | VARCHAR(128) | 否 | | | | 手机/邮箱等 | 待确认 |
| success | 是否成功 | SMALLINT | 是 | | | | 1成功0失败 | 待确认 |
| fail_reason | 失败原因 | VARCHAR(256) | 否 | | | | | 待确认 |
| ip | IP | VARCHAR(64) | 否 | | | | | 待确认 |
| user_agent | UA | VARCHAR(512) | 否 | | | | | 待确认 |
| created_at | 时间 | TIMESTAMPTZ | 是 | NOW() | | IDX | 日志一般不做软删 | 待确认 |

---

## E. 注册落库流程（确认模型用）

**客户（个人优先）**：

```text
客户注册
  → 1. 建账号 sys_user（portal_type=CUSTOMER）
  → 2. 建资料 sys_user_profile
  → 3. 绑角色 CUSTOMER_PERSONAL
  → （可选，稍后）创建企业 sys_org + 绑 CUSTOMER_ENTERPRISE_ADMIN + org_member
  → （可选，稍后）加入企业 + 绑 CUSTOMER_ENTERPRISE_MEMBER + org_member
```

**供应商 / MES / 管理员（组织+主账号）**：

```text
注册请求
  → 1. 建组织 sys_org
  → 2. 建账号 sys_user
  → 3. 建资料 sys_user_profile
  → 4. 挂成员 sys_org_member（is_org_admin=1）
  → 5. 绑默认角色（SUPPLIER_OWNER / MES_OWNER / ADMIN_SUPER）
```

| 步骤 | 是否保留 | 状态 | 调整意见 |
|------|----------|------|----------|
| 客户先个人后企业 | 是 | 待确认 | |
| 供应商/MES 注册仍建组织 | 是 | 待确认 | |

---

## F. 待确认事项（请直接改答案）

| # | 问题 | 当前建议 | 你的答案 |
|---|------|----------|----------|
| 1 | 四端共用一张 `sys_user` 是否接受？ | 接受 | |
| 2 | 客户只分个人/企业，取消岗位角色？ | **是（已按此改）** | |
| 3 | 报价是否仅平台侧，客户/供应商不做报价角色？ | **是（已按此改）** | |
| 4 | 企业服务如何落到个人？ | 企业订购 + 成员授权 | |
| 5 | 个人能否加入多个企业？ | 预留支持 | |
| 6 | 管理员是否开放自助注册？ | 表结构先支持，业务可关入口 | |
| 7 | 供应商角色是否保留生产/质检即可？ | 主账号+生产+质检+成员 | |
| 8 | 表名/前缀是否要改成 `auth_`？ | 暂统一 `sys_` | |

---

## G. 变更记录

| 日期 | 修改人 | 修改内容 |
|------|--------|----------|
| 2026-07-23 | — | 初稿 |
| 2026-07-23 | — | v0.2：门户下角色细分；角色可推套餐字段；mbr_ 套餐绑定规划 |
| 2026-07-23 | — | v0.3：客户改为个人/企业；删除客户工程师等岗位角色与供应商报价员；明确报价归平台；吸收 Word 中运营角色更名 |
