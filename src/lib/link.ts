import Vec2 from "./vec2";
import { s_f32 } from "./type_size";

export default class Link {
    /**
     * The size *(in bytes)* of a `Link` object.
     */
    static readonly SIZE = s_f32 * 5;

    /**
     * The start link position.
     */
    from: Vec2;

    /**
     * The end link position.
     */
    to: Vec2;

    /**
     * The distance.
     */
    dst: number;

    /**
     * Create new `Link` class.
     * @param buffer An array that contains multiple `Link` data.
     * @param offset The offset *(in bytes)* of the `Link` data in the `buffer`.
     */
    constructor(buffer: ArrayBuffer, offset: number = 0) {
        const view = new DataView(buffer, offset, Link.SIZE);

        this.from = {
            x: view.getFloat32(0),
            y: view.getFloat32(s_f32),
        };

        this.to = {
            x: view.getFloat32(s_f32 * 2),
            y: view.getFloat32(s_f32 * 3),
        }

        this.dst = view.getFloat32(s_f32 * 4);
    }

}