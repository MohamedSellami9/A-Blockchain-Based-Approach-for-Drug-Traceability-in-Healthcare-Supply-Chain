import React from 'react';
import '../App.css';

function TokenMinted({ minted }) {
  return (
    <div>
      {minted && <p>Token minted successfully!</p>}
    </div>
  );
}

export default TokenMinted;
