// This file displays information about the current topic and lets users choose connected topics to continue exploring.

import React from 'react';

export const DetailPanel = ({ details, visited, onSelect, t }) => {
  if (!details) return <div className="detail-panel">{t.loadingDetails}</div>;

  return (
    <div className="detail-panel">
      <div className="panel-cat">{t.conceptHeader}</div>
      <h3 className="panel-title">{details.title}</h3>
      <p className="panel-desc">{details.extract || t.noSummary}</p>

      {details.extract && (
        <>
          <div className="panel-cat">{t.connectionsHeader}</div>
          {details.connections.map((conn) => {
            const isDone = visited.has(conn);
            return (
              <div key={conn} className={`conn-item ${isDone ? 'done' : ''}`} onClick={() => !isDone && onSelect(conn)}>
                <span className="sq"></span>
                {conn}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};