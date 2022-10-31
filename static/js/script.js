const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

// Item Lists
const listOfColumns = document.querySelectorAll(".drag-item-list");

const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];

let listArrays = [];

// Drag Functionality
let currentlyDraggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = [
      "Read for test",
      "Release the course",
      "Sit back and relax",
    ];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["At the gym", "Walk the dog"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  // using forloop
  // for (let i = 0; i < listArrays.length; i++) {
  //   localStorage.setItem(`${arrayNames[i]}items`, JSON.stringify(listArrays[i]));
  // }

  // using foreach
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log("columnEl:", columnEl);
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);
  // console.log("\n");

  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  // make element draggable
  listEl.draggable = true;
  // ondragstart: specifies what happens when the item is dragged
  listEl.setAttribute("ondragstart", "beginDrag(event)");
  // append to a specific column
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  // reset column list
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });

  // Progress Column
  // reset column list
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });

  // Complete Column
  // reset column list
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });

  // On Hold Column
  // reset column list
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });

  // Run getSavedColumns only once, Update Local Storage
}

/**
 * Required by 'ondragstart' event: specifies what happens when an element is dragged
 *
 * This func is triggered when the list item is clicked/dragged
 * */

function beginDrag(e) {
  currentlyDraggedItem = e.target;
  console.log("Dragged Item: ", currentlyDraggedItem);
}

/**
 * Required by the 'ondragenter' event: fires when a draggable element or text selection enters a valid drop target
 *
 * In this case, it fires when an item enters the column area
 * listOfColumns: a nodelist of all the Columns
 * colIndex: the index of the column over which the item is dragged
 */
function dragEnter(colIndex) {
  // add color & padding when an item enters the column area
  listOfColumns[colIndex].classList.add("over");
  // set currentColumn, i.e 0, 1, 2, & 3
  currentColumn = colIndex;
  console.log("listOfColumns: ", listOfColumns[colIndex]);
}

/**
 * Required by 'ondragover' event: specifies where the dragged data can be dropped
 *
 * This func allows items to the dropped in a Column
 * Without this function preventing default, the endDrag function won't be triggered when a drop is made
 * Added to the 'ul' tag
 */
function allowDrop(e) {
  // data/elements cannot be dropped in other elements
  e.preventDefault();
  // console.log("Allow Drop item: ", e.target);
}

/**
 * Dropping an item in a column
 *
 * This func is trigged when an item is dropped
 * Added to the 'ul' tag
 */
function endDrag(e) {
  // data/elements cannot be dropped in other elements
  e.preventDefault();
  // remove color & padding from all columns when an item is dropped in a column area
  listOfColumns.forEach((column) => {
    column.classList.remove("over");
    // console.log("Column: ", column);
  });

  // Add new item to column
  const parentEl = listOfColumns[currentColumn];
  parentEl.appendChild(currentlyDraggedItem);
  console.log("parentEl: ", parentEl);
  // console.log("currentColumn: ", currentColumn);

  // console.log("Dropped item: ", e.target);
}

// On load
updateDOM();
