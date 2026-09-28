// This file controls the main app flow by managing the language, screen transitions, rabbit hole exploration, graph view, progress, and completion screen.

import React, { useState } from 'react';
import { useRabbitHole } from './hooks/useRabbitHole';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { GraphCanvas } from './components/GraphCanvas';
import { DetailPanel } from './components/DetailPanel';
import { ProgressBar } from './components/ProgressBar';
import { translations } from './utils/i18n';
import { pad2 } from './utils/constants';
import './styles/global.css';
import './styles/graph.css';

export default function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  const { visited, history, nodes, edges, currentDetails, loading, exploreTopic, reset, isComplete, translationToken } = useRabbitHole(lang);
  const [screen, setScreen] = useState('home');
  const [focusTarget, setFocusTarget] = useState(null);
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'tr' : 'en'));
  };
  const handleStart = (topic) => {
    setScreen('graph');
    exploreTopic(topic);
  };
  const handleReset = () => {
    reset();
    setScreen('home');
  };
  const handleFocusNode = (nodeId) => {
    setFocusTarget({ id: nodeId, token: Date.now() });
  };
  if (isComplete && screen !== 'complete') {
    setScreen('complete');
  }
  const defaultTopic = lang === 'en' ? 'Black hole' : 'Kara delik';
  return (
    <div className="app-container">
      {screen === 'home' && (
        <div className="home-screen">
          <Header t={t} lang={lang} onToggleLang={toggleLanguage} />
          <div className="home-grid">
            <div className="home-left">
              <h1 style={{ whiteSpace: 'pre-line' }}>
                {t.heroTitle.split('\n').map((line, i, lines) => (
                  <span key={i} style={i === lines.length - 1 ? { color: 'var(--mint)' } : undefined}>
                    {line}
                    {i < lines.length - 1 && '\n'}
                  </span>
                ))}
              </h1>
              <p className="home-sub">{t.heroSub}</p>
              <SearchBar onSearch={handleStart} t={t} defaultTopic={defaultTopic} />
            </div>
          </div>
        </div>
      )}
      {screen === 'graph' && (
        <div className="graph-screen">
          <Header count={visited.size} t={t} lang={lang} onToggleLang={toggleLanguage} onExit={handleReset} />
          <div className="graph-main">
            <GraphCanvas nodes={nodes} edges={edges} onNodeClick={exploreTopic} loading={loading} t={t} focusTarget={focusTarget} translationToken={translationToken} />
            <DetailPanel details={currentDetails} visited={visited} onSelect={exploreTopic} t={t} />
          </div>
          <ProgressBar visitedCount={visited.size} history={history} t={t} onSelectHistoryItem={handleFocusNode} />
        </div>
      )}
      {screen === 'complete' && (
        <div className="complete-screen">
          <div>
            <h1>{t.completeTitle}</h1>
            <p style={{ margin: '10px 0 20px', opacity: 0.75 }}>
              {t.completeSub.replace('{count}', visited.size)}
            </p>
            <div className="journey-list">
              {history.map((item, i) => (
                <div key={i} className="journey-item">
                  <strong style={{ color: 'var(--mint)' }}>{pad2(i + 1)}</strong> {item}
                </div>
              ))}
            </div>
            <button className="again-btn" onClick={handleReset}>{t.exploreAgain}</button>
          </div>
        </div>
      )}
    </div>
  );
}