import Vec2 from "./vec2";
import { s_f32 } from "./type_size";

export default class Node {
    /**
     * The size *(in bytes)* of a `Node` object.
     */
    static readonly SIZE = s_f32 * 5;

    /**
     * The position.
     */
    pos: Vec2;

    /**
     * The velocity.
     */
    vel: Vec2;

    /**
     * The radius.
     */
    rad: number;

    /**
     * Create new `Node` class.
     * @param buffer An array that contains multiple `Node` data.
     * @param offset The offset *(in bytes)* of the `Node` data in the `buffer`.
     */
    constructor(buffer: ArrayBuffer, offset: number = 0) {
        const view = new DataView(buffer, offset, Node.SIZE);

        this.pos = {
            x: view.getFloat32(0),
            y: view.getFloat32(s_f32),
        };

        this.vel = {
            x: view.getFloat32(s_f32 * 2),
            y: view.getFloat32(s_f32 * 3),
        }

        this.rad = view.getFloat32(s_f32 * 4);
    }

}