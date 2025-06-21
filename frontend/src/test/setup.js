import '@testing-library/jest-dom'

// LocalStorage の実装をモック（実際の動作をシミュレート）
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

global.localStorage = new LocalStorageMock();

// 各テスト前にLocalStorageをクリア
beforeEach(() => {
  localStorage.clear();
});