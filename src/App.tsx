import React, { useState, useEffect } from 'react';
import './App.css';
import coinImage from './coin.png';
import appleImage from './apple.png';
import chocolateImage from './chocolate.png';
import flourImage from './flour.png';
import sugarImage from './sugar.png';
import cakeImage from './cake.png';
import coinSound from './coin.mp3';
import { getPlayerId } from './utils/playerId';

const App: React.FC = () => {
  const playerId = getPlayerId();

  const [coins, setCoins] = useState<number>(() => {
    const savedCoins = localStorage.getItem(`${playerId}-coins`);
    return savedCoins ? parseInt(savedCoins, 10) : 0;
  });

  const [ingredients, setIngredients] = useState<any>(() => {
    const savedIngredients = localStorage.getItem(`${playerId}-ingredients`);
    return savedIngredients
      ? JSON.parse(savedIngredients)
      : { apples: 0, chocolate: 0, flour: 0, sugar: 0 };
  });

  const [animatedCoins, setAnimatedCoins] = useState<number[]>([]);
  const [showCake, setShowCake] = useState<boolean>(false);

  const coinAudio = new Audio(coinSound);

  const requiredIngredients = { apples: 10, chocolate: 5, flour: 3, sugar: 2 };
  type IngredientName = keyof typeof requiredIngredients;

  useEffect(() => {
    if (localStorage.getItem(`${playerId}-cake`) === 'true') {
      setShowCake(true);
    }
  }, [playerId]);

  useEffect(() => {
    localStorage.setItem(`${playerId}-coins`, coins.toString());
  }, [coins, playerId]);

  useEffect(() => {
    localStorage.setItem(`${playerId}-ingredients`, JSON.stringify(ingredients));
  }, [ingredients, playerId]);

  const handleClick = () => {
    setCoins((prevCoins) => prevCoins + 1);

    coinAudio.currentTime = 0;
    coinAudio.play();

    const coinId = Date.now();
    setAnimatedCoins((prevCoins) => [...prevCoins, coinId]);
  };

  const handleAnimationEnd = (coinId: number) => {
    setAnimatedCoins((prevCoins) => prevCoins.filter((id) => id !== coinId));
  };

  const buyIngredient = (ingredientName: string, cost: number) => {
    if (coins >= cost) {
      setCoins((prevCoins) => prevCoins - cost);
      setIngredients((prevIngredients: any) => ({
        ...prevIngredients,
        [ingredientName]: prevIngredients[ingredientName] + 1,
      }));
    } else {
      alert('Not enough coins!');
    }
  };

  const canMakeCake = () => {
    return (Object.keys(requiredIngredients) as IngredientName[]).every(
      (key) => ingredients[key] >= requiredIngredients[key]
    );
  };

  const makeCake = () => {
    setShowCake(true);
    localStorage.setItem(`${playerId}-cake`, 'true');
  };

  const getMessage = () => {
    if (ingredients.apples >= 1 && ingredients.apples < 5) {
      return 'Do not bake a cake';
    } else if (ingredients.apples >= 5 && ingredients.apples < 10) {
      return 'Stop doing this';
    } else if (
      ingredients.apples >= requiredIngredients.apples &&
      ingredients.chocolate < requiredIngredients.chocolate
    ) {
      return 'A cake is a lie';
    } else if (
      ingredients.chocolate >= requiredIngredients.chocolate &&
      ingredients.flour < requiredIngredients.flour
    ) {
      return 'Seriously, stop!';
    } else if (
      ingredients.flour >= requiredIngredients.flour &&
      ingredients.sugar < requiredIngredients.sugar
    ) {
      return 'You really want that cake?';
    } else {
      return '';
    }
  };

  return (
    <div className="App">
      {ingredients.apples === 0 && ingredients.chocolate === 0 && (
        <div className="marquee">
          <p>
            do not click the button &nbsp; do not click the button &nbsp; do not click the button &nbsp;
          </p>
        </div>
      )}

      {(ingredients.apples > 0 ||
        ingredients.chocolate > 0 ||
        ingredients.flour > 0 ||
        ingredients.sugar > 0) && (!showCake) && (
        <div className="top-bar">
          <div className="item">
            <img src={coinImage} alt="Coins" className="icon" /> {coins}
          </div>
          <div className="item">
            <img src={appleImage} alt="Apples" className="icon" /> {ingredients.apples}
          </div>
          <div className="item">
            <img src={chocolateImage} alt="Chocolate" className="icon" />{' '}
            {ingredients.chocolate}
          </div>
          <div className="item">
            <img src={flourImage} alt="Flour" className="icon" /> {ingredients.flour}
          </div>
          <div className="item">
            <img src={sugarImage} alt="Sugar" className="icon" /> {ingredients.sugar}
          </div>
        </div>
      )}

      <div className="content">
        {showCake ? (
          <>
            <h1>STARTUP</h1>
            <h2>November 12</h2>
            <img src={cakeImage} alt="Cake" className="cake-image" />
            {/* <h2>You baked a cake!</h2> */}
          </>
        ) : ingredients.apples >= 1 ? (
          <h1 className="red-label">{getMessage()}</h1>
        ) : (
          <>
            <h1>STARTUP</h1>
            <h2>November 12</h2>
          </>
        )}

        {!showCake && (
          <>
            <h3>You have {coins} coins</h3>
            <button onClick={handleClick}>Do not click</button>

            {coins >= 100 && ingredients.apples < requiredIngredients.apples && (
              <div className="buy-ingredient">
                <h2>You can buy an apple!</h2>
                <button onClick={() => buyIngredient('apples', 100)}>
                  Buy apple for 100 coins
                </button>
              </div>
            )}

            {ingredients.apples >= requiredIngredients.apples &&
              coins >= 200 &&
              ingredients.chocolate < requiredIngredients.chocolate && (
                <div className="buy-ingredient">
                  <h2>You can buy chocolate!</h2>
                  <button onClick={() => buyIngredient('chocolate', 200)}>
                    Buy chocolate for 200 coins
                  </button>
                </div>
              )}

            {ingredients.chocolate >= requiredIngredients.chocolate &&
              coins >= 300 &&
              ingredients.flour < requiredIngredients.flour && (
                <div className="buy-ingredient">
                  <h2>You can buy flour!</h2>
                  <button onClick={() => buyIngredient('flour', 300)}>
                    Buy flour for 300 coins
                  </button>
                </div>
              )}

            {ingredients.flour >= requiredIngredients.flour &&
              coins >= 400 &&
              ingredients.sugar < requiredIngredients.sugar && (
                <div className="buy-ingredient">
                  <h2>You can buy sugar!</h2>
                  <button onClick={() => buyIngredient('sugar', 400)}>
                    Buy sugar for 400 coins
                  </button>
                </div>
              )}

            {canMakeCake() && (
              <div className="buy-ingredient">
                <h2>You have all the ingredients!</h2>
                <button onClick={makeCake}>Make a cake</button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="coin-container">
        {animatedCoins.map((coinId) => (
          <img
            key={coinId}
            src={coinImage}
            alt="Coin"
            className="coin-animation"
            onAnimationEnd={() => handleAnimationEnd(coinId)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
