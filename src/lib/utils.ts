export function FindCanvas() {
    const canvas = document.querySelector("canvas");

    if (!canvas)
        throw "Canvas not found !";

    return canvas;
}

export function FindContext(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

    if (!ctx)
        throw "Failed to retrieve the context !";

    return ctx;
}