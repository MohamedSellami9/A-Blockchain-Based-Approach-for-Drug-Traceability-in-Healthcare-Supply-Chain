import React from 'react';
import Button from 'react-bootstrap/Button';
import '../App.css';

function OrderDrug({ orderr, acceptt, orderd }) {
  return (
    <div>
      {!orderd ? (
        <div>
          <Button variant='dark' onClick={orderr}>Order Drug</Button>
        </div>
      ) : (
        <div>
          <Button variant='dark' onClick={acceptt}>Accept</Button>
        </div>
      )}
    </div>
  );
}

export default OrderDrug;
