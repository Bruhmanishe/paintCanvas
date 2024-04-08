"use strict";

const wrapper = document.querySelector(".wrapper");
const colorInput = document.getElementById("colorInput");
const colorBtn = document.getElementById("colorBtn");
const canvasDiv = document.querySelector(".paint__canvas");

const switcherLine = document.querySelector(".paint__size_line");
const switcher = document.querySelector(".paint__size_switch");

const clearBtn = document.getElementById("clearBtn");
const eraseBtn = document.getElementById("eraseBtn");
const downloadBtn = document.getElementById("downloadBtn");

let width = canvasDiv.offsetWidth;
let height = canvasDiv.offsetHeight;
let size = 5;
let backColor = "white";
let color;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

class Bounds {
  constructor(el) {
    this.left = el.getBoundingClientRect().left + scrollX;
    this.right = el.getBoundingClientRect().left + el.offsetWidth + scrollX;
    this.top = el.getBoundingClientRect().top + scrollY;
    this.bottom = el.getBoundingClientRect().top + el.offsetHeight + scrollY;
  }
}

window.onload = () => {
  canvasDiv.insertAdjacentElement("beforeend", canvas);
  canvas.classList.add("paint__canvas_board");
  canvas.setAttribute("width", `${width}px`);
  canvas.setAttribute("height", `${height}px`);

  ctx.fillStyle = backColor;
  ctx.fillRect(0, 0, 1000, 1000);
};

switcher.addEventListener("mousedown", (e) => {
  switcherLine.addEventListener("mousemove", moveSlider);
});

colorBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  colorInput.click();
  window.addEventListener("click", function setColor(e) {
    color = colorInput.value;
    colorBtn.style.backgroundColor = color;
    window.removeEventListener("click", setColor);
  });
});
canvasDiv.addEventListener("mousedown", (e) => {
  if (e.target == canvas) {
    canvas.addEventListener("mousemove", paintBoard);
  }
});

clearBtn.addEventListener("click", resetBoard);

eraseBtn.addEventListener("click", erase);

downloadBtn.addEventListener("click", downloadImage);

function paintCanvas(x, y, radius) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

function paintBoard(e) {
  let canvasBounds = new Bounds(canvasDiv);
  paintCanvas(e.pageX - canvasBounds.left, e.pageY - canvasBounds.top, size);
  window.addEventListener("mouseup", function remove() {
    canvas.removeEventListener("mousemove", paintBoard);
    window.removeEventListener("mouseup", remove);
  });
}

function moveSlider(e) {
  const lineBounds = new Bounds(switcherLine);
  const switcherBounds = new Bounds(switcher);
  switcher.style.top = `${e.pageY - lineBounds.top}px`;

  if (
    switcherBounds.top >= lineBounds.top + 5 &&
    switcherBounds.bottom <= lineBounds.bottom - 5
  ) {
    switcher.style.top = `${e.pageY - lineBounds.top}px`;
  } else {
    if (switcherBounds.top < lineBounds.top + 5) {
      switcher.style.top = `${0 + 10}px`;
    }
    if (switcherBounds.bottom > lineBounds.bottom - 5) {
      switcher.style.top = `${switcherLine.offsetHeight - 15}px`;
    }
  }
  window.addEventListener("mouseup", (e) => {
    switcherLine.removeEventListener("mousemove", moveSlider);
    setSize();
  });
}

function setSize() {
  const lineBounds = new Bounds(switcherLine);
  const switcherBounds = new Bounds(switcher);

  size = switcherBounds.top - lineBounds.top;
}

function resetBoard() {
  ctx.fillStyle = backColor;
  ctx.fillRect(0, 0, 1000, 1000);
}

function erase() {
  color = backColor;
}

function downloadImage() {
  const canvasUrl = canvas.toDataURL("image/png");
  const linkToDownload = document.createElement("a");
  linkToDownload.setAttribute("href", canvasUrl);
  linkToDownload.setAttribute("download", "");
  linkToDownload.click();
}
