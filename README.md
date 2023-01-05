# Procedural Map Generator

This project is a tool for procedural generating maps which are rendered using the Canvas API. Map appear random yet organic. This is achieved by utilizing a blend of simplex and perlin noise.

---

#### How to run

Everything was developed in simple JavaScript and HTML, just open the HTML file in a web browser (Chrome is recommended).

---

#### How to use

The user can adjust the following parameters and settings:
**Roughness**: Adjusts transparency of octaves.
**Persistance**: Adjusts how quickly amplitude decreases between octaves.
**Octaves**: Adjusts number of octaves in calculating height map. More octaves requires more computing time but also results in more detail.
**Simplex Weight**: Adjusts how much impact simplex noise has on height map calculations. Inversely proportional to perlin noise weight.
**Zoom out**: Sliding to the right will adjust the scale so that more of the map is shown.
**Color**: Can use default colors or add custom color palettes. Colors that are lower on the list (added more recently) will correspond to larger values on the height map.

---

#### Things to fix and add

- [] Option to reset to default settings
- [] Ability to save settings
- [] Improve the mapping of color to height so that it is more consistent and predictable
- [] Ability to choose target for zooming
- [] More options for noise generation

---

### Final notes

Perlin and simplex noise generation was NOT developed by me, attribution is given in the _perlin.js_ file. The UI and implementation of the parameters mentioned above are my work. This is just a fun project motivated by my curiosity relating to procedural generation and noise. Use it however you want, attribution is appreciated.
