import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { getAWSIcon } from '@/components/aws-icons';
import { domains, type Flashcard, type CardProgress, type Domain } from '@/data';

// IndexedDB Setup
const DB_NAME = 'SAA_Flashcards';
const DB_VERSION = 1;
const STORE_NAME = 'cardProgress';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const saveProgress = async (cardId: string, data: Omit<CardProgress, 'id'>) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put({ id: cardId, ...data });
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

const getProgress = async (cardId: string): Promise<CardProgress> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve) => {
      const request = store.get(cardId);
      request.onsuccess = () => resolve(request.result || { id: cardId, correct: 0, incorrect: 0, lastReview: null, difficulty: 0 });
      request.onerror = () => resolve({ id: cardId, correct: 0, incorrect: 0, lastReview: null, difficulty: 0 });
    });
  } catch (error) {
    console.error('Failed to get progress:', error);
    return { id: cardId, correct: 0, incorrect: 0, lastReview: null, difficulty: 0 };
  }
};

const getAllProgress = async (): Promise<CardProgress[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([]);
    });
  } catch (error) {
    console.error('Failed to get all progress:', error);
    return [];
  }
};

// Main App Component
export default function SAAFlashcardApp() {
  const [view, setView] = useState<'packs' | 'tasks' | 'study'>('packs');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [stats, setStats] = useState({ total: 0, correct: 0, incorrect: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<string>>(new Set(['fundamental', 'application', 'advanced']));
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['flashcard', 'multiple-choice', 'scenario', 'code-analysis', 'concept']));
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);

  // Refs to prevent infinite loops
  const initialLoadDone = useRef(false);
  const prevTaskId = useRef<string | null>(null);

  // Get cards for the selected task
  const selectedTask = selectedDomain?.tasks.find(t => t.id === selectedTaskId);
  const allCards = selectedTask?.cards || [];
  
  // Filter cards based on selected filters
  const filteredCards = allCards.filter(card => {
    const difficultyMatch = selectedDifficulties.has(card.difficulty);
    const typeMatch = selectedTypes.has(card.type);
    const topicMatch = selectedTopics.size === 0 || selectedTopics.has(card.topic);
    return difficultyMatch && typeMatch && topicMatch;
  });
  
  // Ensure currentCardIndex is valid for filtered cards
  const validCurrentIndex = filteredCards.length > 0 
    ? Math.min(currentCardIndex, filteredCards.length - 1)
    : 0;
  
  const currentCard = filteredCards[validCurrentIndex];

  // Update available topics when task changes
  useEffect(() => {
    if (allCards.length > 0) {
      const topics = [...new Set(allCards.map(card => card.topic))];
      setAvailableTopics(topics);
      // Select all topics by default
      setSelectedTopics(new Set(topics));
    } else {
      setAvailableTopics([]);
      setSelectedTopics(new Set());
    }
  }, [selectedTaskId, allCards.length]); // Only depend on taskId and cards length

  // Reset filters when task changes
  useEffect(() => {
    if (prevTaskId.current !== selectedTaskId) {
      setSelectedDifficulties(new Set(['fundamental', 'application', 'advanced']));
      setSelectedTypes(new Set(['flashcard', 'multiple-choice', 'scenario', 'code-analysis', 'concept']));
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
      prevTaskId.current = selectedTaskId;
    }
  }, [selectedTaskId]);

  // PWA Install Prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (initialLoadDone.current) return;
      
      setIsLoading(true);
      try {
        const allProgress = await getAllProgress();
        const progressMap: Record<string, CardProgress> = {};
        allProgress.forEach(p => {
          progressMap[p.id] = p;
        });
        setProgress(progressMap);
        
        // Calculate initial stats
        const total = allProgress.reduce((sum, p) => sum + p.correct + p.incorrect, 0);
        const correct = allProgress.reduce((sum, p) => sum + p.correct, 0);
        const incorrect = allProgress.reduce((sum, p) => sum + p.incorrect, 0);
        setStats({ total, correct, incorrect });
        
        initialLoadDone.current = true;
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, []); // Empty dependency array - only run once

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
    }

    setDeferredPrompt(null);
  };

  // Get all cards for a domain (across all tasks)
  const getDomainCards = useCallback((domain: Domain): Flashcard[] => {
    return domain.tasks.flatMap(t => t.cards);
  }, []);

  const selectDomain = useCallback((domain: Domain) => {
    setSelectedDomain(domain);
    setView('tasks');
  }, []);

  const startTask = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setView('study');
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  const backToPacks = useCallback(() => {
    setView('packs');
    setSelectedDomain(null);
    setSelectedTaskId(null);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  const backToTasks = useCallback(() => {
    setView('tasks');
    setSelectedTaskId(null);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  const handleCardFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const updateStatsAndProgress = useCallback((isCorrect: boolean) => {
    setStats(prev => ({
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1
    }));
  }, []);

  const handleKnowIt = useCallback(async () => {
    if (!currentCard) return;
    
    try {
      const cardProgress = await getProgress(currentCard.id);
      const newProgress = {
        ...cardProgress,
        correct: cardProgress.correct + 1,
        lastReview: new Date().toISOString(),
        difficulty: Math.max(0, cardProgress.difficulty - 1)
      };
      await saveProgress(currentCard.id, newProgress);

      setProgress(prev => ({ ...prev, [currentCard.id]: newProgress }));
      updateStatsAndProgress(true);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }

    nextCard();
  }, [currentCard, updateStatsAndProgress]);

  const handleLearning = useCallback(async () => {
    if (!currentCard) return;
    
    try {
      const cardProgress = await getProgress(currentCard.id);
      const newProgress = {
        ...cardProgress,
        incorrect: cardProgress.incorrect + 1,
        lastReview: new Date().toISOString(),
        difficulty: cardProgress.difficulty + 1
      };
      await saveProgress(currentCard.id, newProgress);

      setProgress(prev => ({ ...prev, [currentCard.id]: newProgress }));
      updateStatsAndProgress(false);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }

    nextCard();
  }, [currentCard, updateStatsAndProgress]);

  const handleMultipleChoice = useCallback(async (optionIndex: number) => {
    if (!currentCard || showExplanation) return;
    
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    const isCorrect = optionIndex === currentCard.correctAnswer;
    
    try {
      const cardProgress = await getProgress(currentCard.id);
      const newProgress = {
        ...cardProgress,
        correct: isCorrect ? cardProgress.correct + 1 : cardProgress.correct,
        incorrect: isCorrect ? cardProgress.incorrect : cardProgress.incorrect + 1,
        lastReview: new Date().toISOString(),
        difficulty: isCorrect ? Math.max(0, cardProgress.difficulty - 1) : cardProgress.difficulty + 1
      };
      await saveProgress(currentCard.id, newProgress);

      setProgress(prev => ({ ...prev, [currentCard.id]: newProgress }));
      updateStatsAndProgress(isCorrect);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [currentCard, showExplanation, updateStatsAndProgress]);

  const nextCard = useCallback(() => {
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    if (filteredCards.length === 0) return;
    
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Loop back to start
      setCurrentCardIndex(0);
    }
  }, [currentCardIndex, filteredCards.length]);

  const previousCard = useCallback(() => {
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    if (filteredCards.length === 0) return;
    
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    } else {
      // Go to last card
      setCurrentCardIndex(filteredCards.length - 1);
    }
  }, [currentCardIndex, filteredCards.length]);

  const toggleDifficulty = useCallback((difficulty: string) => {
    setSelectedDifficulties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(difficulty)) {
        // Prevent deselecting all difficulties
        if (newSet.size > 1) {
          newSet.delete(difficulty);
        }
      } else {
        newSet.add(difficulty);
      }
      return newSet;
    });
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  const toggleType = useCallback((type: string) => {
    setSelectedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        // Prevent deselecting all types
        if (newSet.size > 1) {
          newSet.delete(type);
        }
      } else {
        newSet.add(type);
      }
      return newSet;
    });
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      return newSet;
    });
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  const selectAllTopics = useCallback(() => {
    setSelectedTopics(new Set(availableTopics));
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [availableTopics]);

  const clearAllTopics = useCallback(() => {
    // Don't clear if no topics selected (keep at least one for UX)
    if (availableTopics.length > 0) {
      setSelectedTopics(new Set());
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  }, [availableTopics]);

  const resetFilters = useCallback(() => {
    setSelectedDifficulties(new Set(['fundamental', 'application', 'advanced']));
    setSelectedTypes(new Set(['flashcard', 'multiple-choice', 'scenario', 'code-analysis', 'concept']));
    setSelectedTopics(new Set(availableTopics));
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [availableTopics]);

  const cardProgress = currentCard 
    ? progress[currentCard.id] || { correct: 0, incorrect: 0 }
    : { correct: 0, incorrect: 0 };
    
  const masteryLevel = cardProgress.correct > 0
    ? Math.min(100, (cardProgress.correct / (cardProgress.correct + cardProgress.incorrect)) * 100)
    : 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        }

        .pack-card {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pack-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.15);
        }

        .study-card {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .flip-card {
          perspective: 1000px;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {view === 'packs' && (
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  AWS SAA-C03
                </h1>
                <p className="text-gray-600 text-lg">Solutions Architect Associate</p>
                <p className="text-sm text-gray-500 mt-1">Organized by exam domains • Build confidence progressively</p>
              </div>
              {showInstallButton && (
                <Button
                  onClick={handleInstallClick}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Install App
                </Button>
              )}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500 mt-1">Cards Reviewed</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
              <div className="text-sm text-gray-500 mt-1">Correct</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-indigo-600">
                {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Accuracy</div>
            </div>
          </div>

          {/* Packs Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Exam Domains</h2>
              <p className="text-sm text-gray-500">Click to see tasks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domains.map(domain => {
                const domainCards = getDomainCards(domain);
                const domainProgress = domainCards.reduce((acc, card) => {
                  const cardProg = progress[card.id] || { correct: 0, incorrect: 0 };
                  if (cardProg.correct > 0) acc.completed++;
                  acc.total++;
                  return acc;
                }, { completed: 0, total: 0 });

                const completionPercent = domainProgress.total > 0
                  ? (domainProgress.completed / domainProgress.total) * 100
                  : 0;

                return (
                  <button
                    key={domain.id}
                    onClick={() => selectDomain(domain)}
                    className="pack-card bg-white rounded-2xl p-6 text-left shadow-sm border border-gray-100 hover:border-indigo-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-2xl`}>
                        {domain.icon}
                      </div>
                      {domainCards.length === 0 ? (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                          Coming soon
                        </Badge>
                      ) : completionPercent === 100 ? (
                        <Badge className="text-xs bg-green-100 text-green-700">
                          Complete
                        </Badge>
                      ) : completionPercent > 0 ? (
                        <Badge variant="outline" className="text-xs border-indigo-300 text-indigo-700">
                          {Math.round(completionPercent)}% done
                        </Badge>
                      ) : null}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{domain.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium mb-2">{domain.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {domain.tasks.length} {domain.tasks.length === 1 ? 'task' : 'tasks'} • {domainCards.length} cards
                      </p>
                      {domainCards.length > 0 && (
                        <p className="text-xs text-gray-400">
                          {domainProgress.completed}/{domainProgress.total} reviewed
                        </p>
                      )}
                    </div>
                    {domainCards.length > 0 && (
                      <div className="mt-3">
                        <Progress value={completionPercent} className="h-1.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === 'tasks' && selectedDomain && (
        <div className="max-w-3xl mx-auto">
          {/* Tasks Header */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={backToPacks}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to domains
            </Button>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedDomain.color} flex items-center justify-center text-xl`}>
                {selectedDomain.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedDomain.name}</h2>
                <p className="text-sm text-indigo-600 font-medium">{selectedDomain.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {selectedDomain.tasks.map(task => {
              const taskProgress = task.cards.reduce((acc, card) => {
                const cardProg = progress[card.id] || { correct: 0, incorrect: 0 };
                if (cardProg.correct > 0) acc.completed++;
                acc.total++;
                return acc;
              }, { completed: 0, total: 0 });

              const completionPercent = taskProgress.total > 0
                ? (taskProgress.completed / taskProgress.total) * 100
                : 0;

              const hasCards = task.cards.length > 0;

              return (
                <button
                  key={task.id}
                  onClick={() => hasCards && startTask(task.id)}
                  disabled={!hasCards}
                  className={`pack-card w-full bg-white rounded-2xl p-5 text-left shadow-sm border border-gray-100 ${
                    hasCards ? 'hover:border-indigo-200 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{task.name}</h3>
                    {!hasCards ? (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500 ml-2 flex-shrink-0">
                        Coming soon
                      </Badge>
                    ) : completionPercent === 100 ? (
                      <Badge className="text-xs bg-green-100 text-green-700 ml-2 flex-shrink-0">
                        Complete
                      </Badge>
                    ) : completionPercent > 0 ? (
                      <Badge variant="outline" className="text-xs border-indigo-300 text-indigo-700 ml-2 flex-shrink-0">
                        {Math.round(completionPercent)}% done
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {task.cards.length} {task.cards.length === 1 ? 'card' : 'cards'}
                    </p>
                    {hasCards && (
                      <p className="text-xs text-gray-400">
                        {taskProgress.completed}/{taskProgress.total} reviewed
                      </p>
                    )}
                  </div>
                  {hasCards && (
                    <div className="mt-3">
                      <Progress value={completionPercent} className="h-1.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === 'study' && (
        <div className="max-w-2xl mx-auto">
          {/* Study Header */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={backToTasks}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to tasks
            </Button>
            <div className="text-sm text-gray-500">
              {filteredCards.length > 0 ? `${validCurrentIndex + 1} / ${filteredCards.length}` : '0 / 0'}
            </div>
          </div>

          {/* Task Title and Filter Button */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedTask?.name}</h2>
              {currentCard && (
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                    {currentCard.topic}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      currentCard.difficulty === 'fundamental'
                        ? 'border-green-400 text-green-700 bg-green-50'
                        : currentCard.difficulty === 'application'
                        ? 'border-yellow-400 text-yellow-700 bg-yellow-50'
                        : 'border-red-400 text-red-700 bg-red-50'
                    }
                  >
                    {currentCard.difficulty === 'fundamental' && '\u2B50'}
                    {currentCard.difficulty === 'application' && '\u2B50\u2B50'}
                    {currentCard.difficulty === 'advanced' && '\u2B50\u2B50\u2B50'}
                    {' '}{currentCard.difficulty}
                  </Badge>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {filteredCards.length !== allCards.length && allCards.length > 0 && (
                <Badge className="ml-1 bg-indigo-100 text-indigo-700">
                  {filteredCards.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-6 p-5 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filter Cards</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Difficulty</h4>
                <div className="flex flex-wrap gap-2">
                  {['fundamental', 'application', 'advanced'].map(difficulty => (
                    <Badge
                      key={difficulty}
                      variant={selectedDifficulties.has(difficulty) ? "default" : "outline"}
                      className={`cursor-pointer capitalize ${
                        selectedDifficulties.has(difficulty)
                          ? difficulty === 'fundamental'
                            ? 'bg-green-500 hover:bg-green-600'
                            : difficulty === 'application'
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-red-500 hover:bg-red-600'
                          : ''
                      }`}
                      onClick={() => toggleDifficulty(difficulty)}
                    >
                      {difficulty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Card Type Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Card Type</h4>
                <div className="flex flex-wrap gap-2">
                  {['flashcard', 'multiple-choice', 'scenario', 'code-analysis', 'concept'].map(type => (
                    <Badge
                      key={type}
                      variant={selectedTypes.has(type) ? "default" : "outline"}
                      className={`cursor-pointer capitalize ${
                        selectedTypes.has(type) ? 'bg-indigo-500 hover:bg-indigo-600' : ''
                      }`}
                      onClick={() => toggleType(type)}
                    >
                      {type.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Topic Filter */}
              {availableTopics.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Topics</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={selectAllTopics}
                        className="text-xs h-6 px-2"
                        disabled={selectedTopics.size === availableTopics.length}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllTopics}
                        className="text-xs h-6 px-2"
                        disabled={selectedTopics.size === 0}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                    {availableTopics.map(topic => (
                      <Badge
                        key={topic}
                        variant={selectedTopics.has(topic) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedTopics.has(topic) ? 'bg-indigo-500 hover:bg-indigo-600' : ''
                        }`}
                        onClick={() => toggleTopic(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter Stats */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                {allCards.length > 0 ? (
                  <>Showing {filteredCards.length} of {allCards.length} cards</>
                ) : (
                  <>No cards available</>
                )}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {filteredCards.length > 0 && (
            <div className="mb-8">
              <Progress value={(validCurrentIndex / filteredCards.length) * 100} className="h-2" />
            </div>
          )}

          {/* No Cards Message */}
          {filteredCards.length === 0 ? (
            <div className="study-card bg-white rounded-3xl p-12 mb-6 text-center">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No cards match your filters</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filter criteria to see more cards.</p>
              <Button
                onClick={resetFilters}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Reset Filters
              </Button>
            </div>
          ) : !currentCard ? (
            <div className="study-card bg-white rounded-3xl p-12 mb-6 text-center">
              <div className="text-6xl mb-4">🃏</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No card selected</h3>
              <p className="text-gray-500">Something went wrong. Try going back and starting again.</p>
            </div>
          ) : (
            /* Flashcard or Multiple Choice */
            currentCard.type === 'multiple-choice' ? (
              <div className="study-card bg-white rounded-3xl p-8 mb-6">
                <div className="flex items-center justify-center mb-6">
                  {currentCard.awsIcon ? (
                    <div className="w-16 h-16">
                      {(() => { const Icon = getAWSIcon(currentCard.awsIcon); return Icon ? <Icon /> : null; })()}
                    </div>
                  ) : (
                    <div className="text-6xl">{currentCard.icon}</div>
                  )}
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center leading-relaxed px-4">
                  {currentCard.question}
                </h3>

                <div className="space-y-3">
                  {currentCard.options?.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentCard.correctAnswer;
                    const showResult = showExplanation;

                    let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all ";

                    if (!showResult) {
                      buttonClass += isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50";
                    } else {
                      if (isCorrect) {
                        buttonClass += "border-green-500 bg-green-50";
                      } else if (isSelected) {
                        buttonClass += "border-red-500 bg-red-50";
                      } else {
                        buttonClass += "border-gray-200 bg-gray-50";
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => !showExplanation && handleMultipleChoice(index)}
                        disabled={showExplanation}
                        className={buttonClass}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            {String.fromCharCode(65 + index)}. {option}
                          </span>
                          {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className={`mt-6 p-5 rounded-xl ${
                    selectedAnswer === currentCard.correctAnswer
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {selectedAnswer === currentCard.correctAnswer ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {selectedAnswer === currentCard.correctAnswer ? "Correct!" : "Not quite"}
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-sm"
                           dangerouslySetInnerHTML={{
                             __html: currentCard.explanation?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') ?? '<div></div>'
                           }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {showExplanation && (
                  <Button
                    onClick={nextCard}
                    className="w-full mt-6 h-12 text-zinc-800 font-medium rounded-xl"
                  >
                    Next question
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="flip-card-front">
                    <div
                      className="study-card bg-white rounded-3xl p-8 cursor-pointer hover:shadow-lg transition-shadow min-h-[400px] flex items-center justify-center"
                      onClick={handleCardFlip}
                    >
                      <div className="text-center">
                        {currentCard.awsIcon ? (
                          <div className="w-20 h-20 mx-auto mb-8">
                            {(() => { const Icon = getAWSIcon(currentCard.awsIcon); return Icon ? <Icon /> : null; })()}
                          </div>
                        ) : (
                          <div className="text-7xl mb-8">{currentCard.icon}</div>
                        )}
                        <h3 className="text-2xl font-semibold text-gray-900 leading-relaxed px-4">
                          {currentCard.question}
                        </h3>
                        <p className="text-sm text-gray-400 mt-8">Tap to reveal answer</p>
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="flip-card-back">
                    <div
                      className="study-card bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-8 cursor-pointer min-h-[400px] flex items-center justify-center"
                      onClick={handleCardFlip}
                    >
                      <div className="text-center">
                        <div className="prose prose-invert prose-lg max-w-none">
                          {currentCard.answer?.split('\n').map((line, i) => {
                            if (line.includes('```')) return null;
                            if (line.trim().startsWith('```')) return null;

                            return (
                              <p
                                key={i}
                                className="mb-3 leading-relaxed text-white/90"
                                dangerouslySetInnerHTML={{
                                  __html: line
                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                                    .replace(/`(.*?)`/g, '<code class="bg-white/20 px-2 py-0.5 rounded text-sm">$1</code>')
                                }}
                              />
                            );
                          })}
                        </div>
                        <p className="text-sm text-white/60 mt-8">Tap to flip back</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Action Buttons for Flashcards */}
          {isFlipped && currentCard?.type !== 'multiple-choice' && filteredCards.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button
                onClick={handleLearning}
                variant="outline"
                className="h-14 text-base font-medium border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl"
              >
                Still learning
              </Button>
              <Button
                onClick={handleKnowIt}
                className="h-14 text-base font-medium bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                I know this!
              </Button>
            </div>
          )}

          {/* Navigation */}
          {!isFlipped && currentCard?.type !== 'multiple-choice' && filteredCards.length > 0 && (
            <div className="flex justify-between mt-6">
              <Button
                onClick={previousCard}
                variant="outline"
                className="h-12 px-6 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Previous
              </Button>
              <Button
                onClick={nextCard}
                variant="outline"
                className="h-12 px-6 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          )}

          {/* Card Progress */}
          {currentCard && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Reviewed {cardProgress.correct + cardProgress.incorrect} times • Mastery: {masteryLevel.toFixed(0)}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}