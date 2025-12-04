# ChirPolly Feature Roadmap & Implementation Guide

## Current Feature Matrix

### ✅ IMPLEMENTED FEATURES

#### Core Learning
- [x] Lessons (A1/A2 levels, 20 languages)
- [x] Conversation Scenarios (4 categories: Conversation, Career Focus, Cultural Immersion, Keigo Mastery)
- [x] Grammar Clinic (basic explanations)
- [x] Word Bank (vocabulary management)
- [x] Visual Vocabulary (image-based learning)
- [x] Kanji Lair (Japanese characters with stroke order, mnemonics, JLPT levels)

#### Practice & Feedback
- [x] Accent Training (pronunciation feedback with transcription)
- [x] AI Tutor Chat (real-time conversation with Gemini)
- [x] Quiz system (embedded in lessons)

#### Social & Community
- [x] Community Social Feed (posts, comments, likes)
- [x] Language Exchange Matching (basic)
- [x] Tutor Marketplace (profiles, booking, reviews)
- [x] Achievements & Badges
- [x] Challenges (daily, weekly, event-based)
- [x] Leaderboards (conversation, vocabulary, grammar)

#### Personalization
- [x] Persona-based Learning (4 paths: All-rounder, Traveler, Student, Professional)
- [x] Language Selection (20 languages)

#### Technical
- [x] Firebase Authentication
- [x] Firestore Database
- [x] Gemini AI Integration
- [x] PWA Support
- [x] Mobile Responsive UI

---

## 🚀 PRIORITY ROADMAP

### PHASE 1: QUICK WINS (Weeks 1-4)

#### 1.1 Expand Lesson Content to B1 Level
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Effort:** 2 weeks  
**Impact:** Addresses "limited depth" gap vs. competitors

**Tasks:**
- [ ] Create B1 lesson templates (10-15 lessons per language)
- [ ] Topics: Travel, Work, Relationships, Health, Food, Shopping, Culture
- [ ] Add B1 quizzes and culture capsules
- [ ] Update Lesson type to support multiple levels
- [ ] Add level filter to Dashboard

**Files to Modify:**
- `constants.tsx` - Add B1 lessons
- `types.ts` - Extend Lesson interface if needed
- `components/Dashboard.tsx` - Add level filter
- `components/LessonView.tsx` - Handle multiple levels

**Estimated LOC:** 500-1000 lines (mostly data)

---

#### 1.2 Implement Spaced Repetition System (SRS)
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Effort:** 1 week  
**Impact:** Increases retention, differentiates from competitors

**Tasks:**
- [ ] Add SRS fields to VocabularyWord (lastReviewed, nextReview, difficulty, repetitions)
- [ ] Implement SM-2 algorithm
- [ ] Create ReviewQueue component
- [ ] Add review scheduling UI to Word Bank
- [ ] Create retention analytics dashboard
- [ ] Add "Review Today" section to Dashboard

**Files to Modify:**
- `types.ts` - Extend VocabularyWord
- `components/WordBankView.tsx` - Add review queue
- `components/Dashboard.tsx` - Add review section
- `services/srsService.ts` - NEW (SM-2 algorithm)
- `components/ReviewQueueView.tsx` - NEW

**Estimated LOC:** 800-1200 lines

---

#### 1.3 Enable Offline Mode
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Effort:** 1 week  
**Impact:** Enables emerging market adoption

**Tasks:**
- [ ] Cache lessons, scenarios, media to IndexedDB
- [ ] Implement offline detection
- [ ] Create OfflineSyncService
- [ ] Add download manager UI
- [ ] Sync progress when online
- [ ] Show offline indicator in header

**Files to Modify:**
- `services/offlineService.ts` - NEW
- `components/Header.tsx` - Add offline indicator
- `components/Dashboard.tsx` - Add download manager
- `sw.js` - Enhance service worker
- `App.tsx` - Integrate offline detection

**Estimated LOC:** 600-1000 lines

---

#### 1.4 AI-Generated Short Stories
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Effort:** 1 week  
**Impact:** Increases engagement, differentiates from competitors

**Tasks:**
- [ ] Create story generation prompt for Gemini
- [ ] Generate 5-10 stories per language at A1/A2 levels
- [ ] Add MediaItem type for stories
- [ ] Create StoryView component with:
  - [ ] Story text with vocabulary highlighting
  - [ ] Audio narration (TTS)
  - [ ] Comprehension quiz
  - [ ] Vocabulary extraction
- [ ] Add stories to Dashboard
- [ ] Create story library view

**Files to Modify:**
- `types.ts` - Extend MediaItem
- `constants.tsx` - Add STORIES data
- `components/MediaView.tsx` - Enhance for stories
- `services/geminiService.ts` - Add story generation
- `components/StoryView.tsx` - NEW
- `components/Dashboard.tsx` - Add stories section

**Estimated LOC:** 1000-1500 lines

---

#### 1.5 Enhanced Tutor Profiles
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐ MEDIUM  
**Effort:** 3 days  
**Impact:** Leverages existing tutor marketplace

**Tasks:**
- [ ] Add specialization tags to TutorProfile (Business, JLPT, Accent Training, etc.)
- [ ] Highlight tutors for niche languages
- [ ] Add "Specialization" filter to tutor search
- [ ] Show tutor success rate for specific languages
- [ ] Add testimonials/reviews by language
- [ ] Create "Recommended Tutors" section on Dashboard

**Files to Modify:**
- `types.ts` - Extend TutorProfile
- `components/TutorView.tsx` - Add filters and recommendations
- `components/Dashboard.tsx` - Add recommended tutors

**Estimated LOC:** 300-500 lines

---

### PHASE 2: MEDIUM-TERM (Weeks 5-12)

#### 2.1 Adaptive Learning Engine
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐⭐⭐ CRITICAL  
**Effort:** 3 weeks  
**Impact:** Personalization, higher engagement

**Tasks:**
- [ ] Create UserProfile with learningStyle, performanceMetrics, weakAreas
- [ ] Implement performance tracking for all activities
- [ ] Create AdaptivePathService
- [ ] Build RecommendationEngine (ML-based)
- [ ] Adaptive quiz difficulty
- [ ] Personalized daily recommendations
- [ ] Learning velocity tracking
- [ ] Create PerformanceDashboard

**Files to Modify:**
- `types.ts` - Add UserProfile, PerformanceMetrics
- `services/adaptiveService.ts` - NEW
- `services/recommendationEngine.ts` - NEW
- `components/PerformanceDashboard.tsx` - NEW
- `components/Dashboard.tsx` - Integrate recommendations
- `App.tsx` - Track performance

**Estimated LOC:** 2000-3000 lines

---

#### 2.2 Professional & Business Language Modules
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Effort:** 2 weeks  
**Impact:** B2B opportunity, higher monetization

**Tasks:**
- [ ] Create BusinessModule type
- [ ] Add industry-specific vocabulary (Tech, Finance, Healthcare, Legal, Hospitality)
- [ ] Create business scenarios (meetings, negotiations, presentations, emails)
- [ ] Build MockInterviewView
- [ ] Add certification prep (TOEFL, DELF, DELE, JLPT)
- [ ] Create CertificationPrepView
- [ ] Add corporate licensing option

**Files to Modify:**
- `types.ts` - Add BusinessModule, CertificationPrep
- `constants.tsx` - Add business content
- `components/BusinessModuleView.tsx` - NEW
- `components/MockInterviewView.tsx` - NEW
- `components/CertificationPrepView.tsx` - NEW
- `components/Dashboard.tsx` - Add business section

**Estimated LOC:** 1500-2000 lines

---

#### 2.3 Deep Cultural Immersion Modules
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐ MEDIUM  
**Effort:** 2 weeks  
**Impact:** Engagement, differentiation

**Tasks:**
- [ ] Create CultureModule type with multimedia content
- [ ] Build 10-15 min cultural deep-dives per language
- [ ] Topics: History, Customs, Food, Traditions, Etiquette, Holidays
- [ ] Create CultureExperienceView with interactive scenarios
- [ ] Add seasonal content calendar
- [ ] Create cultural comparison features
- [ ] Add "Culture Quiz" after each module

**Files to Modify:**
- `types.ts` - Add CultureModule
- `constants.tsx` - Add culture content
- `components/CultureView.tsx` - NEW
- `components/CultureExperienceView.tsx` - NEW
- `components/Dashboard.tsx` - Add culture section

**Estimated LOC:** 1200-1800 lines

---

#### 2.4 Community-Driven Content
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐ MEDIUM  
**Effort:** 2 weeks  
**Impact:** Community engagement, user retention

**Tasks:**
- [ ] Add UserGeneratedLesson type
- [ ] Create lesson submission form
- [ ] Implement peer review system
- [ ] Add community voting on lessons
- [ ] Create translation challenges
- [ ] Build StudyGroupView
- [ ] Enhance language exchange matching algorithm
- [ ] Add group chat functionality

**Files to Modify:**
- `types.ts` - Add UserGeneratedLesson, StudyGroup
- `components/CommunityView.tsx` - Enhance with groups
- `components/StudyGroupView.tsx` - NEW
- `components/LessonSubmissionView.tsx` - NEW
- `services/communityService.ts` - NEW

**Estimated LOC:** 1500-2000 lines

---

### PHASE 3: LONG-TERM (Months 3-6)

#### 3.1 Advanced Pronunciation & Accent Reduction
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐⭐ HIGH  
**Effort:** 3 weeks  
**Impact:** Differentiation from competitors

**Tasks:**
- [ ] Create PhoneticsModule with IPA training
- [ ] Add script-specific pronunciation (Devanagari, Hiragana, Arabic, etc.)
- [ ] Build AccentComparisonView (user vs. native speaker)
- [ ] Create ToneTrainingView (for tonal languages)
- [ ] Add dialect variations (Spanish: Spain vs. Mexico vs. Argentina)
- [ ] Teach intonation patterns
- [ ] Create pronunciation mini-games

**Files to Modify:**
- `types.ts` - Add PhoneticsModule, ToneTraining
- `components/PhoneticsView.tsx` - NEW
- `components/AccentComparisonView.tsx` - NEW
- `components/ToneTrainingView.tsx` - NEW
- `components/AccentTrainingView.tsx` - Enhance
- `services/pronunciationService.ts` - NEW

**Estimated LOC:** 2000-2500 lines

---

#### 3.2 Gamification 2.0
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐ MEDIUM  
**Effort:** 2 weeks  
**Impact:** Engagement, retention

**Tasks:**
- [ ] Create seasonal events system
- [ ] Build multiplayer challenge modes
- [ ] Add streak protection feature
- [ ] Enhance leaderboards (global, regional, friends)
- [ ] Create cosmetics system (parrot skins, themes, badges)
- [ ] Build guild/clan system
- [ ] Add team competitions
- [ ] Create limited-time rewards

**Files to Modify:**
- `types.ts` - Add Event, Guild, Cosmetic
- `constants.tsx` - Add events data
- `components/EventsView.tsx` - NEW
- `components/GuildView.tsx` - NEW
- `components/MultiplayerChallengeView.tsx` - NEW
- `components/LeaderboardView.tsx` - Enhance
- `components/CosmeticsShopView.tsx` - NEW

**Estimated LOC:** 1500-2000 lines

---

#### 3.3 Immersive Content Library Expansion
**Status:** 🔴 Not Started  
**Priority:** ⭐⭐⭐ MEDIUM  
**Effort:** 3 weeks  
**Impact:** Engagement, content differentiation

**Tasks:**
- [ ] Create podcast snippet system
- [ ] Build news in simple language feature
- [ ] Add interactive comics
- [ ] Integrate YouTube with auto-generated subtitles
- [ ] Create content recommendation engine
- [ ] Add vocabulary extraction from all content
- [ ] Build content library view
- [ ] Create content-based lessons

**Files to Modify:**
- `types.ts` - Extend MediaItem
- `constants.tsx` - Add media content
- `components/ContentLibraryView.tsx` - NEW
- `components/PodcastView.tsx` - NEW
- `components/NewsView.tsx` - NEW
- `components/ComicView.tsx` - NEW
- `components/YouTubeIntegrationView.tsx` - NEW
- `services/contentService.ts` - NEW

**Estimated LOC:** 2000-2500 lines

---

## Implementation Priority Matrix

```
HIGH IMPACT + LOW EFFORT (Do First):
1. Expand Lessons to B1 ⭐⭐⭐⭐⭐
2. Spaced Repetition System ⭐⭐⭐⭐⭐
3. Enhanced Tutor Profiles ⭐⭐⭐⭐

HIGH IMPACT + MEDIUM EFFORT (Do Next):
4. Offline Mode ⭐⭐⭐⭐
5. AI-Generated Stories ⭐⭐⭐⭐
6. Adaptive Learning Engine ⭐⭐⭐⭐
7. Professional Modules ⭐⭐⭐⭐

MEDIUM IMPACT + MEDIUM EFFORT (Do After):
8. Cultural Immersion ⭐⭐⭐
9. Community Content ⭐⭐⭐
10. Advanced Pronunciation ⭐⭐⭐
11. Gamification 2.0 ⭐⭐⭐
12. Content Library ⭐⭐⭐
```

---

## Success Metrics

### Learning Outcomes
- Lessons completed per user
- Proficiency level progression (A1 → A2 → B1)
- Quiz pass rate
- Retention rate (30-day, 60-day, 90-day)

### Engagement
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Average session length
- Features used per session
- Content consumption (stories, podcasts, etc.)

### Community
- Tutor bookings per month
- Language exchange matches
- Social posts per user
- Study group participation

### Monetization
- Premium subscribers
- Tutor revenue
- Corporate licenses
- In-app purchases (cosmetics)

---

## Technology Considerations

### Frontend Enhancements
- [ ] Upgrade to React 20 (when available)
- [ ] Add Zustand for state management (optional)
- [ ] Implement React Query for data fetching
- [ ] Add Storybook for component documentation

### Backend/Services
- [ ] Create dedicated API layer (currently Firebase-only)
- [ ] Implement caching layer (Redis)
- [ ] Add analytics service
- [ ] Create ML pipeline for recommendations

### Database
- [ ] Optimize Firestore indexes
- [ ] Add data archival strategy
- [ ] Implement backup/recovery

### DevOps
- [ ] Set up CI/CD pipeline
- [ ] Add automated testing
- [ ] Implement monitoring and alerting
- [ ] Create staging environment

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Feature creep | Strict prioritization, 2-week sprints |
| Performance degradation | Regular profiling, lazy loading |
| User confusion | UX testing, onboarding improvements |
| Tutor quality | Verification process, ratings system |
| Content quality | Community review, native speaker validation |
| Scaling issues | Database optimization, CDN for media |

---

## Conclusion

**Phase 1 (Weeks 1-4)** focuses on quick wins that directly address competitor gaps:
- Expand content depth (B1 lessons)
- Improve retention (SRS)
- Enable offline use
- Increase engagement (stories)

**Phase 2 (Weeks 5-12)** builds on Phase 1 with personalization and specialization:
- Adaptive learning
- Professional modules
- Cultural immersion
- Community features

**Phase 3 (Months 3-6)** creates long-term differentiation:
- Advanced pronunciation
- Gamification 2.0
- Immersive content

This roadmap positions ChirPolly as a **specialized, personalized, community-driven** alternative to Duolingo, Babbel, and Speak.
