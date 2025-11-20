import fs from 'fs';

// A2 modules for each language
const a2Modules = {
    hi: `    {
      level: 'A2',
      theme: 'उपयोगी वाक्यांश',
      description: 'रोज़मर्रा की स्थितियों के लिए वाक्यांशों के साथ अपनी बुनियादी बातों को बढ़ाएं।',
      units: [
        { unitId: 'hi-a2-u1', title: 'दिशा पूछना', emoji: '🗺️', words: [] },
        { unitId: 'hi-a2-u2', title: 'समय बताना', emoji: '⏰', words: [] },
        { unitId: 'hi-a2-u3', title: 'दैनिक दिनचर्या', emoji: '☕', words: [] },
      ]
    }`,
    ta: `    {
      level: 'A2',
      theme: 'பயனுள்ள சொற்றொடர்கள்',
      description: 'தினசரி சூழ்நிலைகளுக்கான சொற்றொடர்களுடன் உங்கள் அடிப்படைகளை உருவாக்குங்கள்.',
      units: [
        { unitId: 'ta-a2-u1', title: 'திசை கேட்பது', emoji: '🗺️', words: [] },
        { unitId: 'ta-a2-u2', title: 'நேரம் சொல்வது', emoji: '⏰', words: [] },
        { unitId: 'ta-a2-u3', title: 'தினசரி வழக்கம்', emoji: '☕', words: [] },
      ]
    }`,
    kn: `    {
      level: 'A2',
      theme: 'ಉಪಯುಕ್ತ ಪದಗುಚ್ಛಗಳು',
      description: 'ದೈನಂದಿನ ಸನ್ನಿವೇಶಗಳಿಗಾಗಿ ಪದಗುಚ್ಛಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಮೂಲತತ್ವಗಳನ್ನು ನಿರ್ಮಿಸಿ.',
      units: [
        { unitId: 'kn-a2-u1', title: 'ದಿಕ್ಕು ಕೇಳುವುದು', emoji: '🗺️', words: [] },
        { unitId: 'kn-a2-u2', title: 'ಸಮಯ ಹೇಳುವುದು', emoji: '⏰', words: [] },
        { unitId: 'kn-a2-u3', title: 'ದೈನಂದಿನ ದಿನಚರಿ', emoji: '☕', words: [] },
      ]
    }`,
    te: `    {
      level: 'A2',
      theme: 'ఉపయోగకరమైన పదబంధాలు',
      description: 'రోజువారీ పరిస్థితుల కోసం పదబంధాలతో మీ ప్రాథమికాలను నిర్మించండి.',
      units: [
        { unitId: 'te-a2-u1', title: 'దిశలు అడగడం', emoji: '🗺️', words: [] },
        { unitId: 'te-a2-u2', title: 'సమయం చెప్పడం', emoji: '⏰', words: [] },
        { unitId: 'te-a2-u3', title: 'రోజువారీ దినచర్య', emoji: '☕', words: [] },
      ]
    }`,
    ml: `    {
      level: 'A2',
      theme: 'ഉപയോഗപ്രദമായ പദസമുച്ചയങ്ങൾ',
      description: 'ദൈനംദിന സാഹചര്യങ്ങൾക്കുള്ള പദസമുച്ചയങ്ങളുമായി നിങ്ങളുടെ അടിസ്ഥാനങ്ങൾ നിർമ്മിക്കുക.',
      units: [
        { unitId: 'ml-a2-u1', title: 'ദിശ ചോദിക്കുന്നു', emoji: '🗺️', words: [] },
        { unitId: 'ml-a2-u2', title: 'സമയം പറയുന്നു', emoji: '⏰', words: [] },
        { unitId: 'ml-a2-u3', title: 'ദൈനംദിന ദിനചര്യ', emoji: '☕', words: [] },
      ]
    }`,
    mr: `    {
      level: 'A2',
      theme: 'उपयुक्त वाक्प्रचार',
      description: 'रोजच्या परिस्थितींसाठी वाक्प्रचारांसह आपले मूलभूत ज्ञान वाढवा.',
      units: [
        { unitId: 'mr-a2-u1', title: 'दिशा विचारणे', emoji: '🗺️', words: [] },
        { unitId: 'mr-a2-u2', title: 'वेळ सांगणे', emoji: '⏰', words: [] },
        { unitId: 'mr-a2-u3', title: 'रोजची दिनचर्या', emoji: '☕', words: [] },
      ]
    }`,
    or: `    {
      level: 'A2',
      theme: 'ଉପଯୋଗୀ ବାକ୍ୟାଂଶ',
      description: 'ଦୈନନ୍ଦିନ ପରିସ୍ଥିତି ପାଇଁ ବାକ୍ୟାଂଶ ସହିତ ଆପଣଙ୍କର ମୌଳିକତା ଉପରେ ନିର୍ମାଣ କରନ୍ତୁ |',
      units: [
        { unitId: 'or-a2-u1', title: 'ଦିଗ ପଚାରିବା', emoji: '🗺️', words: [] },
        { unitId: 'or-a2-u2', title: 'ସମୟ କହିବା', emoji: '⏰', words: [] },
        { unitId: 'or-a2-u3', title: 'ଦୈନନ୍ଦିନ ରୁଟିନ୍', emoji: '☕', words: [] },
      ]
    }`,
    gu: `    {
      level: 'A2',
      theme: 'ઉપયોગી શબ્દસમૂહો',
      description: 'દૈનિક પરિસ્થિતિઓ માટે શબ્દસમૂહો સાથે તમારા મૂળભૂત પર નિર્માણ કરો.',
      units: [
        { unitId: 'gu-a2-u1', title: 'દિશા પૂછવી', emoji: '🗺️', words: [] },
        { unitId: 'gu-a2-u2', title: 'સમય જણાવવો', emoji: '⏰', words: [] },
        { unitId: 'gu-a2-u3', title: 'દૈનિક દિનચર્યા', emoji: '☕', words: [] },
      ]
    }`,
    bn: `    {
      level: 'A2',
      theme: 'উপযোগী বাক্যাংশ',
      description: 'দৈনন্দিন পরিস্থিতির জন্য বাক্যাংশ দিয়ে আপনার মৌলিক বিষয়গুলি তৈরি করুন।',
      units: [
        { unitId: 'bn-a2-u1', title: 'দিক জিজ্ঞাসা করা', emoji: '🗺️', words: [] },
        { unitId: 'bn-a2-u2', title: 'সময় বলা', emoji: '⏰', words: [] },
        { unitId: 'bn-a2-u3', title: 'দৈনন্দিন রুটিন', emoji: '☕', words: [] },
      ]
    }`,
    it: `    {
      level: 'A2',
      theme: 'Espressioni Utili',
      description: 'Costruisci le tue basi con frasi per situazioni quotidiane.',
      units: [
        { unitId: 'it-a2-u1', title: 'Chiedere Indicazioni', emoji: '🗺️', words: [] },
        { unitId: 'it-a2-u2', title: 'Dire l\\'ora', emoji: '⏰', words: [] },
        { unitId: 'it-a2-u3', title: 'Routine Quotidiana', emoji: '☕', words: [] },
      ]
    }`,
    da: `    {
      level: 'A2',
      theme: 'Nyttige Udtryk',
      description: 'Byg videre på dine grundlæggende færdigheder med sætninger til hverdagssituationer.',
      units: [
        { unitId: 'da-a2-u1', title: 'Spørge om Vej', emoji: '🗺️', words: [] },
        { unitId: 'da-a2-u2', title: 'Fortælle Tiden', emoji: '⏰', words: [] },
        { unitId: 'da-a2-u3', title: 'Daglig Rutine', emoji: '☕', words: [] },
      ]
    }`,
    pt: `    {
      level: 'A2',
      theme: 'Expressões Úteis',
      description: 'Desenvolva suas bases com frases para situações cotidianas.',
      units: [
        { unitId: 'pt-a2-u1', title: 'Pedir Direções', emoji: '🗺️', words: [] },
        { unitId: 'pt-a2-u2', title: 'Dizer as Horas', emoji: '⏰', words: [] },
        { unitId: 'pt-a2-u3', title: 'Rotina Diária', emoji: '☕', words: [] },
      ]
    }`,
    fi: `    {
      level: 'A2',
      theme: 'Hyödylliset Ilmaisut',
      description: 'Rakenna perusteesi jokapäiväisiin tilanteisiin sopivilla ilmaisuilla.',
      units: [
        { unitId: 'fi-a2-u1', title: 'Kysyä Suuntaa', emoji: '🗺️', words: [] },
        { unitId: 'fi-a2-u2', title: 'Kertoa Aika', emoji: '⏰', words: [] },
        { unitId: 'fi-a2-u3', title: 'Päivittäinen Rutiini', emoji: '☕', words: [] },
      ]
    }`
};

// Read the file
let content = fs.readFileSync('i18n/learningPath.ts', 'utf-8');

// For each language, add A2 module
Object.keys(a2Modules).forEach(langCode => {
    const pattern = new RegExp(`${langCode}: \\[([\\s\\S]*?)\\n  \\],`, 'm');
    const match = content.match(pattern);

    if (match) {
        const oldLangSection = match[0];
        const newLangSection = oldLangSection.replace(/\n  \],/, `,\n${a2Modules[langCode]}\n  ],`);
        content = content.replace(oldLangSection, newLangSection);
        console.log(`✓ Added A2 module for ${langCode}`);
    } else {
        console.log(`✗ Could not find ${langCode}`);
    }
});

// Write back
fs.writeFileSync('i18n/learningPath.ts', content, 'utf-8');
console.log('\n✅ Successfully added A2 modules to all 11 languages!');
