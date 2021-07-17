import {s_f32} from "./type_size.js";
const _Node = class {
  constructor(buffer, offset = 0) {
    const view = new DataView(buffer, offset, _Node.SIZE);
    this.pos = {
      x: view.getFloat32(0),
      y: view.getFloat32(s_f32)
    };
    this.vel = {
      x: view.getFloat32(s_f32 * 2),
      y: view.getFloat32(s_f32 * 3)
    };
    this.rad = view.getFloat32(s_f32 * 4);
  }
};
let Node = _Node;
Node.SIZE = s_f32 * 5;
export default Node;
