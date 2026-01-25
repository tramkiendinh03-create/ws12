import { useCallback, useEffect, useState } from 'react';
import { Schema } from '../../schema';
import {
  Achievement,
  MvuData,
  PlayerStats,
  TargetCharacter,
  transformMvuToAchievements,
  transformMvuToPlayerStats,
  transformMvuToTargets,
  transformMvuToWorldState,
  WorldState,
} from '../types';

// React hook 用于获取 MVU 变量
export function useMvuData() {
  const [data, setData] = useState<MvuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(() => {
    try {
      const message_id = getCurrentMessageId();
      const variables = getVariables({ type: 'message', message_id });
      const stat_data = _.get(variables, 'stat_data', {});
      const parsed = Schema.parse(stat_data);

      // 调试日志：检查当前扮演字段
      console.log('[MVU Debug] 当前扮演值:', parsed.主角状态?.基础信息?.当前扮演);
      console.log('[MVU Debug] 完整主角状态:', parsed.主角状态);

      setData(parsed);
      setError(null);
    } catch (e) {
      console.error('解析 MVU 变量失败:', e);
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 初始加载
    fetchData();

    // 定时轮询更新（每 2 秒）
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// 转换后的数据 hook
export function useGameState() {
  const { data, loading, error, refetch } = useMvuData();

  const world: WorldState | null = data ? transformMvuToWorldState(data) : null;
  const player: PlayerStats | null = data ? transformMvuToPlayerStats(data) : null;
  const targets: TargetCharacter[] = data ? transformMvuToTargets(data) : [];
  const achievements: Achievement[] = data ? transformMvuToAchievements(data) : [];

  return {
    world,
    player,
    targets,
    achievements,
    loading,
    error,
    refetch,
    rawData: data,
  };
}
