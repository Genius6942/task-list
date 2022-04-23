import Head from "next/head";
import { useEffect, useState } from "react";
import Task from "/components/Task";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd-next";
import ReactTooltip from "react-tooltip";

export default function Home() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Task 1",
      checked: false,
    },
  ]);
	const [oldTasks, setOldTasks] = useState(tasks);

  const [taskId, setTaskId] = useState(0);

	const updateTasks = (newTasks) => {
		newTasks = sortTasks(newTasks);
		setOldTasks(tasks);
		setTasks(newTasks);
    setTaskId(smallestAvailibleNumInArray(newTasks.map(task => task.id)));
	};

  /**
   * @param {number[]} arr
   * @returns {number}
   */
  const smallestAvailibleNumInArray = arr => {
    arr = arr.sort((a, b) => a - b);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== i) {
        return i;
      }
    }
    return arr.length;
  };

  /**
   *
   * @param {} tasks
   * @returns {tasks}
   */
  const sortTasks = tasks => {
    return tasks.sort((a, b) => {
      if (!a.checked && b.checked) {
        return -1;
      } else if (a.checked && !b.checked) {
        return 1;
      }
    });
  };

  let [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    setTasks(savedTasks ? sortTasks(tasks) : []);
    console.log("loaded");
    setLoaded(true);
    window.addEventListener("unload", () => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });
  }, []);

  useEffect(() => {

    if (loaded) {
      console.log(JSON.stringify(tasks));
      console.log("hey bois");
    }
  }, [tasks]);

  let nameInput = null;

  const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        {/* title */}
        <div className="my-3 text-2xl font-bold text-center">
          <FontAwesomeIcon icon={faClipboardList} />
          <span className="whitespace-pre"> </span>
          Task List!
        </div>

        {/* create task button */}
        <form
          className="flex justify-center"
          onSubmit={e => {
            e.preventDefault();
            const originalData = [...new FormData(e.target).entries()];
            const data = {};

            for (const [key, value] of originalData) {
              data[key] = value;
            }

            if (data.name !== "") {
              const newTasks = [...tasks];
              newTasks.push({
                ...data,
                checked: false,
                id: taskId,
              });

              updateTasks(newTasks);

              nameInput.value = "";
            }
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Task name"
            className="w-96 p-2 mr-2 border-2 border-gray-400 rounded-md"
            ref={input => (nameInput = input)}
          />
          <button
            className="flex justify-center items-center mr-2 p-3 bg-slate-200 hover:bg-slate-300 border-2 rounded-full cursor-pointer whitespace-pre"
            title="Create a new task"
          >
            Create <FontAwesomeIcon icon={faPlus} />
          </button>
        </form>

        {/* tasks list */}
        {loaded ? (
          <DragDropContext
            onDragEnd={result => {
              if (!result.destination) {
                return;
              }

              const items = Array.from(tasks);
              const [reorderedItem] = items.splice(result.source.index, 1);
              items.splice(result.destination.index, 0, reorderedItem);

							updateTasks(items);
            }}
          >
            <Droppable droppableId="droppable">
              {provided => (
                <div
                  className="droppable flex flex-col items-center"
                  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr)" }}
                  {...provided.droppableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
									<ReactTooltip place="bottom" type="dark" effect="solid" delayHide={500}/>
                  {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Task
                              name={task.name}
                              checked={task.checked}
                              onCheck={() => {
                                const newTasks = [...tasks];
                                newTasks[index].checked = !newTasks[index].checked;

                                updateTasks(newTasks);
                              }}
                              onDelete={() => {
                                const newTasks = [...tasks];
                                newTasks.splice(index, 1);

                                updateTasks(newTasks);
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <div className="text-center text-gray-500">
                      <p>You have no tasks!</p>
                      <p>Add a new task by clicking the button below.</p>
                    </div>
                  )}
									{provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          "loading"
        )}

        {/* add a new icon */}
        <button
          className="flex justify-center items-center w-10 h-10 bg-slate-200 hover:bg-slate-300 fixed right-5 bottom-5 rounded-full"
          onClick={() => setCreateModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>

        {/* modal for adding new task */}
        {createModalOpen ? (
          <div
            className="flex justify-center items-center fixed bottom-0 left-0 w-full h-full bg-[rgba(0,0,0,.5)]"
            style={{ backdropFilter: "blur(5px)", display: createModalOpen ? "flex" : "none" }}
            onClick={e => {
              if (e.target == e.currentTarget) setCreateModalOpen(false);
            }}
          >
            <div className="w-1/2 h-1/2  bg-white rounded-3xl">
              <div className="flex w-full p-4 pb-2 font-bold text-2xl border-b-2 border-black">
                Create a new task
                <button
                  className="flex justify-center items-center w-10 h-10 ml-auto bg-slate-200 hover:bg-slate-300 rounded-full"
                  onClick={() => setCreateModalOpen(false)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const originalData = [...new FormData(e.target).entries()];
                  const data = {};

                  for (const [key, value] of originalData) {
                    data[key] = value;
                  }

                  if (data.name !== "") {
                    const newTasks = [...tasks];
                    newTasks.push({
                      ...data,
                      checked: false,
                      taskId,
                    });

                    updateTasks(newTasks);

                    setCreateModalOpen(false);
                  }
                }}
                className="p-5"
              >
                <input
                  type="text"
                  name="name"
                  className="block w-full p-3 pl-1 text-xl border-2 border-black focus-visible:rounded-lg transition-all"
                  placeholder="Task Name"
                />

                <input
                  type="submit"
                  value="Create"
                  className="mt-3 p-3 bg-slate-200 hover:bg-slate-300 rounded-2xl cursor-pointer shadow-2xl"
                />
              </form>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
