import { tasksReducer, TasksStateType, tasksThunks } from "features/todolists-list/tasks/tasks.reducer";
import { TaskPrioritiesObject, TaskStatusesObj, TaskType } from "common/api/tasks-api";
import { todoListThunks } from "features/todolists-list/todolists/todolists.reducer";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatusesObj.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioritiesObject.Low,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatusesObj.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioritiesObject.Low,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatusesObj.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioritiesObject.Low,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatusesObj.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioritiesObject.Low,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatusesObj.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioritiesObject.Low,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatusesObj.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPrioritiesObject.Low,
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const action = tasksThunks.removeTaskTC.fulfilled({ taskId: "2", todolistId: "todolistId2" },"requestId",{ taskId: "2", todolistId: "todolistId2" });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every((t) => t.id !== "2")).toBeTruthy();
});

test("correct task should be added to correct array", () => {
    const task: TaskType  = {
        todoListId: "todolistId2",
        title: "juice",
        status: TaskStatusesObj.New,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: TaskPrioritiesObject.Low,
        startDate: "",
        id: "id exists",
      } 

  const action = tasksThunks.addTaskTC.fulfilled({task},'requestId',{ todolistId:"todolistId2", title:"juice" });

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juice");
  expect(endState["todolistId2"][0].status).toBe(TaskStatusesObj.New);
});

test("status of specified task should be changed", () => {

  const action = tasksThunks.updateTaskTC.fulfilled({
    taskId: "2",
    model: { status: TaskStatusesObj.New },
    todolistId: "todolistId2",
  },'',{
    taskId: "2",
    domainModel: { status: TaskStatusesObj.New },
    todolistId: "todolistId2",
  })

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].status).toBe(TaskStatusesObj.Completed);
  expect(endState["todolistId2"][1].status).toBe(TaskStatusesObj.New);
});

test("title of specified task should be changed", () => {

  const action = tasksThunks.updateTaskTC.fulfilled({
    taskId: "2",
    model: { title:"yogurt" },
    todolistId: "todolistId2",
  },'',{
    taskId: "2",
    domainModel: { title:"yogurt"},
    todolistId: "todolistId2",
  })

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("yogurt");
  expect(endState["todolistId2"][0].title).toBe("bread");
});

test("new array should be added when new todolist is added", () => {
  const action = todoListThunks.addTodolistTC.fulfilled({todolist:{
    id: "blabla",
    title: "new todolist",
    order: 0,
    addedDate: "",
  }},'','todolistTitle')

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("propertry with todolistId should be deleted", () => {
  const action = todoListThunks.removeTodolistTC.fulfilled('todolistId2','',{ id: 'todolistId2' })

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});

test("empty arrays should be added when we set todolists", () => {

  const action = todoListThunks.fetchTodolistsTC.fulfilled([
    { id: "1", title: "title 1", order: 0, addedDate: "" },
    { id: "2", title: "title 2", order: 0, addedDate: "" },
  ],'')


  const endState = tasksReducer({}, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(2);
  expect(endState["1"]).toBeDefined();
  expect(endState["2"]).toBeDefined();
});

test("tasks should be added for todolist", () => {
  const action = tasksThunks.fetchTasksTC.fulfilled( {tasks: startState["todolistId1"],todolistId: "todolistId1"},'',{ todolistId: "todolistId1"})

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(0);
});
