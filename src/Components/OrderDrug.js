import React from 'react';
import '../App.css';

function OrderDrug({ orderr, acceptt, orderd }) {
  return (
    <div>
      {!orderd ? (
        <div>
          <button onClick={orderr}>Order Drug</button>
        </div>
      ) : (
        <div>
          <button onClick={acceptt}>Accept</button>
        </div>
      )}
    </div>
  );
}

export default OrderDrug;
