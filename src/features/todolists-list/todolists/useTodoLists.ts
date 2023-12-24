import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useCallback } from "react";
import { FilterValuesType, todoListThunks, todolistsActions } from "./todolists.reducer";


export const useTodoLists = () => {
    const dispatch = useAppDispatch();

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
        dispatch(todolistsActions.changeTodolistFilter({ id, filter }));
      }, [dispatch]);
    
      const removeTodolist = useCallback(function (id: string) {
        dispatch(todoListThunks.removeTodolistTC({id}));
      }, [dispatch]);
    
      const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(todoListThunks.changeTodolistTitleTC({id, title}));
      }, [dispatch]);
    
      const addTodolist = useCallback(
        (title: string) => { 
          const res = dispatch(todoListThunks.addTodolistTC(title));
          return res
        },[dispatch]);


    return {changeFilter,removeTodolist,changeTodolistTitle,addTodolist}
}