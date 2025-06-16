import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_check():
    """ヘルスチェックのテスト"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {response.status_code}")
        print(f"Response: {response.json()}")
        print("-" * 50)
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ サーバーに接続できません。サーバーが起動しているか確認してください。")
        return False

def test_root_endpoint():
    """ルートエンドポイントのテスト"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root Endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
        print("-" * 50)
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ サーバーに接続できません。")
        return False

def test_goal_plan():
    """目標プラン生成のテスト"""
    goals = [
        "TOEIC 800点を取得する",
        "Pythonでウェブアプリを作れるようになる",
        "基本情報技術者試験に合格する",
        "フルマラソンを完走する"
    ]
    
    success_count = 0
    
    for goal in goals:
        print(f"🎯 Testing goal: {goal}")
        try:
            response = requests.post(
                f"{BASE_URL}/api/goal/plan",
                json={"goal": goal},
                timeout=60  # 60秒でタイムアウト
            )
            
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Goal: {result['goal']}")
                print(f"📅 Period: {result['estimated_period']}")
                print(f"🎯 Mid Goals: {len(result['mid_goals'])}")
                print(f"💡 Tips: {len(result['tips'])}")
                
                # 構造の詳細確認
                if result['mid_goals']:
                    first_mid_goal = result['mid_goals'][0]
                    print(f"   First Mid Goal: {first_mid_goal['title']}")
                    if first_mid_goal['small_goals']:
                        print(f"   Small Goals in first Mid Goal: {len(first_mid_goal['small_goals'])}")
                
                success_count += 1
            else:
                print(f"❌ Error: {response.text}")
        
        except requests.exceptions.Timeout:
            print("⏰ リクエストがタイムアウトしました")
        except requests.exceptions.ConnectionError:
            print("❌ サーバーに接続できません")
        except Exception as e:
            print(f"❌ 予期しないエラー: {e}")
        
        print("-" * 70)
    
    print(f"📊 テスト結果: {success_count}/{len(goals)} 成功")
    return success_count

def test_legacy_api():
    """レガシーAPIのテスト"""
    print("🔄 Testing Legacy API...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/generate",
            json={"user_input": "TOEIC 800点を取得したい"}
        )
        
        print(f"Legacy API Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Legacy Response received (length: {len(result.get('response', ''))})")
        else:
            print(f"❌ Legacy API Error: {response.text}")
        
        print("-" * 50)
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Legacy API Error: {e}")
        return False

def main():
    """メインテスト実行"""
    print("🚀 GCP AI Agent API テスト開始")
    print("=" * 70)
    
    # 基本接続テスト
    if not test_health_check():
        print("❌ ヘルスチェックが失敗しました。サーバーを起動してください。")
        return
    
    if not test_root_endpoint():
        print("❌ ルートエンドポイントが失敗しました。")
        return
    
    # メイン機能テスト
    success_count = test_goal_plan()
    
    # レガシーAPIテスト
    legacy_success = test_legacy_api()
    
    # 結果サマリー
    print("=" * 70)
    print("📊 テスト結果サマリー")
    print(f"   目標プラン生成: {success_count}/4 成功")
    print(f"   レガシーAPI: {'✅ 成功' if legacy_success else '❌ 失敗'}")
    
    if success_count > 0:
        print("🎉 APIは正常に動作しています！")
    else:
        print("⚠️  APIに問題がある可能性があります。ログを確認してください。")

if __name__ == "__main__":
    main()