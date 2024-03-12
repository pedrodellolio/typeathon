import { useSearchParams } from "react-router-dom";
import { wordsets } from "../models/wordset";
type Props = {
  left: number;
  restartTest: () => void;
};

function Toolbar(props: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const timerStart = searchParams.get("start") ?? "30";
  const language = searchParams.get("lang") ?? "0";

  return (
    <div className="flex flex-col mb-10 w-full bg-gray-100 rounded-md text-sm text-gray-500 font-medium dark:bg-gray-800 dark:text-gray-400">
      <div className="px-5 py-1 flex flex-row items-center justify-between gap-4">
        <p className="">{wordsets[parseInt(language)].replace("_", " ")}</p>
        <ul className="flex flex-row items-center gap-6">
          <li>
            <button
              onClick={() => {
                setSearchParams((state) => {
                  state.set("start", "15");
                  return state;
                });
              }}
              className={`px-2 py-1 ${
                timerStart === "15" && "text-blue-500 font-bold"
              }`}
            >
              15s
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setSearchParams((state) => {
                  state.set("start", "30");
                  return state;
                });
              }}
              className={`px-2 py-1 ${
                timerStart === "30" && "text-blue-500 font-bold"
              }`}
            >
              30s
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setSearchParams((state) => {
                  state.set("start", "60");
                  return state;
                });
              }}
              className={`px-2 py-1 ${
                timerStart === "60" && "text-blue-500 font-bold"
              }`}
            >
              60s
            </button>
          </li>
        </ul>
        <button
          onClick={props.restartTest}
          className="self-start border border-gray-300 px-2 py-1 rounded-md dark:border-gray-600"
        >
          <i className="ri-loop-right-line"></i>
        </button>
      </div>
      <div
        className="h-1 bg-blue-500 transition-all duration-1000"
        style={{
          width: `${(props.left / parseInt(timerStart)) * 100}%`,
        }}
      />
    </div>
  );
}

export default Toolbar;
