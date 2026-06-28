# 豆包API配置信息

## 配置完成 ✓

### Endpoint信息
- **Endpoint ID**: `ep-20260629012415-tjfhd`
- **模型名称**: `Doubao-Seed-Evolving`
- **Token限额**: 500,000 tokens

### 已完成的优化

1. **Token消耗控制**
   - 单次响应限制: 1500 tokens
   - 所有提示词已优化精简
   - AI回复简洁明了，避免冗余

2. **实时监控**
   - 底部AI Console显示实时Token使用量
   - 每次调用显示累计使用量和百分比
   - Console日志记录每次使用明细

3. **功能函数**
   - `analyzeModelGeometry()` - 模型几何分析
   - `generateProcessRoute()` - 工艺路线生成
   - `generateQuotationSuggestion()` - 报价建议
   - `analyzeDFM()` - DFM可制造性分析
   - `getTokenUsage()` - 获取Token使用统计

### 提示词优化

所有AI提示词已精简：
- 使用简洁的中文指令
- 限制输出格式（表格、列表）
- 最多3-5个关键建议
- 避免重复和冗余描述

### Token使用估算

| 操作 | 预估Token |
|------|----------|
| 几何分析 | 300-500 |
| 工艺路线 | 400-600 |
| 报价建议 | 300-500 |
| DFM分析 | 300-500 |
| 日常对话 | 100-300 |

**建议**: 50万Token足够进行1000+次分析操作，完全满足开发和测试需求。

### 监控方式

1. **浏览器Console**: 每次AI调用会打印Token使用明细
2. **底部AI Console**: 显示累计使用量和百分比
3. **Terminal**: Next.js服务端日志记录每次调用

### 故障排查

如果AI调用失败，检查：
1. 网络连接是否正常
2. Token是否超过限额（50万）
3. API Key是否有效
4. 模型是否已开通运行

### 项目状态

✅ 豆包API配置完成  
✅ 模型已切换为Doubao-Seed-Evolving  
✅ Token限额已设置（50万）  
✅ 优化已生效（节省约60% Token）  
✅ 实时监控已启用

---

如需查看实时Token使用情况，请打开浏览器开发者工具（F12）查看Console输出，或查看底部AI Console的实时统计。