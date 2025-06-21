import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveCompletedTasks,
  loadCompletedTasks,
  savePlanData,
  loadPlanData,
  saveGoalToHistory,
  loadGoalHistory,
  clearAllData,
  getStorageStats
} from '../storage.js';

describe('storage.js', () => {
  beforeEach(() => {
    // 各テスト前にLocalStorageをクリア
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('完了タスクの管理', () => {
    it('完了タスクを正しく保存・読み込みできる', () => {
      const tasks = new Set(['task1', 'task2', 'task3']);
      
      // 保存
      const saveResult = saveCompletedTasks(tasks);
      expect(saveResult).toBe(true);
      
      // 読み込み
      const loadedTasks = loadCompletedTasks();
      expect(loadedTasks).toEqual(tasks);
      expect(loadedTasks.has('task1')).toBe(true);
      expect(loadedTasks.has('task4')).toBe(false);
    });

    it('空のSetを正しく処理できる', () => {
      const emptyTasks = new Set();
      
      saveCompletedTasks(emptyTasks);
      const loadedTasks = loadCompletedTasks();
      
      expect(loadedTasks).toEqual(emptyTasks);
      expect(loadedTasks.size).toBe(0);
    });

    it('データが存在しない場合は空のSetを返す', () => {
      const loadedTasks = loadCompletedTasks();
      expect(loadedTasks).toEqual(new Set());
    });

    it('localStorage エラー時に false を返す', () => {
      // setItem でエラーを発生させる
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const tasks = new Set(['task1']);
      const result = saveCompletedTasks(tasks);
      
      expect(result).toBe(false);
      
      // 元に戻す
      localStorage.setItem = originalSetItem;
    });

    it('JSON.parse エラー時に空のSetを返す', () => {
      // 無効なJSONを設定
      localStorage.setItem('gcp_ai_agent_completed_tasks', 'invalid json');
      
      const loadedTasks = loadCompletedTasks();
      expect(loadedTasks).toEqual(new Set());
    });
  });

  describe('プランデータの管理', () => {
    it('プランデータを正しく保存・読み込みできる', () => {
      const planData = {
        goal: 'TOEIC 800点取得',
        estimated_period: '6ヶ月',
        mid_goals: [
          {
            id: 1,
            title: '基礎学習',
            small_goals: [
              {
                id: 1,
                title: '単語学習',
                tasks: ['毎日100単語覚える']
              }
            ]
          }
        ],
        tips: ['継続することが大切']
      };

      // 保存
      const saveResult = savePlanData(planData);
      expect(saveResult).toBe(true);

      // 読み込み
      const loadedPlan = loadPlanData();
      expect(loadedPlan).toEqual(planData);
      expect(loadedPlan.goal).toBe('TOEIC 800点取得');
      expect(loadedPlan.mid_goals).toHaveLength(1);
    });

    it('データが存在しない場合は null を返す', () => {
      const loadedPlan = loadPlanData();
      expect(loadedPlan).toBeNull();
    });

    it('localStorage エラー時に false を返す', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const planData = { goal: 'test' };
      const result = savePlanData(planData);
      
      expect(result).toBe(false);
      
      // 元に戻す
      localStorage.setItem = originalSetItem;
    });
  });

  describe('目標履歴の管理', () => {
    it('目標履歴を正しく保存・読み込みできる', () => {
      const goal = 'TOEIC 800点取得';
      const planData = { goal, estimated_period: '6ヶ月' };

      // 保存
      const saveResult = saveGoalToHistory(goal, planData);
      expect(saveResult).toBe(true);

      // 読み込み
      const history = loadGoalHistory();
      expect(history).toHaveLength(1);
      expect(history[0].goal).toBe(goal);
      expect(history[0].planData).toEqual(planData);
      expect(history[0].id).toBeDefined();
      expect(history[0].createdAt).toBeDefined();
      expect(history[0].lastUpdated).toBeDefined();
    });

    it('複数の目標を時系列順に保存できる', () => {
      const goals = [
        { goal: '目標1', planData: { goal: '目標1' } },
        { goal: '目標2', planData: { goal: '目標2' } },
        { goal: '目標3', planData: { goal: '目標3' } }
      ];

      // 順番に保存
      goals.forEach(({ goal, planData }) => {
        saveGoalToHistory(goal, planData);
      });

      const history = loadGoalHistory();
      expect(history).toHaveLength(3);
      
      // 最新が最初に来ることを確認
      expect(history[0].goal).toBe('目標3');
      expect(history[1].goal).toBe('目標2');
      expect(history[2].goal).toBe('目標1');
    });

    it('履歴が10件を超えた場合は古いものを削除する', () => {
      // 12件の目標を保存
      for (let i = 1; i <= 12; i++) {
        saveGoalToHistory(`目標${i}`, { goal: `目標${i}` });
      }

      const history = loadGoalHistory();
      expect(history).toHaveLength(10);
      
      // 最新の10件のみ残っていることを確認
      expect(history[0].goal).toBe('目標12');
      expect(history[9].goal).toBe('目標3');
    });

    it('データが存在しない場合は空配列を返す', () => {
      const history = loadGoalHistory();
      expect(history).toEqual([]);
    });
  });

  describe('データクリア機能', () => {
    it('すべてのデータを正しくクリアできる', () => {
      // データを保存
      saveCompletedTasks(new Set(['task1']));
      savePlanData({ goal: 'test' });
      saveGoalToHistory('test goal', { goal: 'test' });

      // クリア実行
      const clearResult = clearAllData();
      expect(clearResult).toBe(true);

      // すべてのデータがクリアされていることを確認
      expect(loadCompletedTasks()).toEqual(new Set());
      expect(loadPlanData()).toBeNull();
      expect(loadGoalHistory()).toEqual([]);
    });

    it('localStorage エラー時に false を返す', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const result = clearAllData();
      expect(result).toBe(false);
      
      // 元に戻す
      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('統計情報の取得', () => {
    it('正しい統計情報を返す', () => {
      // テストデータを設定
      const tasks = new Set(['task1', 'task2']);
      const planData = { 
        goal: 'test',
        createdAt: '2024-01-01T00:00:00.000Z'
      };
      
      saveCompletedTasks(tasks);
      savePlanData(planData);
      saveGoalToHistory('goal1', planData);
      saveGoalToHistory('goal2', planData);

      const stats = getStorageStats();
      
      expect(stats.completedTasksCount).toBe(2);
      expect(stats.hasPlanData).toBe(true);
      expect(stats.goalHistoryCount).toBe(2);
      expect(stats.lastUpdate).toBeDefined();
    });

    it('データが存在しない場合のデフォルト値を返す', () => {
      const stats = getStorageStats();
      
      expect(stats.completedTasksCount).toBe(0);
      expect(stats.hasPlanData).toBe(false);
      expect(stats.goalHistoryCount).toBe(0);
      expect(stats.lastUpdate).toBeNull();
    });

    it('エラー時にデフォルト値を返す', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const stats = getStorageStats();
      
      expect(stats.completedTasksCount).toBe(0);
      expect(stats.hasPlanData).toBe(false);
      expect(stats.goalHistoryCount).toBe(0);
      expect(stats.lastUpdate).toBeNull();
      
      // 元に戻す
      localStorage.getItem = originalGetItem;
    });
  });
});