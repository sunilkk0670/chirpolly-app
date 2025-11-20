import json

# A2 modules for each language that needs them
a2_modules = {
    "hi": {
        "level": "A2",
        "theme": "उपयोगी वाक्यांश",
        "description": "रोज़मर्रा की स्थितियों के लिए वाक्यांशों के साथ अपनी बुनियादी बातों को बढ़ाएं।",
        "units": [
            {"unitId": "hi-a2-u1", "title": "दिशा पूछना", "emoji": "🗺️", "words": []},
            {"unitId": "hi-a2-u2", "title": "समय बताना", "emoji": "⏰", "words": []},
            {"unitId": "hi-a2-u3", "title": "दैनिक दिनचर्या", "emoji": "☕", "words": []}
        ]
    },
    "ta": {
        "level": "A2",
        "theme": "பயனுள்ள சொற்றொடர்கள்",
        "description": "தினசரி சூழ்நிலைகளுக்கான சொற்றொடர்களுடன் உங்கள் அடிப்படைகளை உருவாக்குங்கள்.",
        "units": [
            {"unitId": "ta-a2-u1", "title": "திசை கேட்பது", "emoji": "🗺️", "words": []},
            {"unitId": "ta-a2-u2", "title": "நேரம் சொல்வது", "emoji": "⏰", "words": []},
            {"unitId": "ta-a2-u3", "title": "தினசரி வழக்கம்", "emoji": "☕", "words": []}
        ]
    },
    "kn": {
        "level": "A2",
        "theme": "ಉಪಯುಕ್ತ ಪದಗುಚ್ಛಗಳು",
        "description": "ದೈನಂದಿನ ಸನ್ನಿವೇಶಗಳಿಗಾಗಿ ಪದಗುಚ್ಛಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಮೂಲತತ್ವಗಳನ್ನು ನಿರ್ಮಿಸಿ.",
        "units": [
            {"unitId": "kn-a2-u1", "title": "ದಿಕ್ಕು ಕೇಳುವುದು", "emoji": "🗺️", "words": []},
            {"unitId": "kn-a2-u2", "title": "ಸಮಯ ಹೇಳುವುದು", "emoji": "⏰", "words": []},
            {"unitId": "kn-a2-u3", "title": "ದೈನಂದಿನ ದಿನಚರಿ", "emoji": "☕", "words": []}
        ]
    },
    "te": {
        "level": "A2",
        "theme": "ఉపయోగకరమైన పదబంధాలు",
        "description": "రోజువారీ పరిస్థితుల కోసం పదబంధాలతో మీ ప్రాథమికాలను నిర్మించండి.",
        "units": [
            {"unitId": "te-a2-u1", "title": "దిశలు అడగడం", "emoji": "🗺️", "words": []},
           {"unitId": "te-a2-u2", "title": "సమయం చెప్పడం", "emoji": "⏰", "words": []},
            {"unitId": "te-a2-u3", "title": "రోజువారీ దినచర్య", "emoji": "☕", "words": []}
        ]
    },
    "ml": {
        "level": "A2",
        "theme": "ഉപയോഗപ്രദമായ പദസമുച്ചയങ്ങൾ",
        "description": "ദൈനംദിന സാഹചര്യങ്ങൾക്കുള്ള പദസമുച്ചയങ്ങളുമായി നിങ്ങളുടെ അടിസ്ഥാനങ്ങൾ നിർമ്മിക്കുക.",
        "units": [
            {"unitId": "ml-a2-u1", "title": "ദിശ ചോദിക്കുന്നു", "emoji": "🗺️", "words": []},
            {"unitId": "ml-a2-u2", "title": "സമയം പറയുന്നു", "emoji": "⏰", "words": []},
            {"unitId": "ml-a2-u3", "title": "ദൈനംദിന ദിനചര്യ", "emoji": "☕", "words": []}
        ]
    },
    "mr": {
        "level": "A2",
        "theme": "उपयुक्त वाक्प्रचार",
        "description": "रोजच्या परिस्थितींसाठी व

ाक्प्रचारांसह आपले मूलभूत ज्ञान वाढवा.",
        "units": [
            {"unitId": "mr-a2-u1", "title": "दिशा विचारणे", "emoji": "🗺️", "words": []},
            {"unitId": "mr-a2-u2", "title": "वेळ सांगणे", "emoji": "⏰", "words": []},
            {"unitId": "mr-a2-u3", "title": "रोजची दिनचर्या", "emoji": "☕", "words": []}
        ]
    },
    "or": {
        "level": "A2",
        "theme": "ଉପଯୋଗୀ ବାକ୍ୟାଂଶ",
        "description": "ଦୈନନ୍ଦିନ ପରିସ୍ଥିତି ପାଇଁ ବାକ୍ୟାଂଶ ସହିତ ଆପଣଙ୍କର ମୌଳିକତା ଉପରେ ନିର୍ମାଣ କରନ୍ତୁ |",
        "units": [
            {"unitId": "or-a2-u1", "title": "ଦିଗ ପଚାରିବା", "emoji": "🗺️", "words": []},
            {"unitId": "or-a2-u2", "title": "ସମୟ କହିବା", "emoji": "⏰", "words": []},
            {"unitId": "or-a2-u3", "title": "ଦୈନନ୍ଦିନ ରୁଟିନ୍", "emoji": "☕", "words": []}
        ]
    },
    "gu": {
        "level": "A2",
        "theme": "ઉપયોગી શબ્દસમૂહો",
        "description": "દૈનિક પરિસ્થિતિઓ માટે શબ્દસમૂહો સાથે તમારા મૂળભૂત પર નિર્માણ કરો.",
        "units": [
            {"unitId": "gu-a2-u1", "title": "દિશા પૂછવી", "emoji": "🗺️", "words": []},
            {"unitId": "gu-a2-u2", "title": "સમય જણાવવો", "emoji": "⏰", "words": []},
            {"unitId": "gu-a2-u3", "title": "દૈનિક દિનચર્યા", "emoji": "☕", "words": []}
        ]
    },
    "bn": {
        "level": "A2",
        "theme": "উপযোগী বাক্যাংশ",
        "description": "দৈনন্দিন পরিস্থিতির জন্য বাক্যাংশ দিয়ে আপনার মৌলিক বিষয়গুলি তৈরি করুন।",
        "units": [
            {"unitId": "bn-a2-u1", "title": "দিক জিজ্ঞাসা করা", "emoji": "🗺️", "words": []},
            {"unitId": "bn-a2-u2", "title": "সময় বলা", "emoji": "⏰", "words": []},
            {"unitId": "bn-a2-u3", "title": "দৈনন্দিন রুটিন", "emoji": "☕", "words": []}
        ]
    },
    "it": {
        "level": "A2",
        "theme": "Espressioni Utili",
        "description": "Costruisci le tue basi con frasi per situazioni quotidiane.",
        "units": [
            {"unitId": "it-a2-u1", "title": "Chiedere Indicazioni", "emoji": "🗺️", "words": []},
            {"unitId": "it-a2-u2", "title": "Dire l'ora", "emoji": "⏰", "words": []},
            {"unitId": "it-a2-u3", "title": "Routine Quotidiana", "emoji": "☕", "words": []}
        ]
    },
    "da": {
        "level": "A2",
        "theme": "Nyttige Udtryk",
        "description": "Byg videre på dine grundlæggende færdigheder med sætninger til hverdagssituationer.",
        "units": [
            {"unitId": "da-a2-u1", "title": "Spørge om Vej", "emoji": "🗺️", "words": []},
            {"unitId": "da-a2-u2", "title": "Fortælle Tiden", "emoji": "⏰", "words": []},
            {"unitId": "da-a2-u3", "title": "Daglig Rutine", "emoji": "☕", "words": []}
        ]
    },
    "pt": {
        "level": "A2",
        "theme": "Expressões Úteis",
        "description": "Desenvolva suas bases com frases para situações cotidianas.",
        "units": [
            {"unitId": "pt-a2-u1", "title": "Pedir Direções", "emoji": "🗺️", "words": []},
            {"unitId": "pt-a2-u2", "title": "Dizer as Horas", "emoji": "⏰", "words": []},
            {"unitId": "pt-a2-u3", "title": "Rotina Diária", "emoji": "☕", "words": []}
        ]
    },
    "fi": {
        "level": "A2",
        "theme": "Hyödylliset Ilmaisut",
        "description": "Rakenna perusteesi jokapäiväisiin tilanteisiin sopivilla ilmaisuilla.",
        "units": [
            {"unitId": "fi-a2-u1", "title": "Kysyä Suuntaa", "emoji": "🗺️", "words": []},
            {"unitId": "fi-a2-u2", "title": "Kertoa Aika", "emoji": "⏰", "words": []},
            {"unitId": "fi-a2-u3", "title": "Päivittäinen Rutiini", "emoji": "☕", "words": []}
        ]
    }
}

# Read the original file
with open('i18n/learningPath.ts', 'r', encoding='utf-8') as f:
    content = f.read()

#  For each language, insert the A2 module after the A1 module
for lang_code, a2_module in a2_modules.items():
    # Find the closing of the language's A1 section - look for the pattern "]" followed by newlines/spaces and then "]," which marks the end of thelanguage
    search_pattern = f'{lang_code}: ['
    
    # Find the position of this language
    lang_start = content.find(search_pattern)
    if lang_start == -1:
        print(f"Warning: Could not find {lang_code} in file")
        continue
    
    # Find the end of this language section (next language or end of object)
    # Look for the pattern "  ]," which ends the language array
    search_start = lang_start + len(search_pattern)
    
    # Count braces to find the matching closing bracket
    brace_count = 1
    i = search_start
    while i < len(content) and brace_count > 0:
        if content[i] == '[':
            brace_count += 1
        elif content[i] == ']':
            brace_count -= 1
        i += 1
    
    if brace_count != 0:
        print(f"Warning: Could not find end of {lang_code} section")
        continue
    
    # i is now at the position right after the closing ]
    # We need to find the position right before the ],
    # Insert our A2 module before the closing ]
    insert_pos = i - 1
    
    # Build the A2 module string
    a2_str = f''',
    {{
      level: '{a2_module["level"]}',
      theme: '{a2_module["theme"]}',
      description: '{a2_module["description"]}',
      units: [
'''
    
    for unit in a2_module['units']:
        a2_str += f'''        {{ unitId: '{unit['unitId']}', title: '{unit['title']}', emoji: '{unit['emoji']}', words: [] }},\n'''
    
    # Remove trailing comma from last unit
    a2_str = a2_str.rstrip(',\n') + '\n'
    
    a2_str += '''      ]
    }'''
    
    # Insert the A2 module
    content = content[:insert_pos] + a2_str + content[insert_pos:]

# Write the updated content back 
with open('i18n/learningPath.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully added A2 modules to all 11 languages!")
