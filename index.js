const expandColors = (colors) => {
  let ans = [];
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors[i][1]; j++) {
      ans.push(colors[i][0]);
    }
  }
  return ans;
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let canvas = document.getElementById("grid");
let parent = document.getElementById("canvasDiv");
let ctx = canvas.getContext("2d");

canvas.width = parent.offsetWidth;
canvas.height = parent.offsetHeight;

let w = canvas.width;
let h = canvas.height;

let res_down = 2;

let OCEAN_4 = new Material([26, 136, 157, 255]);
let OCEAN_3 = new Material([52, 149, 168, 255]);
let OCEAN_2 = new Material([77, 163, 179, 255]);
let OCEAN_1 = new Material([103, 176, 190, 255]);

let BEACH_5 = new Material([226, 192, 165, 255]);
let BEACH_4 = new Material([206, 172, 145, 255]);
//BEACH_4.addColor([226, 192, 165, 255], 0.3);
let BEACH_3 = new Material([194, 164, 135, 255]);
let BEACH_2 = new Material([154, 124, 95, 255]);
let BEACH_1 = new Material([91, 63, 40, 255]);

let GRASS_7 = new Material([0, 100, 25, 255]);
let GRASS_6 = new Material([0, 125, 25, 255]);
let GRASS_5 = new Material([0, 150, 25, 255]);
let GRASS_4 = new Material([0, 175, 25, 255]);
let GRASS_3 = new Material([0, 200, 25, 255]);
let GRASS_2 = new Material([0, 225, 25, 255]);
let GRASS_1 = new Material([0, 250, 25, 255]);

let STONE_7 = new Material([185, 182, 173, 255]);
let STONE_6 = new Material([165, 162, 153, 255]);
let STONE_5 = new Material([145, 142, 133, 255]);
let STONE_4 = new Material([125, 122, 113, 255]);
let STONE_3 = new Material([105, 102, 93, 255]);
let STONE_2 = new Material([85, 82, 73, 255]);
let STONE_1 = new Material([255, 255, 255, 255]);

let defaultColors = [
  [OCEAN_4, 6],
  [OCEAN_3, 3],
  [OCEAN_2, 3],
  [OCEAN_1, 3],

  [BEACH_5, 1],
  //[BEACH_4, 1],
  [BEACH_3, 1],
  [BEACH_2, 1],
  [BEACH_1, 1],

  [GRASS_7, 3],
  [GRASS_6, 2],
  [GRASS_5, 2],
  [GRASS_4, 2],
  [GRASS_3, 2],
  [GRASS_2, 2],
  [GRASS_1, 2],

  [STONE_7, 1],
  [STONE_6, 1],
  [STONE_5, 1],
  [STONE_4, 1],
  [STONE_1, 1],
  [STONE_1, 1],
  [STONE_1, 2],
];

colors = expandColors(defaultColors);
let cmap = createCircleMap();

function start() {
  document.getElementById("loadingStatus").textContent = "Loading...";
  setTimeout(generate, 100, false);
}

function startRandom() {
  document.getElementById("loadingStatus").textContent = "Loading...";
  setTimeout(generate, 100, true);
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function addColorPicker() {
  let container = document.createElement("div");

  let color_input = document.createElement("input");
  color_input.type = "color";

  let weight_input = document.createElement("input");
  weight_input.type = "text";
  weight_input.value = "1";

  let delete_button = document.createElement("button");
  delete_button.textContent = "X";
  delete_button.onclick = removeColorFromUser;

  container.appendChild(color_input);
  container.appendChild(weight_input);
  container.appendChild(delete_button);

  let element = document.getElementById("colorPicker");
  element.appendChild(container);
}

function getColorsFromUser() {
  let element = document.getElementById("colorPicker");
  let colors = [];
  for (let i = 0; i < element.children.length; i++) {
    let child = element.children[i];

    let color = hexToRGB(child.children[0].value);
    let weight = child.children[1].value;

    colors.push([new Material(color), parseInt(weight)]);
  }
  return expandColors(colors);
}

//credit -> https://css-tricks.com/converting-color-spaces-in-javascript/
function hexToRGB(h) {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return [Number(r), Number(g), Number(b)];
}

function createCircleMap() {
  let isReal = false;
  let ret = [];
  let hl = h / res_down + 1;
  let wl = w / res_down + 1;
  let max_dist = distance(wl, hl, wl / 2, hl / 2);
  for (let x = 0; x < Math.floor(wl); x++) {
    let row = [];
    for (let y = 0; y < Math.floor(hl); y++) {
      if (isReal) row.push(distance(x, y, wl / 2, hl / 2) / max_dist);
      else row.push(0);
    }
    ret.push(row);
  }
  return ret;
}

function removeColorFromUser(e) {
  let parent = e.target.parentElement;
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  parent.remove();
}

function generate(randomize) {
  if (document.getElementById("custom_color_checkbox").checked)
    colors = getColorsFromUser();
  else colors = expandColors(defaultColors);
  var loadingElem = document.getElementById("loadingStatus");
  ctx.reset();
  ctx.clearRect(0, 0, w, h);
  ctx.scale(res_down, res_down);
  let imgData = ctx.createImageData(
    Math.floor(w / res_down),
    Math.floor(h / res_down)
  );
  let data = [];

  if (randomize == true) noise.seed(Math.random());

  let noiseArr = [];
  let upper = -Infinity;
  let lower = Infinity;
  let scale = document.getElementById("zoom").value / 1000;
  let layers = document.getElementById("octaves").value;

  let persistance = document.getElementById("persistance").value / 100;
  let roughness = document.getElementById("roughness").value / 100;

  let simplexProp = document.getElementById("simplexProp").value / 100;

  for (let y = 0; y < Math.floor(h / res_down); y++) {
    for (let x = 0; x < Math.floor(w / res_down); x++) {
      let rand = 0;
      let freq = 1;
      let fac = 1;

      for (let i = 0; i < layers; i++) {
        let nx = x * freq + i * 0.72354;
        let ny = y * freq + i * 0.72354;

        rand += noise.simplex2(nx * scale, ny * scale) * fac * simplexProp;
        rand += noise.perlin2(nx * scale, ny * scale) * fac * (1 - simplexProp);

        freq *= persistance;
        fac *= roughness;
      }
      rand *= 1 - cmap[x][y];
      noiseArr.push(rand);

      upper = Math.max(upper, rand);
      lower = Math.min(lower, rand);
    }
  }

  let factor = Math.ceil(255 / colors.length);

  for (let i = 0; i < noiseArr.length; i++) {
    val = (255 * (noiseArr[i] - lower)) / (upper - lower);
    let index = Math.floor(val / factor);
    if (index >= colors.length) index = colors.length - 1;
    data.push(...colors[index].getColor());
  }

  imgData.data.set(data);

  ctx.putImageData(imgData, 0, 0);
  ctx.drawImage(canvas, 0, 0);
  loadingElem.textContent = "";
}
