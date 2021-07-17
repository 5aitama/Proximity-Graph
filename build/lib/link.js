import {s_f32} from "./type_size.js";
const _Link = class {
  constructor(buffer, offset = 0) {
    const view = new DataView(buffer, offset, _Link.SIZE);
    this.from = {
      x: view.getFloat32(0),
      y: view.getFloat32(s_f32)
    };
    this.to = {
      x: view.getFloat32(s_f32 * 2),
      y: view.getFloat32(s_f32 * 3)
    };
    this.dst = view.getFloat32(s_f32 * 4);
  }
};
let Link = _Link;
Link.SIZE = s_f32 * 5;
export default Link;
