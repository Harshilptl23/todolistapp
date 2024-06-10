import './App.css';
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete } from "react-icons/ai";
import { FaCheck, FaEdit } from "react-icons/fa";


function App() {
  const [IsCompleteScreen, setCompleteScreen] = useState(false);
  const [AllTodos, setAllTodos] = useState([]);
  const [newTitle, setnewTitle] = useState("");
  const [newDescription, setnewDescription] = useState("");
  const [CompleteTodo, setCompleteTodo] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");

  // hadlig for adding todo list
  const handleAddTodo = () => {
    if (!newTitle || !newDescription) {
      alert("Please enter both title and description");
      return;
    }


    let newTodoList = {
      title: newTitle,
      description: newDescription
    };

    let updateTodoArr = [...AllTodos];
    updateTodoArr.push(newTodoList);
    setAllTodos(updateTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updateTodoArr));

    // Clear input fields
    setnewTitle('');
    setnewDescription('');

  };
  // handle delete todo
  const handleDeleTodo = index => {
    if (IsCompleteScreen) {
      let reducedCompleteTodo = [...CompleteTodo];
      reducedCompleteTodo.splice(index, 1); // Remove one item at the specified index
      setCompleteTodo(reducedCompleteTodo);
      localStorage.setItem('completeTodos', JSON.stringify(reducedCompleteTodo));
    } else {
      let reduceTodo = [...AllTodos];
      reduceTodo.splice(index, 1); // Remove one item at the specified index
      setAllTodos(reduceTodo);
      localStorage.setItem('todolist', JSON.stringify(reduceTodo));
    }
  };




  //  handle complete tab 
  const handleCompleteTodo = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...AllTodos[index],
      completedOn: completedOn,
      completed: true
    };

    let updatedCompletedArr = [...CompleteTodo];
    updatedCompletedArr.push(filteredItem);
    setCompleteTodo(updatedCompletedArr)
    handleDeleTodo(index, false);
    localStorage.setItem('completeTodos', JSON.stringify(updatedCompletedArr));

  };

  const handleEdit = (index, item) => {
    console.log(index);
    setCurrentEdit(index);
    setCurrentEditedItem(item);

  }

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev)=>{
      return{...prev,title:value}
    })
  }

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev)=>{
      return{...prev,description:value}
    })
  }

  const handleUpdateTodo=()=>{
    let newTodo=[...AllTodos];
    newTodo[currentEdit]=currentEditedItem;
    setAllTodos(newTodo);
    setCurrentEdit("");
  }


  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem(`todolist`));
    let savedCompleteTodo = JSON.parse(localStorage.getItem('completeTodos'));
    if (savedTodo) {
      setAllTodos(savedTodo);
    }
    if (savedCompleteTodo) {
      setCompleteTodo(savedCompleteTodo);

    }
  }, [])

  return (

    <div className='App'>
      <h1>My Todos</h1>

      <div className='todo-wrapper'>
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e) => setnewTitle(e.target.value)}
              placeholder="What's the task title?" />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input type="text" value={newDescription} onChange={(e) => setnewDescription(e.target.value)} placeholder="What's the task Description?" />
          </div>
          <div className="todo-input-item">
            <button type='button' className="primary-btn" onClick={handleAddTodo}>Add</button>
          </div>
        </div>

        <div className="btn-area">
          <button className={`secondary-btn ${!IsCompleteScreen && 'active'}`} onClick={() => setCompleteScreen(false)}>Todo</button>
          <button className={`secondary-btn ${IsCompleteScreen && 'active'}`} onClick={() => setCompleteScreen(true)}>Complete</button>
        </div>
        <div className="todolist">

          {!IsCompleteScreen && AllTodos.map((item, index) => {
            if (currentEdit === index) {
              return (
                <div className="edit-wrapper" key={index}>
                  <input type="text" placeholder='Updated Title' onChange={(e) => handleUpdateTitle(e.target.value)}
                    value={currentEditedItem.title} />
                  <textarea placeholder='Updated Description' onChange={(e) => handleUpdateDescription(e.target.value)}
                    value={currentEditedItem.description} rows={4} />
                  <button type='button' className="primary-btn" onClick={handleUpdateTodo}>Update</button>

                </div>
              )
            }
            else {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div>
                    <AiOutlineDelete className='icon' onClick={() => handleDeleTodo(index)} title='delete?' />
                    <FaCheck className='check-icon' onClick={() => handleCompleteTodo(index)} title='complete?' />
                    <FaEdit className='check-icon' onClick={() => handleEdit(index, item)} title='Edit?' />

                  </div>
                </div>
              )
            }
          })}


          {IsCompleteScreen && CompleteTodo.map((item, index) => {
            return (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><small>Completed on:{item.completedOn}</small></p>
                </div>

                <div>
                  <AiOutlineDelete className='icon' onClick={() => handleDeleTodo(index)} title='delete?' />
                </div>
              </div>
            )
          })}






        </div>
      </div>
    </div>



  );
}

export default App;
