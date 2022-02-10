export class RandomService {
  static color(withAlfa = false) {
    const chars = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "A",
      "B",
      "C",
      "D",
      "E",
      "F"
    ];
    let color = "#";
    const limit = withAlfa?8:6;
    for (let index = 0; index < 8; index++) {
      color += chars[RandomService.int(0, chars.length)];
    }
    return color;
  }

  static int(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
}
