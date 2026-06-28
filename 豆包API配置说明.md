# 豆包AI API配置说明

## 一、配置方式

请在环境变量或配置文件中设置以下参数：

- `DOUBAO_API_KEY`: 您的API Key
- `DOUBAO_ENDPOINT_ID`: 推理接入点ID

## 二、豆包API的正确调用方式

### 1. 官方API地址
```
Base URL: https://ark.cn-beijing.volces.com/api/v3
完整Endpoint: https://ark.cn-beijing.volces.com/api/v3/chat/completions
```

### 2. 认证方式
豆包API使用Bearer认证，需要在HTTP Header中添加：
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### 3. 请求参数
```json
{
  "model": "YOUR_ENDPOINT_ID",
  "messages": [
    {
      "role": "system",
      "content": "你是一个AI助手"
    },
    {
      "role": "user",
      "content": "你好"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

## 三、关键配置步骤

1. 获取API Key：在火山方舟平台 → API密钥管理 → 创建API Key
2. 开通豆包模型：在火山方舟平台 → 模型管理中心 → 开通豆包系列模型
3. 创建推理接入点：在火山方舟平台 → 在线推理 → 创建推理接入点，获取Endpoint ID

## 四、常见错误

- 404错误：URL路径错误或Endpoint ID不正确
- 401错误：API Key错误或格式不对
- 400错误：参数缺失或model参数使用了模型名称而非Endpoint ID
