const NODE_SIZE = sizeof() * 5;
const NODE_POS_X_OFFSET = 0;
const NODE_POS_Y_OFFSET = sizeof();
const NODE_VEL_X_OFFSET = sizeof() * 2;
const NODE_VEL_Y_OFFSET = sizeof() * 3;
const NODE_RAD_OFFSET = sizeof() * 4;
const LINK_SIZE = sizeof() * 5;
const LINK_FROM_X_OFFSET = 0;
const LINK_FROM_Y_OFFSET = sizeof();
const LINK_TO_X_OFFSET = sizeof() * 2;
const LINK_TO_Y_OFFSET = sizeof() * 3;
const LINK_DST_OFFSET = sizeof() * 4;
export function CreateNodeArrayBuffer(amount) {
  return new ArrayBuffer(amount * NODE_SIZE);
}
export function InitializeNodeArrayBuffer(buffer, max_x, max_y) {
  for (let i = 0; i < buffer.byteLength; i += NODE_SIZE) {
    const view = new DataView(buffer, i, NODE_SIZE);
    view.setFloat32(NODE_POS_X_OFFSET, Math.random() * max_x);
    view.setFloat32(NODE_POS_Y_OFFSET, Math.random() * max_y);
    view.setFloat32(NODE_VEL_X_OFFSET, Math.random() * 100 - 50);
    view.setFloat32(NODE_VEL_Y_OFFSET, Math.random() * 100 - 50);
    view.setFloat32(NODE_RAD_OFFSET, 1);
  }
}
export function CreateLinkArrayBuffer(node_amount) {
  return new ArrayBuffer(node_amount * node_amount * LINK_SIZE);
}
export function ApplyVelocity(buffer, dt, min_x, min_y, max_x, max_y) {
  for (let i = 0; i < buffer.byteLength; i += NODE_SIZE) {
    const view = new DataView(buffer, i, NODE_SIZE);
    let px = view.getFloat32(NODE_POS_X_OFFSET);
    let py = view.getFloat32(NODE_POS_Y_OFFSET);
    const vx = view.getFloat32(NODE_VEL_X_OFFSET);
    const vy = view.getFloat32(NODE_VEL_Y_OFFSET);
    const new_px = px + vx * dt;
    const new_py = py + vy * dt;
    if (new_px < min_x) {
      px = min_x + max_x - (max_x + new_px);
      view.setFloat32(NODE_VEL_X_OFFSET, vx * -1);
    } else if (new_px > max_x) {
      px = max_x + (max_x - new_px);
      view.setFloat32(NODE_VEL_X_OFFSET, vx * -1);
    } else {
      px = new_px;
    }
    if (new_py < min_y) {
      py = min_y + max_y - (max_y + new_py);
      view.setFloat32(NODE_VEL_Y_OFFSET, vy * -1);
    } else if (new_py > max_y) {
      py = max_y + (max_y - new_py);
      view.setFloat32(NODE_VEL_Y_OFFSET, vy * -1);
    } else {
      py = new_py;
    }
    view.setFloat32(NODE_POS_X_OFFSET, px);
    view.setFloat32(NODE_POS_Y_OFFSET, py);
  }
}
function Distance(ax, ay, bx, by) {
  const x = bx - ax;
  const y = by - ay;
  return Math.sqrt(x * x + y * y);
}
export function UpdateLinks(linkBuffer, nodeBuffer, max_dist) {
  let link_buff_offset = 0;
  for (let i = 0; i < nodeBuffer.byteLength; i += NODE_SIZE) {
    const node_a_view = new DataView(nodeBuffer, i, NODE_SIZE);
    const na_x = node_a_view.getFloat32(NODE_POS_X_OFFSET);
    const na_y = node_a_view.getFloat32(NODE_POS_Y_OFFSET);
    for (let j = 0; j < nodeBuffer.byteLength; j += NODE_SIZE) {
      if (i == j)
        continue;
      const node_b_view = new DataView(nodeBuffer, j, NODE_SIZE);
      const nb_x = node_b_view.getFloat32(NODE_POS_X_OFFSET);
      const nb_y = node_b_view.getFloat32(NODE_POS_Y_OFFSET);
      const distance = Distance(na_x, na_y, nb_x, nb_y);
      if (distance > max_dist)
        continue;
      const link_view = new DataView(linkBuffer, link_buff_offset, LINK_SIZE);
      link_view.setFloat32(LINK_FROM_X_OFFSET, na_x);
      link_view.setFloat32(LINK_FROM_Y_OFFSET, na_y);
      link_view.setFloat32(LINK_TO_X_OFFSET, nb_x);
      link_view.setFloat32(LINK_TO_Y_OFFSET, nb_y);
      link_view.setFloat32(LINK_DST_OFFSET, distance);
      link_buff_offset += LINK_SIZE;
    }
  }
  return link_buff_offset / LINK_SIZE;
}
