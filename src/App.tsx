import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const db = await initDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.put({ id: cardId, ...data });
};

const getProgress = async (cardId: string): Promise<CardProgress> => {
  const db = await initDB();
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve) => {
    const request = store.get(cardId);
    request.onsuccess = () => resolve(request.result || { id: cardId, correct: 0, incorrect: 0, lastReview: null, difficulty: 0 });
  });
};

const getAllProgress = async (): Promise<CardProgress[]> => {
  const db = await initDB();
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
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

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }

    setDeferredPrompt(null);
  };

  // Get all cards for a domain (across all tasks)
  const getDomainCards = (domain: Domain): Flashcard[] => {
    return domain.tasks.flatMap(t => t.cards);
  };

  // Get cards for the selected task
  const selectedTask = selectedDomain?.tasks.find(t => t.id === selectedTaskId);
  const currentCards = selectedTask?.cards || [];
  const currentCard = currentCards[currentCardIndex];

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      const allProgress = await getAllProgress();
      const progressMap: Record<string, CardProgress> = {};
      allProgress.forEach(p => {
        progressMap[p.id] = p;
      });
      setProgress(progressMap);
    };
    loadProgress();
  }, []);

  const selectDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    setView('tasks');
  };

  const startTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setView('study');
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const backToPacks = () => {
    setView('packs');
    setSelectedDomain(null);
    setSelectedTaskId(null);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const backToTasks = () => {
    setView('tasks');
    setSelectedTaskId(null);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnowIt = async () => {
    if (!currentCard) return;
    const cardProgress = await getProgress(currentCard.id);
    const newProgress = {
      ...cardProgress,
      correct: cardProgress.correct + 1,
      lastReview: new Date().toISOString(),
      difficulty: Math.max(0, cardProgress.difficulty - 1)
    };
    await saveProgress(currentCard.id, newProgress);

    setProgress(prev => ({ ...prev, [currentCard.id]: newProgress }));
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      correct: prev.correct + 1
    }));

    nextCard();
  };

  const handleLearning = async () => {
    if (!currentCard) return;
    const cardProgress = await getProgress(currentCard.id);
    const newProgress = {
      ...cardProgress,
      incorrect: cardProgress.incorrect + 1,
      lastReview: new Date().toISOString(),
      difficulty: cardProgress.difficulty + 1
    };
    await saveProgress(currentCard.id, newProgress);

    setProgress(prev => ({ ...prev, [currentCard.id]: newProgress }));
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      incorrect: prev.incorrect + 1
    }));

    nextCard();
  };

  const handleMultipleChoice = async (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    const isCorrect = optionIndex === currentCard.correctAnswer;
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
    setStats(prev => ({
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1
    }));
  };

  const nextCard = () => {
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentCardIndex < currentCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const previousCard = () => {
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    } else {
      setCurrentCardIndex(currentCards.length - 1);
    }
  };

  const cardProgress = progress[currentCard?.id] || { correct: 0, incorrect: 0 };
  const masteryLevel = cardProgress.correct > 0
    ? Math.min(100, (cardProgress.correct / (cardProgress.correct + cardProgress.incorrect)) * 100)
    : 0;

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

      {view === 'study' && currentCard && (
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
              {currentCardIndex + 1} / {currentCards.length}
            </div>
          </div>

          {/* Task Title */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedTask?.name}</h2>
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
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={(currentCardIndex / currentCards.length) * 100} className="h-2" />
          </div>

          {/* Flashcard or Multiple Choice */}
          {currentCard.type === 'multiple-choice' ? (
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
                  className="w-full mt-6 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl"
                >
                  Next question
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          ) : (
            <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
              <div className="flip-card-inner" style={{ minHeight: '400px' }}>
                {/* Front */}
                <div className="flip-card-front">
                  <div
                    className="study-card bg-white rounded-3xl p-8 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={handleCardFlip}
                    style={{ minHeight: '400px' }}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      {currentCard.awsIcon ? (
                        <div className="w-20 h-20 mb-8">
                          {(() => { const Icon = getAWSIcon(currentCard.awsIcon); return Icon ? <Icon /> : null; })()}
                        </div>
                      ) : (
                        <div className="text-7xl mb-8">{currentCard.icon}</div>
                      )}
                      <h3 className="text-2xl font-semibold text-gray-900 text-center leading-relaxed px-4">
                        {currentCard.question}
                      </h3>
                      <p className="text-sm text-gray-400 mt-8">Tap to reveal answer</p>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="flip-card-back">
                  <div
                    className="study-card bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-8 cursor-pointer"
                    onClick={handleCardFlip}
                    style={{ minHeight: '400px' }}
                  >
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
          )}

          {/* Action Buttons for Flashcards */}
          {isFlipped && currentCard.type !== 'multiple-choice' && (
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
          {!isFlipped && currentCard.type !== 'multiple-choice' && (
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
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Reviewed {cardProgress.correct + cardProgress.incorrect} times • Mastery: {masteryLevel.toFixed(0)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
