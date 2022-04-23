import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function Task({ checked = false, name = "", onCheck = () => {}, onDelete = () => {} }) {
  const [windowWidth, setWindowWidth] = useState(1500);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    setWindowWidth(window.innerWidth);
  }, []);

  const [done, setDone] = useState(false);

	const fadeDuration = 300;

  return (
    <div
      className="flex items-center m-2 p-2 bg-slate-200 rounded-xl transition-opacity"
      style={{ width: Math.min(windowWidth - 10, 500), opacity: done ? 0 : 1, transitionDuration: `${fadeDuration}ms` }}
    >
      <button
        className="mr-2 px-2 bg-slate-300 rounded-md cursor-pointer"
        onClick={() => {
          setDone(true);
					setTimeout(() => {
						onDelete();
					}, fadeDuration);
        }}
      >
        Done
      </button>
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>
      <div className="flex items-center gap-2 ml-auto mr-1">
        <button
          className="flex justify-center items-center w-6 h-6 hover:bg-slate-300 border-2 border-slate-300 rounded-md cursor-pointer"
          title="Mark as done"
          onClick={() => {
            onCheck();
          }}
        >
          {checked ? <Fa icon={faCheck} /> : null}
        </button>
        <button className="text-lg transition-transform" onClick={onDelete}>
          <Fa icon={faTrashCan} />
        </button>
      </div>
    </div>
  );
}
