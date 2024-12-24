import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import { useMemo, useState } from "react";


interface Letter {
  id: number;
  letter: string;
  audio: string;
  img: string;
}

const letters: Letter[] = [
  {
      id: 1,
      letter: "A",
      audio: "./audio/letters/a.wav",
      img: "./img/letters/a.jpg",
  },
  {
      id: 2,
      letter: "B",
      audio: "./audio/letters/b.wav",
      img: "./img/letters/b.webp",
  },
  {
      id: 3,
      letter: "C",
      audio: "./audio/letters/c.wav",
      img: "./img/letters/c.webp",
  },
];


interface DraggableLetterProps {
  letter: string;
  id: number;
}

const DraggableLetter = ({ letter, id }: DraggableLetterProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "letter",
    item: { id, letter },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        padding: "10px",
        backgroundColor: "#FFDDC1",
        border: "1px solid #FFAB76",
        margin: "10px",
        width: "50px",
        height: "50px",
        fontSize: "30px",
        color: "black",
        borderRadius: "5px",
      }}
    >
      {letter}
    </div>;
};

interface DropTargetProps {
  expectedLetter: Letter;
  onDrop: (item: Letter) => void;
  matchedLetter: string;
  onClick: (letter: Letter) => void;
}

const DropTarget = ({ expectedLetter, onDrop, matchedLetter, onClick }: DropTargetProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "letter",
    drop: (item: Letter) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      onClick={() => onClick(expectedLetter)}
      style={{
        height: "200px",
        width: "200px",
        margin: "10px",
        border: `2px dashed ${matchedLetter ? "green" : "#000"}`,
        backgroundColor: isOver ? "#F0F8FF" : "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        fontSize: "50px",
        cursor: "pointer",
      }}
    >
      <img
        src={expectedLetter.img}
        alt={expectedLetter.letter}
        style={{ width: "150px", height: "150px", objectFit: "contain" }}
      />
      {matchedLetter || "?"}
    </div>
  );
};

const App = () => {
  const [matches, setMatches] = useState<any>({});

  const audios: any = useMemo(
      () => letters.map((letter) => ([ letter.id, new Audio(letter.audio) ]))
          .reduce((acc, curr) => ({...acc, [curr[0].toString()]: curr[1]}), {}),
      []
  );

  const unmatchedLetters: any = useMemo(
    () => letters.filter((letter) => !matches[letter.letter]),
    [matches]
  );

  const handleDrop = (item: Letter, expectedLetter: string) => {
    if (item.letter === expectedLetter) {
      setMatches((prev: any) => ({
        ...prev,
        [expectedLetter]: item.letter,
      }));
      audios[item.id].play();
    }
  };

  const handleLetterClick = (letter: string) => {
    setMatches((prev: any) => ({
      ...prev,
      [letter]: null,
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1>Alphabet Drag-and-Drop</h1>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          {unmatchedLetters.map((letter: Letter) => (
            <DraggableLetter key={letter.id} id={letter.id} letter={letter.letter} />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {letters.map((letter) => (
            <DropTarget
              key={letter.id}
              expectedLetter={letter}
              matchedLetter={matches[letter.letter]}
              onDrop={(item) => handleDrop(item, letter.letter)}
              onClick={() => handleLetterClick(letter.letter)}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
