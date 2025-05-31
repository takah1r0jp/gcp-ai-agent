from google import genai
from google.genai import types
import base64

def generate():
  client = genai.Client(
      vertexai=True,
      project="gcp-ai-461501",
      location="global",
  )

  msg1_text1 = types.Part.from_text(text="""あなたは、与えられた「大目標」を達成するための学習計画・実行課題を設計する教育支援AIです。

以下のルールに従って、体系的かつ実行可能な目標と課題を出力してください：

【目的】
ユーザーが「大目標」を達成するために、ステップごとに学ぶべきことと、それに対応する実践的な課題（可能なら選択問題形式）を作成すること。

【出力形式】
1. ■ 中目標（3～5個）  
- 大目標を達成するための主要なステップ（段階的・網羅的に）
  
2. 各中目標の下に：
- 小目標（3～5個）：中目標を具体化した行動や知識の単位
- 課題（各小目標に1つ以上）：
- 文章課題：小目標を実現するために取り組むべき実践・思考課題
- 選択問題（可能であれば）：4択形式、正解を明示

【制約】
- 抽象的な説明だけで終わらず、ユーザーが実際に取り組める内容に落とし込む
- 専門的な内容でも、初学者向けの丁寧さを忘れない
- 選択問題が作成できない場合はスキップしてよい

【入力】
# 大目標：
[ここに大目標が入る]

【出力例】
（形式として下記のように出力してください）

■ 中目標1：〇〇を理解する  
- 小目標1-1：△△を説明できるようになる  
- 課題：△△について200字で説明してください  
- 選択問題：次のうち、△△の特徴として正しいものはどれか？  
A. ○○　B. □□　C. △△　D. ××  
正解：C  
- 小目標1-2：～～を使って××を行う  
- 課題：～～を使って△△を実践してください  
（選択問題なし）  
（以下略）

# 出力を開始してください""")
  msg2_text1 = types.Part.from_text(text="""**Planning a Response Format**

I'm focused on structuring the output. The JSON format is clear. I need to make sure the \"response\" field contains a well-defined learning plan as a string. It needs to be easy to understand, complete, and actionable.""")
  msg2_text2 = types.Part.from_text(text="""**Developing the Plan**

I've started building out the learning plan's structure, imagining the user's \"Grand Goal\" as \"Master Web Scraping using Python.\" I'm now working on outlining the \"Mid Goals\" – the major steps to achieve this. These will break down the grand goal into manageable chunks. Next up, I'll detail the \"Small Goals\" and practical exercises.""")
  msg2_text3 = types.Part.from_text(text="""**Formulating Concrete Examples**

I'm now in the example phase. I've fleshed out a \"Grand Goal\" and designed the first \"Mid Goal\" with the corresponding \"Small Goals\" and an example of an exercise. I have also included a multiple-choice question. This provides a template for me to work from and now I need to complete the remaining \"Small Goals\" and their respective exercises. The structure seems solid.""")
  msg2_text4 = types.Part.from_text(text="""**Expanding Sample Plan**

I'm building out the detailed plan further. I've detailed the initial mid-goal, providing small goals and examples. I am now completing the second mid-goal, adding both practical tasks and the multiple-choice questions, and I'm going to complete this mid-goal completely. I've focused on concrete examples.""")
  msg2_text5 = types.Part.from_text(text="""**Generating a Detailed Example**

I've crafted the \"Grand Goal\" and detailed the first two \"Mid Goals.\" Each contains \"Small Goals,\" practical \"Tasks,\" and multiple-choice questions. I'm now moving into detailing the third \"Mid Goal,\" adding the elements that the user is asking for. I'm focusing on providing a practical, complete, and actionable learning path.""")
  msg2_text6 = types.Part.from_text(text="""**Structuring the Detailed Plan**

I've completed the third \"Mid Goal,\" including \"Small Goals,\" exercises, and questions. I've then moved on to the fourth and final \"Mid Goal,\" and populated it. This gives me a fully detailed, actionable learning plan based on the user's requirements. I'm now reviewing it to ensure it is complete and easy to use.""")
  msg2_text7 = types.Part.from_text(text="""**Reviewing and Refinement**

I've completed the entire structure with the concrete example, including the JSON format and a learning plan. Now, I'm reviewing the content to ensure that it meets the requirements of being complete, actionable, and beginner-friendly. I'm going to polish up the structure and remove any unnecessary content to make it as easy to use as possible.""")
  msg2_text8 = types.Part.from_text(text="""**Constructing the Final Output**

I've crafted a detailed and complete learning plan based on the given specifications, including practical exercises and multiple-choice questions. The plan is formatted as a string ready to be inserted into the JSON response. I will now assemble the JSON output using the example and prepare to deliver the final product.""")
  msg2_text9 = types.Part.from_text(text="""**Encapsulating and Formatting**

I've transformed the detailed learning plan into a single string, designed to fit into the specified JSON format's \"response\" field. This involves ensuring that all the elements, including the goals, tasks, and questions, are correctly formatted to allow for the correct display. I'm checking the final structure to ensure it adheres to the requirements.""")
  msg2_text10 = types.Part.from_text(text="""**Creating the Final Response**

I've constructed the final JSON output with the detailed learning plan, the \"Grand Goal\", \"Mid Goals,\" \"Small Goals,\" exercises, and multiple-choice questions. The complete structure has been verified. I will now return the final JSON format ready for use.""")
  msg2_text11 = types.Part.from_text(text="""**Converting the Detailed Plan**

I've successfully converted the detailed learning plan, complete with its structure, tasks, and multiple-choice questions into a single string, ready for insertion into the \"response\" field of the JSON. This has been verified. I'm now focusing on optimizing the structure of the string so that the information will display well.""")
  msg2_text12 = types.Part.from_text(text="""**Refining the JSON Response**

I've taken the detailed learning plan, translated it into a single string, and encapsulated it within the \"response\" field. I'm now focused on ensuring the string's format optimizes the user experience and complies with the JSON structure. This includes careful attention to readability and information hierarchy within the long string, preparing for its final presentation.""")
  msg2_text13 = types.Part.from_text(text="""**Stringing Together the Plan**

I've converted the detailed learning plan into a single, long string that's ready to be encapsulated within the \"response\" field of the JSON output. I've paid close attention to removing any unnecessary formatting, and I'm verifying the final product now to ensure it complies with the required structure and remains easy to understand.""")
  msg2_text14 = types.Part.from_text(text="""**Stringing Together the Plan**

I've combined the detailed learning plan, including all goals, tasks, and questions, into a single string, ready for the JSON \"response\" field. I've formatted it to adhere precisely to the required structure, ensuring readability and ease of use while also strictly adhering to the no-newline, no-tab constraint. I will now verify this structure one more time.""")
  msg2_text15 = types.Part.from_text(text="""{
  \"response\": \"■ 中目標1：Webの基本とPython基礎を理解する- 小目標1-1：HTTP/HTTPSの基本とWebの構造を理解する- 課題：Webブラウザで任意のウェブサイトを開き、開発者ツールを使ってHTTPリクエスト/レスポンスを確認し、その流れを説明してください。また、HTMLのタグやCSSのセレクタがどのようにWebページを構成しているかを簡単に説明してください。- 選択問題：Webページが表示される際、ブラウザがサーバーに送信するリクエストの主な種類はどれか？A. TCPリクエストB. FTPリクエストC. HTTPリクエストD. SMTPリクエスト正解：C- 小目標1-2：Pythonの基本的な文法とデータ構造を習得する- 課題：Pythonでリスト、ディクショナリ、セット、タプルをそれぞれ作成し、データの追加、削除、参照を行うコードを記述してください。- 選択問題：Pythonにおいて、順序がなく、重複する要素を許さないデータ型はどれか？A. リスト (list)B. タプル (tuple)C. セット (set)D. ディクショナリ (dict)正解：C- 小目標1-3：Pythonのライブラリインストールと仮想環境の操作を学ぶ- 課題：venvを使ってPythonの仮想環境を作成し、その環境内にrequestsライブラリをインストールしてください。完了後、仮想環境を停止する手順も記述してください。（選択問題なし）■ 中目標2：Webスクレイピングの基本的な手法を習得する- 小目標2-1：requestsライブラリでWebページの内容を取得する- 課題：指定されたURL（例: http://example.com）のHTMLコンテンツをrequestsライブラリを使って取得し、その内容を表示するPythonスクリプトを作成してください。- 選択問題：requestsライブラリでWebページの内容を正常に取得できた場合、Responseオブジェクトのstatus_codeプロパティが示す値として一般的なものはどれか？A. 200B. 404C. 500D. 301正解：A- 小目標2-2：BeautifulSoup4を使ってHTML/XMLからデータを抽出する- 課題：前述の課題で取得したhttp://example.comのHTMLコンテンツから、すべての<h1>タグのテキスト内容と、すべての<a>タグのhref属性の値をBeautifulSoup4を使って抽出するスクリプトを作成してください。- 選択問題：BeautifulSoup4において、特定のCSSセレクタに一致する要素をすべて取得するために使用するメソッドはどれか？A. find()B. find_all()C. select_one()D. select()正解：D- 小目標2-3：基本的なデータ保存方法（CSV/JSON）を学ぶ- 課題：スクレイピングで得られたデータをCSVファイル、またはJSONファイルとして保存するPythonスクリプトを作成してください。保存するデータは、URL、タイトル、本文など自由に設定してください。（選択問題なし）■ 中目標3：実践的なスクレイピング技術を習得する- 小目標3-1：動的なWebサイトのスクレイピング（JavaScriptレンダリング）に対応する- 課題：JavaScriptによって動的にコンテンツが生成されるWebサイト（例: ニュースサイトのコメント欄など、具体例があれば指定）をSelenium等のツールを使ってスクレイピングする手順と、その際に直面する課題（読み込み待機など）の解決策を説明し、簡単なコード例を提示してください。- 選択問題：JavaScriptによってレンダリングされるコンテンツをスクレイピングする際に、requestsやBeautifulSoup4だけでは困難な場合、効果的なツールとして利用されるものはどれか？A. ScrapyB. SeleniumC. lxmlD. PyQuery正解：B- 小目標3-2：ページネーションへの対応とデータ収集の自動化- 課題：複数のページにわたる情報（例: ECサイトの商品リスト）を自動的に次のページに移動しながらスクレイピングするスクリプトのロジックを設計し、その構造を説明してください。（選択問題なし）- 小目標3-3：スクレイピングにおけるエラーハンドリングと対策- 課題：ネットワークエラー、要素が見つからないエラー、IPアドレスブロックなど、スクレイピング中に発生しうるエラーの種類を3つ挙げ、それぞれに対するPythonでのエラーハンドリング（try-except文の使用など）および対策（User-Agent設定、遅延処理など）を記述してください。（選択問題なし）■ 中目標4：法的な側面と倫理を理解する- 小目標4-1：著作権法・プライバシーポリシー・利用規約を遵守する- 課題：Webスクレイピングを行う際に特に注意すべき日本の著作権法におけるポイントを説明し、Webサイトのプライバシーポリシーや利用規約を確認することの重要性についてあなたの考えを述べてください。- 選択問題：一般的に、Webスクレイピングを行う際に最初に確認すべきWebサイトのルールを記述したファイルはどれか？A. humans.txtB. sitemap.xmlC. robots.txtD. WebConfig正解：C- 小目標4-2：スクレイピングがサーバーに与える影響を考慮し、負荷をかけない方法を学ぶ- 課題：スクレイピングがWebサイトのサーバーに過度な負荷をかけないために、どのような対策を講じるべきか具体的に3つ挙げ、それぞれを説明してください。（選択問題なし）\"
}""")

  si_text1 = """あなたは、与えられた「大目標」を達成するための学習計画・実行課題を設計する教育支援AIです。
目的は、「実際に学習者が取り組める課題設計」であり、抽象的で終わらせず、具体的・行動に落とし込むことを重視してください。

以下のルールに従って、体系的かつ実行可能な目標と課題を出力してください：

【目的】
ユーザーが「大目標」を達成するために、ステップごとに学ぶべきことと、それに対応する実践的な課題（可能なら選択問題形式）を作成すること。

【出力形式】
1. ■ 中目標（3～5個）  
- 大目標を達成するための主要なステップ（段階的・網羅的に）
  
2. 各中目標の下に：
- 小目標（3～5個）：中目標を具体化した行動や知識の単位
- 課題（各小目標に1つ以上）：
- 文章課題：小目標を実現するために取り組むべき実践・思考課題
- 選択問題（可能であれば）：4択形式、正解を明示

【制約】
- 抽象的な説明だけで終わらず、ユーザーが実際に取り組める内容に落とし込む
- 専門的な内容でも、初学者向けの丁寧さを忘れない
- 選択問題が作成できない場合はスキップしてよい

【入力】
# 大目標：
[ここに大目標が入る]

【出力例】
（形式として下記のように出力してください）

■ 中目標1：〇〇を理解する  
- 小目標1-1：△△を説明できるようになる  
- 課題：△△について200字で説明してください  
- 選択問題：次のうち、△△の特徴として正しいものはどれか？  
A. ○○　B. □□　C. △△　D. ××  
正解：C  
- 小目標1-2：～～を使って××を行う  
- 課題：～～を使って△△を実践してください  
（選択問題なし）  
（以下略）

# 出力を開始してください"""

  model = "gemini-2.5-flash-preview-05-20"
  contents = [
    types.Content(
      role="user",
      parts=[
        msg1_text1
      ]
    ),
    types.Content(
      role="model",
      parts=[
        msg2_text1,
        msg2_text2,
        msg2_text3,
        msg2_text4,
        msg2_text5,
        msg2_text6,
        msg2_text7,
        msg2_text8,
        msg2_text9,
        msg2_text10,
        msg2_text11,
        msg2_text12,
        msg2_text13,
        msg2_text14,
        msg2_text15
      ]
    ),
    types.Content(
      role="user",
      parts=[
        types.Part.from_text(text="""以下の「大目標」に対して、達成のために必要な中目標、小目標、それぞれに対応する課題（必要に応じて選択問題も含む）を作成してください。

# 大目標：
TOEIC 800点""")
      ]
    ),
  ]

  generate_content_config = types.GenerateContentConfig(
    temperature = 1,
    top_p = 1,
    seed = 0,
    max_output_tokens = 65535,
    safety_settings = [types.SafetySetting(
      category="HARM_CATEGORY_HATE_SPEECH",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_HARASSMENT",
      threshold="OFF"
    )],
    response_mime_type = "application/json",
    response_schema = {"type":"OBJECT","properties":{"response":{"type":"STRING"}}},
    system_instruction=[types.Part.from_text(text=si_text1)],
  )

  for chunk in client.models.generate_content_stream(
    model = model,
    contents = contents,
    config = generate_content_config,
    ):
    print(chunk.text, end="")

generate()