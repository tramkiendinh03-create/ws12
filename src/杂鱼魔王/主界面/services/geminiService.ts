import { ChatMessage } from '../types';

/**
 * 生成游戏响应 - 占位实现
 * TODO: 替换为实际的 AI 生成逻辑（使用酒馆助手的 generate 接口）
 */
export async function generateGameResponse(
  _history: ChatMessage[],
  userInput: string,
  _gameState: unknown,
): Promise<string> {
  // 占位实现：使用酒馆助手的 generate 接口
  try {
    const response = await generate({
      user_input: userInput,
    });
    return response;
  } catch (error) {
    console.error('生成响应失败:', error);
    return '（系统：生成响应时发生错误，请稍后重试）';
  }
}
