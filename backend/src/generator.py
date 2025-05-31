from google import genai
from google.genai import types
import base64
import json

def llm_generator(user_text):
    # JSONファイルを開いて読み込む
    with open("backend/src/system_prompt.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # "system_prompt"の値を取り出す
    system_prompt = data["system_prompt"] 
    
    client = genai.Client(
        vertexai=True,
        project="gcp-ai-461501",
        location="global",
    )

    msg1_text1 = types.Part.from_text(text=system_prompt)
    
    msg2_text1 = types.Part.from_text(text="""**Planning a Response Format** I'm focused on structuring the output. The JSON format is clear. I need to make sure the \"response\" field contains a well-defined learning plan as a string. It needs to be easy to understand, complete, and actionable.""")
    msg2_text2 = types.Part.from_text(text="""**Developing the Plan** I've started building out the learning plan's structure, imagining the user's \"Grand Goal\" as \"Master Web Scraping using Python.\" I'm now working on outlining the \"Mid Goals\" – the major steps to achieve this. These will break down the grand goal into manageable chunks. Next up, I'll detail the \"Small Goals\" and practical exercises.""")
    msg2_text3 = types.Part.from_text(text="""**Formulating Concrete Examples** I'm now in the example phase. I've fleshed out a \"Grand Goal\" and designed the first \"Mid Goal\" with the corresponding \"Small Goals\" and an example of an exercise. I have also included a multiple-choice question. This provides a template for me to work from and now I need to complete the remaining \"Small Goals\" and their respective exercises. The structure seems solid.""")
    msg2_text4 = types.Part.from_text(text="""**Expanding Sample Plan** I'm building out the detailed plan further. I've detailed the initial mid-goal, providing small goals and examples. I am now completing the second mid-goal, adding both practical tasks and the multiple-choice questions, and I'm going to complete this mid-goal completely. I've focused on concrete examples.""")
    msg2_text5 = types.Part.from_text(text="""**Generating a Detailed Example** I've crafted the \"Grand Goal\" and detailed the first two \"Mid Goals.\" Each contains \"Small Goals,\" practical \"Tasks,\" and multiple-choice questions. I'm now moving into detailing the third \"Mid Goal,\" adding the elements that the user is asking for. I'm focusing on providing a practical, complete, and actionable learning path.""")
    msg2_text6 = types.Part.from_text(text="""**Structuring the Detailed Plan** I've completed the third \"Mid Goal,\" including \"Small Goals,\" exercises, and questions. I've then moved on to the fourth and final \"Mid Goal,\" and populated it. This gives me a fully detailed, actionable learning plan based on the user's requirements. I'm now reviewing it to ensure it is complete and easy to use.""")
    msg2_text7 = types.Part.from_text(text="""**Reviewing and Refinement** I've completed the entire structure with the concrete example, including the JSON format and a learning plan. Now, I'm reviewing the content to ensure that it meets the requirements of being complete, actionable, and beginner-friendly. I'm going to polish up the structure and remove any unnecessary content to make it as easy to use as possible.""")
    msg2_text8 = types.Part.from_text(text="""**Constructing the Final Output** I've crafted a detailed and complete learning plan based on the given specifications, including practical exercises and multiple-choice questions. The plan is formatted as a string ready to be inserted into the JSON response. I will now assemble the JSON output using the example and prepare to deliver the final product.""")
    msg2_text9 = types.Part.from_text(text="""**Encapsulating and Formatting** I've transformed the detailed learning plan into a single string, designed to fit into the specified JSON format's \"response\" field. This involves ensuring that all the elements, including the goals, tasks, and questions, are correctly formatted to allow for the correct display. I'm checking the final structure to ensure it adheres to the requirements.""")
    msg2_text10 = types.Part.from_text(text="""**Creating the Final Response** I've constructed the final JSON output with the detailed learning plan, the \"Grand Goal\", \"Mid Goals,\" \"Small Goals,\" exercises, and multiple-choice questions. The complete structure has been verified. I will now return the final JSON format ready for use.""")
    msg2_text11 = types.Part.from_text(text="""**Converting the Detailed Plan** I've successfully converted the detailed learning plan, complete with its structure, tasks, and multiple-choice questions into a single string, ready for insertion into the \"response\" field of the JSON. This has been verified. I'm now focusing on optimizing the structure of the string so that the information will display well.""")
    msg2_text12 = types.Part.from_text(text="""**Refining the JSON Response** I've taken the detailed learning plan, translated it into a single string, and encapsulated it within the \"response\" field. I'm now focused on ensuring the string's format optimizes the user experience and complies with the JSON structure. This includes careful attention to readability and information hierarchy within the long string, preparing for its final presentation.""")
    msg2_text13 = types.Part.from_text(text="""**Stringing Together the Plan** I've converted the detailed learning plan into a single, long string that's ready to be encapsulated within the \"response\" field of the JSON output. I've paid close attention to removing any unnecessary formatting, and I'm verifying the final product now to ensure it complies with the required structure and remains easy to understand.""")
    msg2_text14 = types.Part.from_text(text="""**Stringing Together the Plan** I've combined the detailed learning plan, including all goals, tasks, and questions, into a single string, ready for the JSON \"response\" field. I've formatted it to adhere precisely to the required structure, ensuring readability and ease of use while also strictly adhering to the no-newline, no-tab constraint. I will now verify this structure one more time.""")
    
    si_text1 = system_prompt

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
            msg2_text14
        ]
        ),
        types.Content(
        role="user",
        parts=[
            types.Part.from_text(text= user_text)
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

    result = client.models.generate_content(
        model = model,
        contents = contents,
        config = generate_content_config,
    )
    # for chunk in client.models.generate_content_stream(
    #     model = model,
    #     contents = contents,
    #     config = generate_content_config,
    #     ):
        
    #     print(chunk.text, end="")
    
    result_text = result.text
        
    return result_text


def main():
    user_text = """以下の「大目標」に対して、達成のために必要な中目標、小目標、それぞれに対応する課題（必要に応じて選択問題も含む）を作成してください。\n# 大目標：\nTOEIC 800点"""
    result_text = llm_generater(user_text)
    print("result_text", result_text)

if __name__ == "__main__":
    main()
    