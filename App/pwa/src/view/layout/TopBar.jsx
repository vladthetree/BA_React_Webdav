import React from 'react';
export function TopBar({
  topBar_left,
  topBar_middle,
  topBar_right,
  topBarheight,
  fontSize,
}) {
  return (
    <nav className="topBar" style={{ height: topBarheight }}>
      <div className="topBar_left_wrapper">
        <div className="topBar_left">{topBar_left}</div>
      </div>
      <div className="topBar_middle" style={{ fontSize }}>
        {topBar_middle}
      </div>
      <div className="topBar_left_wrapper">
        <div className="topBar_left">{topBar_right}</div>
      </div>
    </nav>
  );
}
