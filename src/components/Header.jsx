// This file creates the header with the Bunny Dive logo, language switch, exit button, and topic counter.

import bunnyLogo from '/bunny-dive-logo.png';

const pillButtonStyle = {
  background: 'transparent',
  border: '2px solid var(--lavender)',
  color: 'var(--lavender)',
  padding: '4px 12px',
  fontWeight: 'bold',
  borderRadius: '4px'
};

export const Header = ({ count, t, lang, onToggleLang, onExit }) => {
  return (
    <header className="bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '3px solid var(--purple)' }}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={bunnyLogo} alt="" style={{ height: '38px', width: 'auto', display: 'block' }} />
        <span style={{ color: 'var(--mint)', fontFamily: 'Archivo Black', letterSpacing: '1px' }}>
          {t.logo || 'Bunny Dive'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onToggleLang} style={pillButtonStyle}>
          {lang === 'en' ? 'TR' : 'EN'}
        </button>

        {onExit && (
          <button onClick={onExit} style={pillButtonStyle}>
            {t.exit || (lang === 'tr' ? 'Çıkış' : 'Exit')}
          </button>
        )}

        {count !== undefined && (
          <div className="badge" style={{ width: '34px', height: '34px', background: 'var(--mint)', color: 'var(--plum)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {count}
          </div>
        )}
      </div>
    </header>
  );
};