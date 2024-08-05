import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
import './Currencyswap.css'; 
import swap from '/swapf.png';

const Currencyswap = () => {
  const [tokenList, setTokenList] = useState([]);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://interview.switcheo.com/prices.json')
      .then(response => {
        setTokenList(response.data);
      })
      .catch(error => {
        console.error('Error fetching token data:', error);
      });
  }, []);

  useEffect(() => {
    if (!fromToken || !toToken || !fromAmount) {
      return;
    } else {
      handleSubmit();
    }
    
  });

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const fromRate = tokenList.find(item => item.currency === fromCurrency)?.price;
    const toRate = tokenList.find(item => item.currency === toCurrency)?.price;
    console.log(fromRate, toRate);
    if (!fromRate || !toRate) {
      return null;
    }
    return (amount * fromRate) / toRate;
  };

  const handleSubmit = () => {
    

    if (!fromToken || !toToken || !fromAmount) {
      setError("Please fill out all fields");
      return;
    }

    const convertedAmount = convertCurrency(fromAmount, fromToken, toToken);
    if (convertedAmount === null) {
      setError('Conversion rate not available for selected tokens');
      return;
    }

    setToAmount(convertedAmount.toFixed(4));
    setError('');
  };

  const handleReverse = () => {
    if (fromAmount && !toAmount || toAmount === 0) {
      let zero = 0
      setFromAmount(zero.toFixed(2));
      setToAmount(zero.toFixed(2));
      return;
    }


    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const tokenOptions = Array.from(new Set(tokenList.map(token => token.currency)))
    .map(currency => ({
      value: currency,
      label: currency,
    }));
  

  return (
    <div className="container">
      <h1>Exchange Currency</h1>
      <form className="swap-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <div className="input-container-top">
            <label className="label">From:</label>
            <span>Exchange rate</span>
          </div>
          <div className="input-container-bottom">
          <select
                className="custom-select"
                value={fromToken} 
                onChange={(e) => setFromToken(e.target.value)}
              >
                <option value="">Select a token</option>
                {tokenOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                
              </select>
            <input
              className="input"
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
          </div>
          <button className="swap-button" type="button" onClick={handleReverse}><img src={swap} alt="" /></button>

        </div>

        
        <div className="input-container-2">
          <div className="input-container-2-top">
            <label className="to-label">To:</label>
          </div>
          <div className="input-container-2-bottom">
            <select
                className="custom-select"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
              >
                <option value="">Select a token</option>
                {tokenOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                
              </select>

            <input
              className="input"
              type="text"
              placeholder="0.00"
              value={toAmount}
              readOnly
            />
          </div>
          
        </div>

        {error && <p className="error-message">{error}</p>}
        
        <button className="button" type="submit">Connect Wallet</button>
      </form>
    </div>
  );

}

export default Currencyswap;
