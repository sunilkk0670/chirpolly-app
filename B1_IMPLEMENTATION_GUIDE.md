# B1 Lessons Implementation Guide

## Quick Start

The B1 lessons are now integrated into ChirPolly. Here's how to work with them:

## Accessing B1 Lessons

### 1. From Code
```typescript
import { LESSONS_WITH_B1, B1_LESSONS } from './constants';

// Get all lessons (A1/A2 + B1)
const allLessons = LESSONS_WITH_B1;

// Get only B1 lessons
const b1Only = B1_LESSONS;

// Get lessons by level
const beginnerLessons = LESSONS_WITH_B1.filter(l => l.level === 'Beginner');
const intermediateLessons = LESSONS_WITH_B1.filter(l => l.level === 'Intermediate');

// Get lessons by language
const spanishLessons = LESSONS_WITH_B1.filter(l => l.lang === 'es');

// Get specific lesson
const englishB1 = LESSONS_WITH_B1.find(l => l.lesson_id === 'en_b1_01');
```

### 2. From URL
Navigate directly to B1 lessons:
- English B1: `/lesson/en_b1_01`
- Spanish B1: `/lesson/es_b1_01`
- French B1: `/lesson/fr_b1_01`
- etc.

### 3. From Dashboard
B1 lessons will appear in the lesson list alongside A1/A2 lessons.

## Lesson Structure Reference

```typescript
interface Lesson {
  lesson_id: string;           // e.g., "en_b1_01"
  language: string;            // e.g., "English"
  title: string;               // e.g., "Travel Planning"
  description: string;         // Lesson description
  level: "Beginner" | "Intermediate" | "Advanced";  // "Intermediate" for B1
  emoji: string;               // Visual icon
  lang: string;                // Language code (e.g., "en")
  category: 'Lesson';          // Always 'Lesson'
  content: LessonContent[];     // 5 vocabulary items
  quiz: QuizQuestion[];         // 2 quiz questions
  cultureCapsule?: CultureCapsule;  // Optional cultural info
}

interface LessonContent {
  word: string;                // The word/phrase
  transliteration: string;     // How to pronounce it
  meaning: string;             // English translation
  example: string;             // Example sentence
  audio: string;               // Audio file path
}

interface QuizQuestion {
  question: string;            // The question
  options: string[];           // Multiple choice options
  answer: string;              // Correct answer
}

interface CultureCapsule {
  title: string;               // Cultural topic
  icon: string;                // Emoji icon
  content: string;             // Markdown content
}
```

## Adding More B1 Lessons

To add more B1 lessons (e.g., for new languages or additional topics):

```typescript
// In constants.tsx, add to B1_LESSONS array:

{
    lesson_id: "xx_b1_02",  // Change ID for new lesson
    language: "Language Name",
    title: "New Topic",
    description: "Description of the lesson",
    level: "Intermediate",
    emoji: "🎯",
    lang: 'xx',  // Language code
    category: 'Lesson',
    content: [
        { 
            word: "word1", 
            transliteration: "pronunciation", 
            meaning: "English meaning", 
            example: "Example sentence", 
            audio: "audio/word1_xx.mp3" 
        },
        // Add 4 more vocabulary items...
    ],
    quiz: [
        { 
            question: "Question 1?", 
            options: ["option1", "option2", "option3"], 
            answer: "option1" 
        },
        { 
            question: "Question 2?", 
            options: ["option1", "option2", "option3"], 
            answer: "option2" 
        }
    ],
    cultureCapsule: {
        title: "Cultural Topic",
        icon: "🌍",
        content: "Cultural information about this topic"
    }
}
```

## Displaying B1 Lessons in Dashboard

To add a level filter to the Dashboard:

```typescript
// In Dashboard.tsx

const [selectedLevel, setSelectedLevel] = useState<'Beginner' | 'Intermediate' | null>(null);

// Filter lessons by level
const filteredLessons = selectedLevel 
  ? lessons.filter(l => l.level === selectedLevel)
  : lessons;

// Add filter buttons
<div className="flex gap-2 mb-4">
  <button 
    onClick={() => setSelectedLevel(null)}
    className={selectedLevel === null ? 'bg-blue-500' : 'bg-gray-300'}
  >
    All Levels
  </button>
  <button 
    onClick={() => setSelectedLevel('Beginner')}
    className={selectedLevel === 'Beginner' ? 'bg-blue-500' : 'bg-gray-300'}
  >
    A1/A2 (Beginner)
  </button>
  <button 
    onClick={() => setSelectedLevel('Intermediate')}
    className={selectedLevel === 'Intermediate' ? 'bg-blue-500' : 'bg-gray-300'}
  >
    B1 (Intermediate)
  </button>
</div>

// Display filtered lessons
{filteredLessons.map(lesson => (
  <ItemCard key={lesson.lesson_id} item={lesson} onSelect={() => handleLessonSelect(lesson)} />
))}
```

## Generating Audio Files

For each vocabulary word, you'll need audio files. You can:

### Option 1: Use Text-to-Speech API
```typescript
import { generateSpeech } from './services/geminiService';

// Generate audio for a word
const audioUrl = await generateSpeech(word, language);
```

### Option 2: Use Google Cloud Text-to-Speech
```typescript
const textToSpeech = require('@google-cloud/text-to-speech');

async function generateAudio(text, languageCode) {
  const client = new textToSpeech.TextToSpeechClient();
  const request = {
    input: { text: text },
    voice: { languageCode: languageCode },
    audioConfig: { audioEncoding: 'MP3' },
  };
  const [response] = await client.synthesizeSpeech(request);
  return response.audioContent;
}
```

### Option 3: Use External Service
- Google Translate API
- Azure Speech Services
- AWS Polly

## Tracking Lesson Progress

To track which lessons users have completed:

```typescript
interface UserProgress {
  userId: string;
  completedLessons: string[];  // Array of lesson_ids
  currentLesson?: string;
  lastUpdated: Date;
}

// Save progress
const saveProgress = async (userId: string, lessonId: string) => {
  const progress = await getProgress(userId);
  progress.completedLessons.push(lessonId);
  await updateProgress(userId, progress);
};

// Check if lesson is completed
const isLessonCompleted = (userId: string, lessonId: string) => {
  const progress = getProgress(userId);
  return progress.completedLessons.includes(lessonId);
};
```

## Spaced Repetition Integration

To add SRS for vocabulary retention:

```typescript
interface VocabularyProgress {
  word: string;
  lastReviewed: Date;
  nextReview: Date;
  difficulty: number;  // 0-5
  repetitions: number;
}

// After completing a lesson, add words to SRS
const addWordsToSRS = (lesson: Lesson, userId: string) => {
  lesson.content.forEach(word => {
    const srsItem: VocabularyProgress = {
      word: word.word,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),  // 1 day
      difficulty: 3,
      repetitions: 0
    };
    saveSRSItem(userId, srsItem);
  });
};
```

## Testing B1 Lessons

### Manual Testing Checklist
- [ ] Load each B1 lesson by lesson_id
- [ ] Verify all vocabulary displays correctly
- [ ] Check quiz questions work
- [ ] Verify cultural capsule displays (if present)
- [ ] Test lesson completion tracking
- [ ] Verify progress is saved

### Automated Testing
```typescript
describe('B1 Lessons', () => {
  test('All B1 lessons have required fields', () => {
    B1_LESSONS.forEach(lesson => {
      expect(lesson.lesson_id).toBeDefined();
      expect(lesson.language).toBeDefined();
      expect(lesson.level).toBe('Intermediate');
      expect(lesson.content.length).toBe(5);
      expect(lesson.quiz.length).toBe(2);
    });
  });

  test('All vocabulary items have required fields', () => {
    B1_LESSONS.forEach(lesson => {
      lesson.content.forEach(item => {
        expect(item.word).toBeDefined();
        expect(item.transliteration).toBeDefined();
        expect(item.meaning).toBeDefined();
        expect(item.example).toBeDefined();
      });
    });
  });

  test('All quiz questions are valid', () => {
    B1_LESSONS.forEach(lesson => {
      lesson.quiz.forEach(q => {
        expect(q.question).toBeDefined();
        expect(q.options.length).toBe(3);
        expect(q.options).toContain(q.answer);
      });
    });
  });
});
```

## Performance Considerations

- **Bundle Size**: B1 lessons add ~50KB to constants.tsx
- **Load Time**: Consider lazy-loading lessons if needed
- **Memory**: All lessons are loaded in memory; consider pagination for large datasets

## Future Enhancements

1. **B2/C1 Lessons** - Add advanced levels
2. **Lesson Variants** - Multiple lessons per level per language
3. **Adaptive Difficulty** - Adjust based on user performance
4. **Multimedia Content** - Add images, videos, audio
5. **Interactive Exercises** - Beyond simple quizzes
6. **Peer Review** - Community-contributed lessons
7. **Certification Prep** - Official exam preparation

## Troubleshooting

### Lesson Not Loading
```typescript
// Check if lesson exists
const lesson = LESSONS_WITH_B1.find(l => l.lesson_id === 'en_b1_01');
if (!lesson) {
  console.error('Lesson not found');
}
```

### Quiz Not Working
```typescript
// Verify quiz structure
const quiz = lesson.quiz;
quiz.forEach(q => {
  if (!q.options.includes(q.answer)) {
    console.error('Invalid quiz question:', q);
  }
});
```

### Audio Not Playing
```typescript
// Check audio file path
const audioPath = lesson.content[0].audio;
console.log('Audio path:', audioPath);
// Verify file exists at: public/audio/[filename].mp3
```

## Support

For issues or questions:
1. Check this guide
2. Review the B1_LESSONS_ADDED.md file
3. Check the lesson structure in types.ts
4. Review existing lessons in constants.tsx
