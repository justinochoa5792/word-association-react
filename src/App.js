import { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  const [chosenLevel, setChosenLevel] = useState(null);
  const [words, setWords] = useState(null);
  const [clicked, setClicked] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [score, setScore] = useState(0);

  const getRandomWords = () => {
    const options = {
      method: "GET",
      url: "https://twinword-word-association-quiz.p.rapidapi.com/type1/",
      params: { level: chosenLevel, area: "sat" },
      headers: {
        "x-rapidapi-host": "twinword-word-association-quiz.p.rapidapi.com",
        "x-rapidapi-key": process.env.REACT_APP_API_KEY,
      },
    };

    Axios.request(options)
      .then(function (response) {
        setWords(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    if (chosenLevel) {
      return getRandomWords();
    }
  }, [chosenLevel]);

  const checkAnswer = (option, optionIndex, correctAnswer) => {
    if (optionIndex == correctAnswer) {
      setCorrectAnswers([...correctAnswers, option]);
      setScore(score + 1);
    }
    setClicked([...clicked, option]);
  };

  return (
    <div className="App">
      {!chosenLevel && (
        <div className="level-selector">
          <h1>Word Association</h1>
          <p>Select Level to Start</p>
          <select
            name="levels"
            value={chosenLevel}
            onChange={(e) => setChosenLevel(e.target.value)}
          >
            <option value={null}>Select a Level</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>
        </div>
      )}
      {chosenLevel && words && (
        <>
          <div className="question-area">
            <h1>Welcome to level: {chosenLevel}</h1>
            <h3>Score: {score}</h3>
            <div className="questions">
              {words.quizlist.map((question) => {
                return (
                  <div className="question-box">
                    {question.quiz.map((tip) => {
                      return <p>{tip}</p>;
                    })}
                    <div className="question-buttons">
                      {question.option.map((option, optionIndex) => {
                        return (
                          <div key={optionIndex} className="question-button">
                            <button
                              disabled={clicked.includes(option)}
                              onClick={() =>
                                checkAnswer(
                                  option,
                                  optionIndex + 1,
                                  question.correct
                                )
                              }
                            >
                              {option}
                            </button>
                            {correctAnswers.includes(option) && <p>Correct!</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setChosenLevel(null)}>Go Back</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
