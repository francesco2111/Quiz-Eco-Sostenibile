// ============================================
// QUIZ ECO-SOSTENIBILE - VERSIONE STATIC 100%
// ============================================

let questions = [];
let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let answered = false;

// ============================================
// FUNZIONI STATICHE (NO SERVER)
// ============================================

// Carica domande da file JSON (relativo)
async function loadQuestionsFromJSON() {
    try {
        console.log('📥 Caricamento domande da JSON...');
        const response = await fetch('./data/questions.json');
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Domande caricate da JSON');
            return data.questions;
        }
        
        console.log('⚠️ JSON non trovato, uso fallback');
        return getDefaultQuestions();
    } catch (error) {
        console.log('❌ JSON error, uso fallback');
        return getDefaultQuestions();
    }
}

// ✅ SALVATAGGIO LOCALE (no server)
async function submitResultsToServer(results) {
    console.log('💾 Risultati salvati localmente:', results);
    return null;
}

// ✅ CLASSIFICA LOCALE (no server)
async function loadGlobalLeaderboard() {
    console.log('🏆 Solo classifica locale disponibile');
    return null;
}

// ============================================
// DOMANDE DI FALLBACK (10 domande)
// ============================================

function getDefaultQuestions() {
    return [
        {
            question: "Quale percentuale della plastica mondiale viene effettivamente riciclata?",
            options: ["Solo il 9%", "Circa il 30%", "Circa il 50%", "Oltre il 70%"],
            correct: 0,
            explanation: "Solo il 9% della plastica viene riciclata globalmente."
        },
        {
            question: "Quanta CO2 produce in media un'auto a benzina per ogni km percorso?",
            options: ["50 grammi", "120 grammi", "200 grammi", "350 grammi"],
            correct: 1,
            explanation: "Un'auto a benzina emette circa 120g di CO2 per km."
        },
        {
            question: "Quale di queste attività consuma più acqua?",
            options: ["Fare una doccia di 10 minuti", "Lavare i piatti a mano", "Produrre 1 kg di carne bovina", "Far funzionare la lavatrice"],
            correct: 2,
            explanation: "Servono circa 15.000 litri d'acqua per produrre 1 kg di carne bovina."
        },
        {
            question: "Quanto tempo impiega una bottiglia di plastica a decomporsi in natura?",
            options: ["10-20 anni", "50-80 anni", "100-200 anni", "450-1000 anni"],
            correct: 3,
            explanation: "Una bottiglia di plastica può impiegare fino a 1000 anni per decomporsi."
        },
        {
            question: "Qual è la fonte di energia rinnovabile più diffusa al mondo?",
            options: ["Eolico", "Solare", "Idroelettrico", "Geotermico"],
            correct: 2,
            explanation: "L'energia idroelettrica rappresenta circa il 16% della produzione globale."
        },
        {
            question: "Quanta energia si risparmia riciclando una lattina di alluminio?",
            options: ["15%", "35%", "65%", "95%"],
            correct: 3,
            explanation: "Riciclare l'alluminio risparmia il 95% dell'energia."
        },
        {
            question: "Quale settore produce più emissioni di gas serra a livello globale?",
            options: ["Trasporti", "Produzione energia", "Agricoltura e allevamento", "Industria manifatturiera"],
            correct: 1,
            explanation: "La produzione di energia rappresenta circa il 25% delle emissioni globali."
        },
        {
            question: "Quanti alberi servono per assorbire la CO2 prodotta da un'auto in un anno?",
            options: ["2-3 alberi", "10-15 alberi", "30-50 alberi", "100+ alberi"],
            correct: 2,
            explanation: "Servono circa 30-50 alberi maturi per compensare le emissioni annuali."
        },
        {
            question: "Quale di questi materiali è più difficile da riciclare?",
            options: ["Vetro", "Carta", "Plastica mista", "Alluminio"],
            correct: 2,
            explanation: "La plastica mista contiene diversi tipi di polimeri da separare."
        },
        {
            question: "Di quanto è aumentata la temperatura media globale dal periodo preindustriale?",
            options: ["0.5°C", "1.1°C", "2.3°C", "3.5°C"],
            correct: 1,
            explanation: "La temperatura media globale è aumentata di circa 1.1°C."
        }
    ];
}

// ============================================
// INIZIALIZZAZIONE
// ============================================

async function initializeQuiz() {
    console.log('🌍 Inizializzazione Quiz...');
    questions = await loadQuestionsFromJSON();
    console.log(`✅ ${questions.length} domande caricate`);
}

// ============================================
// QUIZ LOGICA
// ============================================

async function startQuiz() {
    const startBtn = document.querySelector('.btn-eco');
    const originalText = startBtn.textContent;
    startBtn.textContent = '⏳ Caricamento...';
    startBtn.disabled = true;

    if (questions.length === 0) {
        await initializeQuiz();
    }

    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    loadQuestion();

    startBtn.textContent = originalText;
    startBtn.disabled = false;
}

function loadQuestion() {
    answered = false;
    const question = questions[currentQuestion];
    document.getElementById('question-number').textContent = `Domanda ${currentQuestion + 1} di ${questions.length}`;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });

    document.getElementById('next-btn').classList.add('hidden');
    updateProgress();
}

function selectAnswer(selectedIndex) {
    if (answered) return;
    
    answered = true;
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) {
            button.classList.add('correct');
        }
        if (index === selectedIndex && selectedIndex !== question.correct) {
            button.classList.add('incorrect');
        }
    });

    if (selectedIndex === question.correct) {
        score += 10;
        correctAnswers++;
    } else {
        incorrectAnswers++;
    }

    document.getElementById('current-score').textContent = score;
    document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = progress + '%';
    progressBar.textContent = Math.round(progress) + '%';
}

async function showResults() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    
    document.getElementById('final-score').textContent = score + '/100';
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('incorrect-answers').textContent = incorrectAnswers;
    
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    document.getElementById('accuracy').textContent = accuracy + '%';
    
    const feedbackElement = document.getElementById('feedback-message');
    if (score >= 90) {
        feedbackElement.className = 'feedback excellent';
        feedbackElement.innerHTML = '<strong>🌟 Eccellente!</strong> Sei un vero esperto di sostenibilità!';
    } else if (score >= 70) {
        feedbackElement.className = 'feedback good';
        feedbackElement.innerHTML = '<strong>👏 Ottimo lavoro!</strong> Hai una buona conoscenza dei temi ambientali.';
    } else if (score >= 50) {
        feedbackElement.className = 'feedback average';
        feedbackElement.innerHTML = '<strong>📚 Buon inizio!</strong> Hai delle basi solide, continua così!';
    } else {
        feedbackElement.className = 'feedback poor';
        feedbackElement.innerHTML = '<strong>💪 Non mollare!</strong> La sostenibilità è importante, studia questi temi!';
    }

    await updateLeaderboard();
    
    // Solo salvataggio locale
    await submitResultsToServer({
        score: score,
        correctAnswers: correctAnswers,
        incorrectAnswers: incorrectAnswers,
        accuracy: accuracy,
        timestamp: new Date().toISOString(),
        totalQuestions: questions.length
    });
}

async function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('ecoQuizLeaderboard') || '[]');
    
    const timestamp = new Date().toLocaleString('it-IT');
    leaderboard.push({ score: score, date: timestamp });
    
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    
    localStorage.setItem('ecoQuizLeaderboard', JSON.stringify(leaderboard));
    
    const container = document.getElementById('leaderboard-container');
    container.innerHTML = '<h4 class="mb-3">🏆 Classifica Locale</h4>';
    
    if (leaderboard.length === 0) {
        container.innerHTML += '<p class="text-muted">Nessun punteggio registrato ancora.</p>';
    } else {
        leaderboard.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="leaderboard-rank">#${index + 1}</div>
                    <div>
                        <div class="fw-bold">${entry.date}</div>
                    </div>
                </div>
                <div class="leaderboard-score">${entry.score}/100</div>
            `;
            container.appendChild(item);
        });
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    document.getElementById('current-score').textContent = '0';
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('intro-screen').classList.remove('hidden');
}

// ============================================
// AVVIO AUTOMATICO
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    console.log('🌍 Quiz Eco-Sostenibile STATICO caricato!');
    initializeQuiz();
});
