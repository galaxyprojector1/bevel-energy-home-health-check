import React, { useState, useEffect } from 'react';
import { AppStage, UserData, HeatingType, SimulationResult } from './types';
import { Card, PrimaryButton, SectionHeader, CircularGauge, ListItem } from './components/BevelUI';
import { SavingsChart } from './components/Charts';
import { CloudSun, Banknote, Zap, Home, ArrowRight, Lock, CheckCircle2, Flame, Droplets, ThermometerSun, MapPin } from 'lucide-react';

const INITIAL_DATA: UserData = {
  ownerStatus: null,
  heatingType: null,
  monthlyBill: 150,
  postalCode: '',
};

const QUESTIONS = [
  {
    id: 'owner',
    title: 'Votre Profil',
    subtitle: 'Pour commencer le scan',
    type: 'options',
    options: [
      { value: 'owner', label: 'Proprietaire', icon: <Home className="w-6 h-6 text-indigo-500" /> },
      { value: 'tenant', label: 'Locataire', icon: <div className="w-6 h-6 rounded-full border-2 border-indigo-200" /> },
    ]
  },
  {
    id: 'postalCode',
    title: 'Localisation',
    subtitle: 'Analyse climatique de la zone',
    type: 'input',
    placeholder: 'Code Postal (ex: 69002)',
    inputType: 'text'
  },
  {
    id: 'heating',
    title: 'Source de Chaleur',
    subtitle: 'Analyse du systeme actuel',
    type: 'options',
    options: [
      { value: HeatingType.ELECTRIC, label: 'Electrique', icon: <Zap className="w-6 h-6 text-amber-500" /> },
      { value: HeatingType.GAS, label: 'Gaz', icon: <Flame className="w-6 h-6 text-orange-500" /> },
      { value: HeatingType.OIL, label: 'Fioul', icon: <Droplets className="w-6 h-6 text-slate-700" /> },
      { value: HeatingType.WOOD, label: 'Bois', icon: <div className="text-xl">🪵</div> },
    ]
  },
  {
    id: 'bill',
    title: 'Facture Mensuelle',
    subtitle: 'Estimation de la depense energetique',
    type: 'slider'
  }
];

export default function App() {
  const [stage, setStage] = useState<AppStage>(AppStage.ONBOARDING);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userData, setUserData] = useState<UserData>(INITIAL_DATA);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const handleNextQuestion = (key: keyof UserData, value: any) => {
    setUserData(prev => ({ ...prev, [key]: value }));
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStage(AppStage.CALCULATING);
    }
  };

  const generateSimulation = async () => {
    setSimulationResult({
      energyScore: 45,
      wasteScore: 55,
      projectedSavings: Math.round(userData.monthlyBill * 0.4),
      roiYears: 6.5,
      aidAmount: 7500,
      autonomyScore: 65,
      analysisShort: "Systeme de chauffage energivore detecte.",
      analysisLong: "Votre installation actuelle entraine des pertes importantes. Une renovation globale pourrait diviser votre facture par deux.",
      chartData: Array.from({ length: 10 }, (_, i) => ({
        year: (2025 + i).toString(),
        current: Math.round(userData.monthlyBill * 12 * (i + 1)),
        optimized: Math.round(userData.monthlyBill * 0.6 * 12 * (i + 1))
      }))
    });
  };

  useEffect(() => {
    if (stage === AppStage.CALCULATING) {
      generateSimulation();
      const interval = setInterval(() => {
        setScanningProgress(prev => {
          if (prev >= 100) { clearInterval(interval); return 100; }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === AppStage.CALCULATING && scanningProgress === 100 && simulationResult) {
      setStage(AppStage.DASHBOARD);
    }
  }, [scanningProgress, simulationResult, stage]);

  const renderOnboarding = () => (
    <div className="flex flex-col h-full justify-between pt-12 pb-6 px-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 rotate-3 animate-pulse-soft">
          <CloudSun className="w-12 h-12 text-indigo-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Bilan Sante<br/>Energetique</h1>
        <p className="text-lg text-slate-500 max-w-xs leading-relaxed">
          Analysez le metabolisme de votre maison. Identifiez les pertes. Optimisez votre budget.
        </p>
      </div>
      <div className="w-full">
        <PrimaryButton onClick={() => setStage(AppStage.QUESTIONNAIRE)}>
          Lancer le Scan
        </PrimaryButton>
      </div>
    </div>
  );

  const renderQuestionnaire = () => {
    const question = QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / QUESTIONS.length) * 100;
    return (
      <div className="flex flex-col h-full pt-8 pb-6 px-6">
        <div className="w-full bg-gray-200 h-1.5 rounded-full mb-8">
          <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <SectionHeader title={question.title} subtitle={question.subtitle} />
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {question.type === 'slider' ? (
            <Card className="flex flex-col items-center justify-center py-12">
              <span className="text-5xl font-bold text-slate-900 mb-2">{userData.monthlyBill} €</span>
              <span className="text-sm text-slate-400 font-medium uppercase tracking-wide mb-8">Par Mois</span>
              <input type="range" min="50" max="500" step="10" value={userData.monthlyBill}
                onChange={(e) => setUserData({...userData, monthlyBill: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between w-full mt-4 px-2 text-xs text-slate-400 font-semibold">
                <span>50 €</span><span>500 €+</span>
              </div>
            </Card>
          ) : question.type === 'input' ? (
            <Card className="flex flex-col p-6">
              <div className="flex items-center gap-3 mb-4 text-slate-500">
                <MapPin className="w-6 h-6" /><span className="text-sm font-medium">Code Postal</span>
              </div>
              <input type="text" autoFocus placeholder="ex: 75001"
                className="w-full text-3xl font-bold text-slate-900 placeholder-gray-200 border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-2 transition-colors bg-transparent"
                value={userData.postalCode}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 5 && /^\d*$/.test(val)) { setUserData({...userData, postalCode: val}); }
                }} />
            </Card>
          ) : (
            question.options?.map((opt) => (
              <Card key={opt.value} onClick={() => handleNextQuestion(question.id === 'owner' ? 'ownerStatus' : 'heatingType', opt.value)}
                className="flex items-center gap-4 hover:border-indigo-200 transition-colors">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">{opt.icon}</div>
                <span className="text-lg font-semibold text-slate-700">{opt.label}</span>
                <div className="ml-auto"><ArrowRight className="w-5 h-5 text-gray-300" /></div>
              </Card>
            ))
          )}
        </div>
        {question.type === 'slider' && (
          <PrimaryButton onClick={() => handleNextQuestion('monthlyBill', userData.monthlyBill)}>Valider</PrimaryButton>
        )}
        {question.type === 'input' && (
          <PrimaryButton disabled={userData.postalCode.length < 5} onClick={() => handleNextQuestion('postalCode', userData.postalCode)}>Continuer</PrimaryButton>
        )}
      </div>
    );
  };

  const renderCalculating = () => (
    <div className="flex flex-col h-full items-center justify-center px-8 text-center bg-white">
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <svg className="animate-spin w-full h-full text-gray-100" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold text-3xl">{scanningProgress}%</div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyse du Bati</h2>
      <p className="text-slate-500">Analyse climatique de {userData.postalCode || 'votre region'} et calcul du potentiel solaire...</p>
    </div>
  );

  const renderDashboard = () => {
    if (!simulationResult) return null;
    return (
      <div className="flex flex-col h-full bg-[#f2f2f7] overflow-y-auto pb-6">
        <div className="sticky top-0 z-10 bg-[#f2f2f7]/95 backdrop-blur-md px-6 pt-12 pb-4 border-b border-gray-200/50">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Synthese</h1>
              <p className="text-slate-500 font-medium">Base sur votre profil</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
              <CloudSun className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
        </div>
        <div className="px-4 space-y-4 mt-4">
          <Card className="relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-slate-500">Score Energetique</span>
              <div className={`px-2 py-1 rounded-lg text-xs font-bold ${simulationResult.energyScore > 60 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {simulationResult.energyScore > 60 ? 'BON' : 'AMELIORABLE'}
              </div>
            </div>
            <CircularGauge value={simulationResult.energyScore} label="Efficacite Estimee" subLabel="Score" colorClass={simulationResult.energyScore > 60 ? "text-emerald-500" : "text-orange-400"} />
            <div className={`mt-4 p-4 rounded-2xl border ${simulationResult.energyScore > 60 ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
              <div className="flex gap-3">
                <ThermometerSun className={`w-5 h-5 shrink-0 ${simulationResult.energyScore > 60 ? 'text-emerald-500' : 'text-orange-500'}`} />
                <p className="text-sm text-slate-700 leading-snug">
                  <span className="font-bold">{simulationResult.analysisShort}</span> {simulationResult.analysisLong}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-slate-900 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-slate-400" />Projection Cash-Flow
              </span>
              <span className="text-xs font-medium text-slate-400">10 ANS</span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-slate-900">
                +{simulationResult.chartData[9].current - simulationResult.chartData[9].optimized > 0 
                  ? (simulationResult.chartData[9].current - simulationResult.chartData[9].optimized).toLocaleString('fr-FR') : '0'} €
              </span>
              <span className="text-sm font-semibold text-emerald-600 mb-1">d'economies cumulees</span>
            </div>
            <SavingsChart data={simulationResult.chartData} />
            <p className="text-xs text-slate-400 mt-4 text-center">Comparatif cumule : Depenses actuelles (Rouge) vs. Apres renovation (Vert)</p>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col items-center justify-center py-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{simulationResult.aidAmount.toLocaleString('fr-FR')} €</span>
              <span className="text-xs font-medium text-slate-400 mt-1">Aides Estimees*</span>
            </Card>
            <Card className="flex flex-col items-center justify-center py-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{simulationResult.autonomyScore}%</span>
              <span className="text-xs font-medium text-slate-400 mt-1">Autonomie</span>
            </Card>
          </div>
          <Card className="mb-24">
            <h3 className="font-semibold text-slate-900 mb-4">Analyse Detaillee</h3>
            <div className="space-y-1">
              <ListItem icon={<Flame className="w-5 h-5 text-orange-600" />} color="bg-orange-100" label="Chauffage Actuel" value={userData.heatingType || '-'} subValue="Impact majeur sur le score" />
              <ListItem icon={<Home className="w-5 h-5 text-indigo-600" />} color="bg-indigo-100" label="Zone Climatique" value={userData.postalCode} subValue="Donnee prise en compte" />
              <ListItem icon={<CloudSun className="w-5 h-5 text-yellow-600" />} color="bg-yellow-100" label="Gisement Solaire" value="Analyse" subValue="Potentiel identifie" />
            </div>
          </Card>
        </div>
        <div className="fixed bottom-6 left-6 right-6 z-20">
          <PrimaryButton onClick={() => setStage(AppStage.LEAD_CAPTURE)}>Debloquer mon rapport complet</PrimaryButton>
        </div>
      </div>
    );
  };

  const renderLeadCapture = () => (
    <div className="flex flex-col h-full relative bg-[#f2f2f7]">
      <div className="absolute inset-0 blur-sm opacity-50 pointer-events-none">
        <div className="p-6">
          <div className="bg-white h-64 rounded-3xl w-full mb-4"></div>
          <div className="bg-white h-48 rounded-3xl w-full mb-4"></div>
        </div>
      </div>
      <div className="z-10 flex flex-col h-full justify-end pb-0">
        <div className="bg-white rounded-t-[32px] p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-slide-up">
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8"></div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-3">Rapport Premium</h2>
          <p className="text-center text-slate-500 mb-8 leading-relaxed">
            Pour recevoir votre etude detaillee (PDF) et verifier votre eligibilite aux {simulationResult?.aidAmount.toLocaleString('fr-FR') || '8 500'} € d'aides, finalisez votre profil.
          </p>
          <form className="space-y-4 mb-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email</label>
              <input type="email" placeholder="exemple@email.com" className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 border-none transition-all placeholder:text-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Telephone</label>
              <input type="tel" placeholder="06 12 34 56 78" className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 border-none transition-all placeholder:text-gray-300" />
            </div>
          </form>
          <PrimaryButton onClick={() => alert("Lead envoye !")}>Voir mes resultats</PrimaryButton>
          <p className="text-center text-xs text-gray-400 mt-4">Gratuit & Sans engagement. Vos donnees sont securisees.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black sm:py-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-[400px] h-[100dvh] sm:h-[800px] bg-[#f2f2f7] sm:rounded-[40px] shadow-2xl overflow-hidden relative">
        {stage === AppStage.ONBOARDING && renderOnboarding()}
        {stage === AppStage.QUESTIONNAIRE && renderQuestionnaire()}
        {stage === AppStage.CALCULATING && renderCalculating()}
        {stage === AppStage.DASHBOARD && renderDashboard()}
        {stage === AppStage.LEAD_CAPTURE && renderLeadCapture()}
      </div>
    </div>
  );
}
