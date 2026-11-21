import React, { useState, useEffect } from 'react';
import { educationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Apple,
  Package,
  Cpu,
  AlertTriangle,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Award
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const WasteEducationPage = () => {
  const { isAuthenticated } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Quiz State
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');

  const quizQuestions = [
    {
      question: 'Which bin should banana peels and leftover cooked rice go into?',
      options: ['Green Bin (Wet Waste / Composting)', 'Blue Bin (Dry Recyclables)', 'Red Bin (Hazardous Waste)', 'Black Bin (Landfill Trash)'],
      correct: 0,
      explanation: 'Food residues and fruit peels are organic biodegradable wet waste suitable for composting.'
    },
    {
      question: 'Before placing greasy plastic takeout food containers into the recycling bin, what must you do?',
      options: ['Throw them away directly with food remaining', 'Rinse them thoroughly with water to remove food grease', 'Burn them at home', 'Wrap them in old clothing'],
      correct: 1,
      explanation: 'Food residues spoil entire batches of recycled paper and plastic pulping.'
    },
    {
      question: 'Where should swollen lithium-ion laptop and smartphone batteries be disposed?',
      options: ['In standard municipal trash cans', 'In household compost piles', 'At authorized certified E-waste drop-off bins', 'Poured with salt water down the sink'],
      correct: 2,
      explanation: 'Lithium batteries can explode or ignite fires in conventional trash compactors.'
    },
    {
      question: 'How should expired prescription medicines and liquid syrups be handled?',
      options: ['Flushed down the toilet sink', 'Returned to pharmacy take-back bins or hazardous waste collections', 'Mixed into vegetable garden compost', 'Dumped on roadside corners'],
      correct: 1,
      explanation: 'Flushing pharmaceuticals poisons river aquifers and encourages antibiotic-resistant bacteria.'
    }
  ];

  useEffect(() => {
    fetchEducation();
  }, [activeCategory]);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await educationAPI.getContent({
        category: activeCategory,
        search
      });
      if (res.data.success) {
        setTopics(res.data.topics);
      }
    } catch (err) {
      console.error('Error fetching educational topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEducation();
  };

  const handleAnswerClick = (optionIdx) => {
    if (optionIdx === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
      if (isAuthenticated) {
        educationAPI.takeQuiz({ quizScore: 100 })
          .then((res) => {
            setClaimMessage(res.data.message);
          })
          .catch((err) => {
            console.error('Quiz reward error:', err);
          });
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizFinished(false);
    setQuizActive(false);
    setClaimMessage('');
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Apple':
        return <Apple size={22} className="text-emerald-500" />;
      case 'Cpu':
        return <Cpu size={22} className="text-teal-500" />;
      case 'AlertTriangle':
        return <AlertTriangle size={22} className="text-amber-500" />;
      default:
        return <Package size={22} className="text-blue-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <BookOpen size={14} className="text-emerald-700" />
          <span>Waste Segregation & Educational Academy</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          How to Segregate Waste Responsibly
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Proper source segregation turns 85% of municipal refuse into valuable bio-fertilizers and circular secondary manufacturing inputs.
        </p>
      </div>

      {/* Quiz Banner / Gamification Section */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider inline-block">
            +15 Green Points Quiz
          </span>
          <h2 className="text-xl sm:text-2xl font-black">Test Your Segregation Knowledge</h2>
          <p className="text-xs text-slate-300 max-w-lg">
            Answer 4 quick practical questions regarding wet waste, recyclables, e-waste, and household hazards to earn Green Points!
          </p>
        </div>

        <button
          onClick={() => {
            setQuizActive(true);
            setQuizFinished(false);
            setCurrentQuestion(0);
            setScore(0);
          }}
          className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5 whitespace-nowrap"
        >
          {quizActive ? 'Restart Quiz' : 'Take 2-Min Quiz'}
        </button>
      </div>

      {/* Interactive Quiz Card */}
      {quizActive && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl max-w-2xl mx-auto space-y-6">
          {!quizFinished ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>Score: {score}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="space-y-2 pt-2">
                {quizQuestions[currentQuestion].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerClick(i)}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between group"
                  >
                    <span>{opt}</span>
                    <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] group-hover:bg-emerald-600 group-hover:text-white transition">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
                🏆
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Quiz Completed!</h3>
              <p className="text-sm text-slate-600">
                You scored <strong className="text-emerald-700">{score} out of {quizQuestions.length}</strong>!
              </p>

              {claimMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                  {claimMessage}
                </div>
              )}

              <button
                onClick={resetQuiz}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Close Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Wet Waste', 'Dry Waste', 'E-Waste', 'Hazardous Waste'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items (e.g. peel, battery)..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </form>
      </div>

      {/* Topics Grid */}
      {loading ? (
        <LoadingSpinner label="Loading Segregation Guidelines..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs">
                    {getIcon(t.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {t.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{t.title}</h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <strong className="text-slate-850 font-bold block">Everyday Examples:</strong>
                <p className="text-slate-600">{t.examples}</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1.5 text-xs text-emerald-950">
                <strong className="text-emerald-800 font-bold block flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Correct Disposal Action:</span>
                </strong>
                <p className="leading-snug">{t.disposal_action}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
