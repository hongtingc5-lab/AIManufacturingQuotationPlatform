import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || '';
const DOUBAO_ENDPOINT_ID = process.env.DOUBAO_ENDPOINT_ID || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, temperature, maxTokens } = body;

    console.log('[AI Proxy] 收到请求:', { promptLength: prompt?.length, temperature, maxTokens });

    const response = await axios.post(
      'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      {
        model: DOUBAO_ENDPOINT_ID,
        messages: [
          {
            role: 'system',
            content: `你是一个专业的制造业工艺分析专家。精通注塑工艺、DFM评估、成本估算。请简洁回答，重点突出关键数据和优化建议。回复使用中文。`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: temperature || 0.7,
        max_tokens: Math.min(maxTokens || 4000, 3000),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DOUBAO_API_KEY}`,
        },
        timeout: 60000,
      }
    );

    console.log('[AI Proxy] 响应成功:', {
      status: response.status,
      usage: response.data?.usage,
      contentLength: response.data?.choices?.[0]?.message?.content?.length,
    });

    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error('[AI Proxy] 请求失败:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    return NextResponse.json({
      success: false,
      error: error.response?.data?.error?.message || error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    }, { status: error.response?.status || 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: DOUBAO_ENDPOINT_ID,
    model: 'Doubao-Seed-Evolving',
  });
}
