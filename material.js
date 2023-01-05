class Material {
  constructor(color) {
    if (color.length < 4) color.push(255);
    this.colors = [color];
    this.probs = [1];
    this.needToCalc = false;
  }

  addColor(color, p) {
    if (p > this.probs[0]) return;
    this.probs[0] -= p;
    this.colors.push(color);
    this.probs.push(p);
    this.needToCalc = true;
  }

  calcProbs() {
    if (!this.needToCalc) return;

    this.needToCalc = false;
    for (let i = 1; i < this.probs.length; i++) {
      this.probs[i] += this.probs[i - 1];
    }
  }

  getColor() {
    let rand = Math.random();
    this.calcProbs();
    for (let i = 0; i < this.probs.length; i++) {
      if (rand < this.probs[i]) return this.colors[i];
    }
    return this.colors[this.colors.length - 1];
  }
}
