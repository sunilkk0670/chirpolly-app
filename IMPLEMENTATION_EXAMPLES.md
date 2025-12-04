# ChirPolly: Implementation Examples & Code Snippets

## 1. Spaced Repetition System (SRS) - SM-2 Algorithm

### Type Definitions (types.ts)

```typescript
export interface VocabularyWord {
  word: string;
  transliteration: string;
  meaning: string;
  audio_prompt: string;
  // SRS fields
  lastReviewed?: Date;
  nextReview?: Date;
  difficulty: number; // 0-5 (0=easy, 5=hard)
  repetitions: number; // Number of times reviewed
  interval: number; // Days until next review
  easeFactor: number; // SM-2 ease factor (default 2.5)
}

export interface ReviewItem {
  word: VocabularyWord;
  quality: number; // 0-5 (user's rating of their recall)
  reviewedAt: Date;
}
```

### SRS Service (services/srsService.ts)

```typescript
// SM-2 Algorithm Implementation
export class SRSService {
  private static readonly MIN_EASE = 1.3;
  private static readonly DEFAULT_EASE = 2.5;

  /**
   * Calculate next review date using SM-2 algorithm
   * @param quality - User's rating (0-5): 0=complete blackout, 5=perfect response
   * @param repetitions - Number of times reviewed
   * @param interval - Current interval in days
   * @param easeFactor - Current ease factor
   */
  static calculateNextReview(
    quality: number,
    repetitions: number,
    interval: number,
    easeFactor: number
  ): {
    nextInterval: number;
    newEaseFactor: number;
    nextReviewDate: Date;
  } {
    let newEaseFactor = easeFactor;
    let newInterval = interval;

    // Update ease factor
    newEaseFactor = Math.max(
      this.MIN_EASE,
      easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    );

    // Calculate new interval
    if (quality < 3) {
      // Failed - reset
      newInterval = 1;
    } else if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 3;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    return {
      nextInterval: newInterval,
      newEaseFactor,
      nextReviewDate,
    };
  }

  /**
   * Get words due for review today
   */
  static getReviewQueue(words: VocabularyWord[]): VocabularyWord[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return words.filter((word) => {
      if (!word.nextReview) return true; // New word
      const reviewDate = new Date(word.nextReview);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate <= today;
    });
  }

  /**
   * Get statistics for user
   */
  static getStats(words: VocabularyWord[]) {
    const today = new Date();
    const dueToday = this.getReviewQueue(words).length;
    const learned = words.filter((w) => w.repetitions >= 3).length;
    const retention = words.length > 0 ? (learned / words.length) * 100 : 0;

    return {
      totalWords: words.length,
      dueToday,
      learned,
      retention: retention.toFixed(1),
    };
  }
}
```

### Review Component (components/ReviewQueueView.tsx)

```typescript
import React, { useState, useEffect } from 'react';
import { VocabularyWord } from '../types';
import { SRSService } from '../services/srsService';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';

export const ReviewQueueView: React.FC<{
  words: VocabularyWord[];
  onReviewComplete: (updatedWords: VocabularyWord[]) => void;
}> = ({ words, onReviewComplete }) => {
  const [queue, setQueue] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [updatedWords, setUpdatedWords] = useState<VocabularyWord[]>([]);

  useEffect(() => {
    const reviewQueue = SRSService.getReviewQueue(words);
    setQueue(reviewQueue);
  }, [words]);

  const handleRate = (quality: number) => {
    if (currentIndex >= queue.length) return;

    const word = queue[currentIndex];
    const { nextInterval, newEaseFactor, nextReviewDate } =
      SRSService.calculateNextReview(
        quality,
        word.repetitions || 0,
        word.interval || 1,
        word.easeFactor || SRSService['DEFAULT_EASE']
      );

    const updatedWord: VocabularyWord = {
      ...word,
      lastReviewed: new Date(),
      nextReview: nextReviewDate,
      difficulty: 5 - quality,
      repetitions: (word.repetitions || 0) + 1,
      interval: nextInterval,
      easeFactor: newEaseFactor,
    };

    setUpdatedWords([...updatedWords, updatedWord]);
    setShowAnswer(false);

    if (currentIndex + 1 >= queue.length) {
      // Review complete
      onReviewComplete([
        ...words.filter((w) => !queue.includes(w)),
        ...updatedWords,
        updatedWord,
      ]);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (queue.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-slate-600">No words to review today! 🎉</p>
      </div>
    );
  }

  const current = queue[currentIndex];
  const progress = ((currentIndex + 1) / queue.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-slate-600">
            {currentIndex + 1} / {queue.length}
          </span>
          <span className="text-sm font-semibold text-slate-600">
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-rose-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-slate-600 mb-4">Remember this word?</p>
        <div className="text-4xl font-bold text-slate-800 mb-6">
          {current.word}
        </div>
        <p className="text-lg text-slate-600 mb-4">{current.transliteration}</p>

        {!showAnswer ? (
          <Button
            onClick={() => setShowAnswer(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Reveal Answer
          </Button>
        ) : (
          <div>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-lg text-slate-800 font-semibold">
                {current.meaning}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => handleRate(1)}
                className="bg-red-500 hover:bg-red-600"
              >
                ❌ Hard
              </Button>
              <Button
                onClick={() => handleRate(3)}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                😐 OK
              </Button>
              <Button
                onClick={() => handleRate(5)}
                className="bg-green-500 hover:bg-green-600"
              >
                ✅ Easy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 2. AI-Generated Stories

### Story Generation Service (services/storyService.ts)

```typescript
import { generateContent } from './geminiService';

export interface Story {
  id: string;
  language: string;
  level: 'A1' | 'A2' | 'B1';
  title: string;
  content: string;
  audioUrl?: string;
  vocabulary: Array<{
    word: string;
    meaning: string;
    transliteration: string;
  }>;
  comprehensionQuestions: Array<{
    question: string;
    options: string[];
    answer: string;
  }>;
}

export async function generateStory(
  language: string,
  level: 'A1' | 'A2' | 'B1',
  topic: string
): Promise<Story> {
  const prompt = `
Create a short story in ${language} at ${level} level about "${topic}".

Requirements:
- Length: 150-200 words
- Use simple, common vocabulary
- Include 10-15 new vocabulary words
- Make it engaging and relatable
- Format as JSON with:
  {
    "title": "Story title",
    "content": "Story text",
    "vocabulary": [
      {"word": "...", "meaning": "...", "transliteration": "..."}
    ],
    "comprehensionQuestions": [
      {"question": "...", "options": ["...", "...", "..."], "answer": "..."}
    ]
  }
`;

  const response = await generateContent(prompt);
  const storyData = JSON.parse(response);

  return {
    id: `story_${Date.now()}`,
    language,
    level,
    ...storyData,
  };
}

export async function generateStoryAudio(
  storyText: string,
  language: string
): Promise<string> {
  // Use text-to-speech API
  // Return audio URL
  return `audio_url_${Date.now()}`;
}
```

### Story View Component (components/StoryView.tsx)

```typescript
import React, { useState, useEffect } from 'react';
import { Story } from '../services/storyService';
import { Button } from './common/Button';
import { SpeakerWaveIcon } from './icons/Icons';

export const StoryView: React.FC<{ story: Story }> = ({ story }) => {
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const handleWordClick = (word: string) => {
    setHighlightedWord(word);
  };

  const getWordDefinition = (word: string) => {
    return story.vocabulary.find(
      (v) => v.word.toLowerCase() === word.toLowerCase()
    );
  };

  const renderStoryWithHighlights = () => {
    const words = story.content.split(/\s+/);
    return (
      <div className="space-y-4">
        <p className="text-lg leading-relaxed text-slate-800">
          {words.map((word, idx) => {
            const cleanWord = word.replace(/[.,!?;:]/g, '');
            const definition = getWordDefinition(cleanWord);

            return (
              <span
                key={idx}
                onClick={() => handleWordClick(cleanWord)}
                className={`cursor-pointer transition-colors ${
                  definition
                    ? 'underline decoration-rose-300 hover:bg-rose-100'
                    : ''
                } ${highlightedWord === cleanWord ? 'bg-rose-200' : ''}`}
              >
                {word}{' '}
              </span>
            );
          })}
        </p>

        {highlightedWord && getWordDefinition(highlightedWord) && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="font-semibold text-slate-800">{highlightedWord}</p>
            <p className="text-slate-600">
              {getWordDefinition(highlightedWord)?.meaning}
            </p>
            <p className="text-sm text-slate-500">
              {getWordDefinition(highlightedWord)?.transliteration}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{story.title}</h1>
            <p className="text-slate-600">Level: {story.level}</p>
          </div>
          {story.audioUrl && (
            <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
              <SpeakerWaveIcon className="w-5 h-5" />
              Listen
            </Button>
          )}
        </div>

        {!showQuiz ? (
          <>
            {renderStoryWithHighlights()}

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Button
                onClick={() => setShowQuiz(true)}
                className="bg-rose-500 hover:bg-rose-600"
              >
                Take Quiz
              </Button>
              <Button className="bg-slate-300 hover:bg-slate-400">
                Add to Word Bank
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {story.comprehensionQuestions.map((q, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                <p className="font-semibold text-slate-800 mb-3">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={option}
                        onChange={(e) =>
                          setQuizAnswers({
                            ...quizAnswers,
                            [idx]: e.target.value,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <Button className="w-full bg-green-500 hover:bg-green-600">
              Submit Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 3. Adaptive Learning Engine

### Adaptive Service (services/adaptiveService.ts)

```typescript
import { VocabularyWord, Lesson } from '../types';

export interface UserPerformance {
  userId: string;
  lessonId: string;
  quizScore: number; // 0-100
  timeSpent: number; // seconds
  completedAt: Date;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LearningProfile {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  preferredFeatures: string[]; // e.g., ['scenarios', 'word_bank', 'accent_training']
  weakAreas: string[]; // e.g., ['grammar', 'pronunciation']
  strongAreas: string[];
  averageQuizScore: number;
  learningVelocity: number; // lessons per week
}

export class AdaptiveService {
  /**
   * Determine if user should skip a lesson
   */
  static shouldSkipLesson(
    performance: UserPerformance[],
    lessonId: string
  ): boolean {
    const recentScores = performance
      .filter((p) => p.lessonId === lessonId)
      .slice(-3)
      .map((p) => p.quizScore);

    if (recentScores.length === 0) return false;

    const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    return avgScore >= 90; // Skip if consistently scoring >90%
  }

  /**
   * Recommend remedial content
   */
  static getRemedialContent(
    performance: UserPerformance[],
    allLessons: Lesson[]
  ): Lesson[] {
    const weakLessons = performance
      .filter((p) => p.quizScore < 60)
      .map((p) => p.lessonId);

    return allLessons.filter((l) => weakLessons.includes(l.lesson_id));
  }

  /**
   * Detect learning style from feature usage
   */
  static detectLearningStyle(featureUsage: Record<string, number>): string {
    const styles = {
      visual: featureUsage['visual_vocab'] || 0 + featureUsage['kanji_lair'] || 0,
      auditory: featureUsage['accent_training'] || 0 + featureUsage['ai_tutor'] || 0,
      kinesthetic: featureUsage['scenarios'] || 0 + featureUsage['challenges'] || 0,
      reading: featureUsage['word_bank'] || 0 + featureUsage['grammar'] || 0,
    };

    return Object.entries(styles).sort(([, a], [, b]) => b - a)[0][0];
  }

  /**
   * Generate personalized daily recommendations
   */
  static getRecommendations(
    profile: LearningProfile,
    performance: UserPerformance[],
    allLessons: Lesson[]
  ): {
    lesson?: Lesson;
    feature: string;
    reason: string;
  }[] {
    const recommendations = [];

    // Recommend weak area practice
    if (profile.weakAreas.length > 0) {
      const weakArea = profile.weakAreas[0];
      recommendations.push({
        feature: weakArea,
        reason: `You need practice with ${weakArea}`,
      });
    }

    // Recommend based on learning style
    const styleFeatures = {
      visual: 'visual_vocab',
      auditory: 'accent_training',
      kinesthetic: 'scenarios',
      reading: 'word_bank',
    };

    recommendations.push({
      feature: styleFeatures[profile.learningStyle as keyof typeof styleFeatures],
      reason: `Based on your ${profile.learningStyle} learning style`,
    });

    // Recommend next lesson
    const nextLesson = allLessons.find(
      (l) => !performance.some((p) => p.lessonId === l.lesson_id)
    );

    if (nextLesson) {
      recommendations.push({
        lesson: nextLesson,
        feature: 'lesson',
        reason: 'Continue your learning journey',
      });
    }

    return recommendations;
  }

  /**
   * Calculate adaptive quiz difficulty
   */
  static getAdaptiveQuizDifficulty(
    performance: UserPerformance[]
  ): 'easy' | 'medium' | 'hard' {
    if (performance.length === 0) return 'medium';

    const recentScores = performance.slice(-5).map((p) => p.quizScore);
    const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

    if (avgScore >= 80) return 'hard';
    if (avgScore >= 60) return 'medium';
    return 'easy';
  }
}
```

---

## 4. Offline Mode Implementation

### Offline Service (services/offlineService.ts)

```typescript
import { Lesson, Scenario } from '../types';

export class OfflineService {
  private static readonly DB_NAME = 'ChirPolly';
  private static readonly STORE_NAMES = {
    lessons: 'lessons',
    scenarios: 'scenarios',
    media: 'media',
    progress: 'progress',
  };

  /**
   * Initialize IndexedDB
   */
  static async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        Object.values(this.STORE_NAMES).forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };
    });
  }

  /**
   * Save lessons for offline use
   */
  static async saveLessonsOffline(lessons: Lesson[]): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction(
      [this.STORE_NAMES.lessons],
      'readwrite'
    );
    const store = transaction.objectStore(this.STORE_NAMES.lessons);

    lessons.forEach((lesson) => {
      store.put(lesson);
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Get offline lessons
   */
  static async getLessonsOffline(): Promise<Lesson[]> {
    const db = await this.initDB();
    const transaction = db.transaction(
      [this.STORE_NAMES.lessons],
      'readonly'
    );
    const store = transaction.objectStore(this.STORE_NAMES.lessons);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Check if online
   */
  static isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Sync progress when online
   */
  static async syncProgress(
    userId: string,
    progressData: any
  ): Promise<void> {
    if (!this.isOnline()) {
      // Store locally for later sync
      localStorage.setItem(`pending_sync_${userId}`, JSON.stringify(progressData));
      return;
    }

    // Sync to Firebase
    // Implementation depends on your Firebase setup
  }
}
```

### Offline Indicator Component (components/OfflineIndicator.tsx)

```typescript
import React, { useState, useEffect } from 'react';
import { OfflineService } from '../services/offlineService';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-sm text-yellow-800">
      📡 You're offline. Your progress will sync when you're back online.
    </div>
  );
};
```

---

## 5. Professional Modules

### Business Module Types (types.ts extension)

```typescript
export interface BusinessModule {
  id: string;
  language: string;
  title: string;
  description: string;
  industry: 'tech' | 'finance' | 'healthcare' | 'legal' | 'hospitality';
  level: 'B1' | 'B2' | 'C1';
  topics: BusinessTopic[];
  certification?: string; // e.g., "TOEFL", "DELF"
}

export interface BusinessTopic {
  id: string;
  title: string;
  vocabulary: VocabularyWord[];
  scenarios: Scenario[];
  emailTemplates: EmailTemplate[];
  presentations: PresentationGuide[];
}

export interface EmailTemplate {
  id: string;
  subject: string;
  context: string;
  template: string;
  vocabulary: VocabularyWord[];
}

export interface PresentationGuide {
  id: string;
  title: string;
  structure: string[];
  phrases: PhraseCategory[];
  tips: string[];
}
```

### Business Module View (components/BusinessModuleView.tsx)

```typescript
import React, { useState } from 'react';
import { BusinessModule, BusinessTopic } from '../types';
import { Button } from './common/Button';

export const BusinessModuleView: React.FC<{ module: BusinessModule }> = ({
  module,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<BusinessTopic | null>(null);
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'emails' | 'presentations'>(
    'vocabulary'
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">{module.title}</h1>
        <p className="text-slate-600 mt-2">{module.description}</p>
        <div className="flex gap-2 mt-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {module.industry}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {module.level}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Topics Sidebar */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Topics</h2>
          <div className="space-y-2">
            {module.topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedTopic?.id === topic.id
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2">
          {selectedTopic ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                {selectedTopic.title}
              </h2>

              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b border-slate-200">
                {['vocabulary', 'emails', 'presentations'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() =>
                      setActiveTab(
                        tab as 'vocabulary' | 'emails' | 'presentations'
                      )
                    }
                    className={`px-4 py-2 font-semibold transition-colors ${
                      activeTab === tab
                        ? 'text-rose-500 border-b-2 border-rose-500'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'vocabulary' && (
                <div className="space-y-3">
                  {selectedTopic.vocabulary.map((word) => (
                    <div
                      key={word.word}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <p className="font-semibold text-slate-800">
                        {word.word}
                      </p>
                      <p className="text-sm text-slate-600">{word.meaning}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'emails' && (
                <div className="space-y-4">
                  {selectedTopic.emailTemplates.map((email) => (
                    <div
                      key={email.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <p className="font-semibold text-slate-800">
                        {email.subject}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {email.context}
                      </p>
                      <pre className="mt-3 p-3 bg-white rounded border border-slate-200 text-xs overflow-x-auto">
                        {email.template}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'presentations' && (
                <div className="space-y-4">
                  {selectedTopic.presentations.map((presentation) => (
                    <div
                      key={presentation.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <p className="font-semibold text-slate-800">
                        {presentation.title}
                      </p>
                      <div className="mt-3 space-y-2">
                        {presentation.structure.map((step, idx) => (
                          <p key={idx} className="text-sm text-slate-700">
                            {idx + 1}. {step}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">Select a topic to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## Summary

These implementation examples show how to add:

1. **Spaced Repetition** - SM-2 algorithm with review scheduling
2. **AI Stories** - Generated content with vocabulary highlighting
3. **Adaptive Learning** - Personalized recommendations and difficulty
4. **Offline Mode** - IndexedDB caching and sync
5. **Professional Modules** - Business language with industry focus

Each example includes:
- Type definitions
- Service/business logic
- React components
- Integration points

Start with **Phase 1 features** (SRS, B1 lessons, offline mode) for maximum impact with moderate effort.
