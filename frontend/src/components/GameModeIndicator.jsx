import "../css/GameModeIndicator.css";
import "../css/Header.css";

const GameModeIndicator = ({ gameMode }) => {
  if (!gameMode) return null;

  return (
    <div className={`game-mode-indicator ${gameMode}`}>
      {gameMode === "easy" ? "Easy Mode" : "Hard Mode"}
    </div>
  );
};

export default GameModeIndicator;
