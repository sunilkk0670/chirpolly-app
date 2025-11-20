import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { ACHIEVEMENT_BADGES, CHALLENGES } from '../constants';
import type { Challenge, AchievementBadge } from '../types';

interface UserProgress {
    lessonsCompleted: number;
    quizzesPassed: number;
    dailyStreak: number;
    languagesStudied: Set<string>;
    grammarClinicUsed: number;
    lastLessonDates: string[]; // For weekly tracking
}

interface BadgeProgress {
    badge: AchievementBadge;
    isUnlocked: boolean;
    progress: number; // 0-100
    currentValue: number;
    targetValue: number;
}

const BadgeCard: React.FC<{ badgeProgress: BadgeProgress }> = ({ badgeProgress }) => {
    const { badge, isUnlocked, progress, currentValue, targetValue } = badgeProgress;

    return (
        <div className={`relative bg-white/70 backdrop-blur-lg border border-white/30 p-5 rounded-xl shadow-lg text-center flex flex-col items-center transform hover:-translate-y-1 transition-all duration-300 ${!isUnlocked && 'opacity-60 grayscale'}`}>
            {!isUnlocked && (
                <div className="absolute top-3 right-3 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
            <div className={`text-5xl mb-3 ${!isUnlocked && 'filter blur-sm'}`}>{badge.icon}</div>
            <h3 className="text-md font-bold text-slate-800">{badge.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{badge.description}</p>

            {/* Progress Bar */}
            <div className="w-full mt-3">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>{currentValue}/{targetValue}</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-gradient-to-r from-teal-400 to-emerald-500' : 'bg-slate-400'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {isUnlocked && (
                <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        ✓ Unlocked
                    </span>
                </div>
            )}
        </div>
    );
};

const FeaturedChallengeCard: React.FC = () => {
    const [challenge, setChallenge] = useState<Challenge | null>(null);

    useEffect(() => {
        // Pick a random challenge when the component mounts
        setChallenge(CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]);
    }, []);

    if (!challenge) return null;

    return (
        <div className="bg-gradient-to-r from-cyan-400 to-emerald-500 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </div>
            <div className="flex items-center gap-x-4 relative z-10">
                <div className="bg-white/30 p-3 rounded-full text-3xl">
                    {challenge.icon}
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold font-poppins text-lg">Featured Challenge</h3>
                    <p className="font-semibold">{challenge.title}</p>
                    <p className="text-sm mt-1">{challenge.description}</p>
                    <p className="text-sm mt-2 font-bold bg-white/20 px-2 py-1 rounded-full inline-block">Reward: {challenge.reward}</p>
                </div>
            </div>
        </div>
    );
};

export const AchievementsView: React.FC = () => {
    const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
    const [userProgress, setUserProgress] = useState<UserProgress>({
        lessonsCompleted: 0,
        quizzesPassed: 0,
        dailyStreak: 0,
        languagesStudied: new Set<string>(),
        grammarClinicUsed: 0,
        lastLessonDates: []
    });

    useEffect(() => {
        // Load user progress from localStorage
        const loadUserProgress = () => {
            try {
                const userId = auth.currentUser?.uid || 'guest';

                // Aggregate progress from various localStorage keys
                const lessonsCompleted = Object.keys(localStorage).filter(k => k.startsWith('chirpolly-progress-')).reduce((acc, key) => {
                    const progress = JSON.parse(localStorage.getItem(key) || '[]');
                    return acc + progress.length;
                }, 0);

                // For demo purposes, let's use some realistic test data
                // In production, this would fetch from Firestore
                const progress: UserProgress = {
                    lessonsCompleted: lessonsCompleted,
                    quizzesPassed: Math.floor(lessonsCompleted * 0.8), // Assume 80% pass rate
                    dailyStreak: parseInt(localStorage.getItem(`chirpolly-${userId}-streak`) || '0'),
                    languagesStudied: new Set(Object.keys(localStorage).filter(k => k.startsWith('chirpolly-progress-')).map(k => k.split('-').pop() || '')),
                    grammarClinicUsed: parseInt(localStorage.getItem(`chirpolly-${userId}-grammar-uses`) || '0'),
                    lastLessonDates: JSON.parse(localStorage.getItem(`chirpolly-${userId}-lesson-dates`) || '[]')
                };

                setUserProgress(progress);

                // Calculate badge progress
                const badgesWithProgress: BadgeProgress[] = ACHIEVEMENT_BADGES.map(badge => {
                    let currentValue = 0;
                    let targetValue = 0;
                    let isUnlocked = false;

                    switch (badge.badge_id) {
                        case 'b001': // Feathered Fluent - Complete 5 lessons in one week
                            targetValue = 5;
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            currentValue = progress.lastLessonDates.filter(date => new Date(date) > weekAgo).length;
                            isUnlocked = currentValue >= targetValue;
                            break;

                        case 'b002': // Chirpy Beginner - Finish your first language lesson
                            targetValue = 1;
                            currentValue = Math.min(progress.lessonsCompleted, 1);
                            isUnlocked = progress.lessonsCompleted >= 1;
                            break;

                        case 'b003': // Daily Song - Practice for 7 days in a row
                            targetValue = 7;
                            currentValue = progress.dailyStreak;
                            isUnlocked = progress.dailyStreak >= 7;
                            break;

                        case 'b004': // Polly's Favorite - Score 90% or more on a quiz
                            targetValue = 1;
                            currentValue = progress.quizzesPassed >= 1 ? 1 : 0;
                            isUnlocked = progress.quizzesPassed >= 1;
                            break;

                        case 'b005': // Polyglot Parrot - Try lessons in 3 different languages
                            targetValue = 3;
                            currentValue = progress.languagesStudied.size;
                            isUnlocked = progress.languagesStudied.size >= 3;
                            break;

                        case 'b006': // Grammar Guru - Use the Grammar Clinic 10 times
                            targetValue = 10;
                            currentValue = progress.grammarClinicUsed;
                            isUnlocked = progress.grammarClinicUsed >= 10;
                            break;
                    }

                    return {
                        badge,
                        isUnlocked,
                        progress: Math.min(Math.round((currentValue / targetValue) * 100), 100),
                        currentValue,
                        targetValue
                    };
                });

                setBadgeProgress(badgesWithProgress);
            } catch (error) {
                console.error('Error loading user progress:', error);
            }
        };

        loadUserProgress();
    }, []);

    const unlockedCount = badgeProgress.filter(b => b.isUnlocked).length;
    const totalBadges = badgeProgress.length;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl font-poppins">
                    Achievements & Challenges
                </h1>
                <p className="mt-2 text-lg text-slate-600">Stay motivated on your language journey!</p>

                {/* Progress Summary */}
                <div className="mt-4 flex items-center gap-x-4">
                    <div className="bg-gradient-to-r from-teal-100 to-emerald-100 px-4 py-2 rounded-lg border border-teal-200">
                        <span className="text-sm font-semibold text-teal-800">
                            🏆 {unlockedCount}/{totalBadges} Badges Earned
                        </span>
                    </div>
                    {userProgress.dailyStreak > 0 && (
                        <div className="bg-gradient-to-r from-orange-100 to-rose-100 px-4 py-2 rounded-lg border border-orange-200">
                            <span className="text-sm font-semibold text-orange-800">
                                🔥 {userProgress.dailyStreak} Day Streak
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-10">
                <FeaturedChallengeCard />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-700 font-poppins mb-4">Your Badge Collection</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {badgeProgress.map(bp => (
                        <BadgeCard key={bp.badge.badge_id} badgeProgress={bp} />
                    ))}
                </div>
            </div>

            {/* Tips Section */}
            {unlockedCount < totalBadges && (
                <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Tips to Unlock More Badges</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        {!badgeProgress.find(b => b.badge.badge_id === 'b003')?.isUnlocked && (
                            <li>• Practice daily to build your streak!</li>
                        )}
                        {!badgeProgress.find(b => b.badge.badge_id === 'b005')?.isUnlocked && (
                            <li>• Try exploring different languages from the Languages page</li>
                        )}
                        {!badgeProgress.find(b => b.badge.badge_id === 'b006')?.isUnlocked && (
                            <li>• Visit the Grammar Clinic to improve your writing skills</li>
                        )}
                        {!badgeProgress.find(b => b.badge.badge_id === 'b001')?.isUnlocked && (
                            <li>• Complete lessons regularly to earn the weekly badge</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};