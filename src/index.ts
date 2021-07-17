import { FindCanvas, FindContext } from "./lib/utils";
import asc_loader from "@assemblyscript/loader";
import Node from "./lib/node";
import Link from "./lib/link";

const canvas = FindCanvas();
const ctx = FindContext(canvas);
const html_fps = document.querySelector("#fps");

let module: asc_loader.ResultObject & {
    exports: asc_loader.ASUtil & Record<string, unknown>;
};

let module_exports: any;

let time_data = {
    lt: 0, // Last time.
    dt: 0, // Delta time.
    ls: 0, // Last time second.
};

let fps = 0;
/**
 * Node buffer pointer.
 */
let node_buff_ptr = 0;

/**
 * Link buffer pointer.
 */
let link_buff_ptr = 0;

const max_dist = 90;
const node_amount = 250;

/**
 * Resize the canvas to fullscreen.
 * @note No dpi support for now...
 */
function OnResize() {
    canvas.width  = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
}

async function Init() {
    // Setup the resize event...
    document.body.onresize = OnResize;
    OnResize();

    // Load the assembly file...
    module = await asc_loader.instantiateStreaming(fetch("wasm/optimized.wasm"));
    module_exports = module.exports;

    // Create new Node array buffer...
    node_buff_ptr = module.exports.__pin(module_exports.CreateNodeArrayBuffer(node_amount));
    link_buff_ptr = module.exports.__pin(module_exports.CreateLinkArrayBuffer(node_amount));

    module_exports.InitializeNodeArrayBuffer(node_buff_ptr, canvas.width, canvas.height);
}

function MainLoop(time: number = 0) {
    
    // Calculate the delta time...
    time_data.dt = time - time_data.lt;
    time_data.lt = time;
    time_data.ls += time_data.dt / 1000;
    fps ++;

    if (time_data.ls >= 1) {
        if (html_fps)
            html_fps.textContent = `${fps < 10 ? '0' : ''}${fps} FPS`;
        
        fps = 0;
        time_data.ls = 0;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "161616";
    ctx.fill();

    module_exports.ApplyVelocity(node_buff_ptr, time_data.dt / 1000, 0, 0, canvas.width, canvas.height);
    const link_count = module_exports.UpdateLinks(link_buff_ptr, node_buff_ptr, max_dist);
    
    const node_buff = module.exports.__getArrayBuffer(node_buff_ptr);
    const link_buff = module.exports.__getArrayBuffer(link_buff_ptr);

    for (let i = 0; i < node_buff.byteLength; i += Node.SIZE) {
        const node = new Node(node_buff, i);

        ctx.beginPath();
        ctx.arc(node.pos.x, node.pos.y, node.rad, 0, Math.PI * 2);
        ctx.fillStyle = "ffffff";
        ctx.fill();
    }

    for (let i = 0; i < link_buff.byteLength && i / Link.SIZE < link_count; i += Link.SIZE) {
        const link = new Link(link_buff, i);

        ctx.beginPath();
        ctx.moveTo(link.from.x, link.from.y);
        ctx.lineTo(link.to.x, link.to.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - link.dst / max_dist})`;
        ctx.stroke();
    }

    requestAnimationFrame(MainLoop);
}

Init().then(() => MainLoop());