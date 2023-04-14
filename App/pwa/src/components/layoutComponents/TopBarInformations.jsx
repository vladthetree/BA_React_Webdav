import React from 'react';
export function TopBarInformations(userdata, displayBLEconnection, isOnline) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          height: `${1.5}vw`,
          width: `${1.5}vw`,
          backgroundColor: displayBLEconnection ? 'green' : 'none',
          display: 'inline-block',
          marginRight: '5px',
        }}
      />
      <div
        style={{
          height: `${1.5}vw`,
          width: `${1.5}vw`,
          backgroundColor: isOnline ? 'none' : 'red',
          borderRadius: '50%',
          display: 'inline-block',
          marginRight: '5px',
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: `1.5vw solid ${(() => {
            if ('serviceWorker' in navigator) {
              try {
                return navigator.serviceWorker.controller ? 'none' : 'red';
              } catch (e) {
                console.error('Error in navigator code:', e);
                return 'gray';
              }
            } else {
              console.log('Service Worker ist nicht im Navigator vorhanden');
              return 'gray';
            }
          })()}`,
          borderLeft: '0.75vw solid transparent',
          borderRight: '0.75vw solid transparent',
          display: 'inline-block',
          marginRight: '5px',
        }}
      />
      &nbsp; &nbsp;
      <div>
        Logged: &nbsp; {userdata.username}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </div>
  );
}
