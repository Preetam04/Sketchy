import React, { useEffect, useRef, useState } from "react";
import pen from "../../../images/pen.gif";
import undo from "../../../images/undo.gif";
import clear from "../../../images/clear.gif";

const colors: string[] = [
  "  rgb(255, 255, 255)",
  "rgb(193, 193, 193)",
  "rgb(239, 19, 11)",
  "rgb(255, 113, 0)",
  "rgb(255, 228, 0)",
  "rgb(0, 204, 0)",
  "rgb(0, 255, 145)",
  "rgb(0, 178, 255)",
  "rgb(35, 31, 211)",
  "rgb(163, 0, 186)",
  "rgb(223, 105, 167)",
  "rgb(255, 172, 142)",
  "rgb(160, 82, 45)",
  "rgb(0, 0, 0)",
  "rgb(80, 80, 80)",
  "rgb(116, 11, 7)",
  "rgb(194, 56, 0)",
  "rgb(232, 162, 0)",
  "rgb(0, 70, 25)",
  "rgb(0, 120, 93)",
  "rgb(0, 86, 158)",
  "rgb(14, 8, 101)",
  "rgb(85, 0, 105)",
  "rgb(135, 53, 84)",
  "rgb(204, 119, 77)",
  "rgb(99, 48, 13)",
];

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const brushRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  const [showBrush, setShowBrush] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState(20);
  const [selectedColor, setSelectedColor] = useState("rgb(0,0,0)");
  const lastPoint = useRef({ x: 0, y: 0 });

  const colorRef = useRef("rgb(0,0,0)");
  const brushSizeRef = useRef(7);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    historyRef.current.push(imageData);
  };

  const undoChange = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (historyRef.current.length === 0) return;
    const previousImage = historyRef.current.pop();
    if (previousImage) {
      ctx.putImageData(previousImage, 0, 0);
    }

    console.log(previousImage);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(dpr, dpr);

    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    let isDrawing = false;

    const handleMouseDown = (e: MouseEvent) => {
      saveState();
      isDrawing = true;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      lastPoint.current = { x, y };

      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const brush = brushRef.current;

      if (brush) {
        brush.style.left = `${e.clientX}px`;
        brush.style.top = `${e.clientY}px`;
      }
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const prevX = lastPoint.current.x;
      const prevY = lastPoint.current.y;

      const dx = x - prevX;
      const dy = y - prevY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      const steps = Math.max(1, Math.ceil(distance / 2));

      ctx.strokeStyle = colorRef.current;
      ctx.lineWidth = brushSizeRef.current;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const px = prevX + dx * t;
        const py = prevY + dy * t;

        const midX = (lastPoint.current.x + px) / 2;
        const midY = (lastPoint.current.y + py) / 2;

        ctx.quadraticCurveTo(
          lastPoint.current.x,
          lastPoint.current.y,
          midX,
          midY,
        );

        lastPoint.current = {
          x: px,
          y: py,
        };
      }

      ctx.stroke();
    };

    const handleMouseUp = (e: MouseEvent) => {
      isDrawing = false;

      ctx.closePath();
    };

    canvas.addEventListener("mouseenter", (ev: MouseEvent) => {
      // canvas.style.cursor = `url(${pen}), auto`;
      setShowBrush(true);
    });

    canvas.addEventListener("mouseleave", (ev: MouseEvent) => {
      setShowBrush(false);
    });

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="w-3/4  space-y-2 h-full">
      <div className="bg-white h-10/12 ring-2 rounded ">
        {showBrush && (
          <div
            className="fixed pointer-events-none z-50 w-fit ring-black ring-1 bg-white   rounded-full  -translate-x-1/2 -translate-y-1/2"
            ref={brushRef}
          >
            <div
              className={`rounded-full m-0.5]`}
              style={{
                width: `${brushSize}px`,
                height: `${brushSize}px`,
                backgroundColor: selectedColor,
              }}
            />
          </div>
        )}
        <canvas ref={canvasRef} className={`w-full h-full cursor-none`} />
      </div>
      <div className=" h-1/12 rounded flex items-center space-x-2 mt-4">
        <button
          className="rounded bg-white p-1 cursor-pointer"
          onClick={() => {
            undoChange();
          }}
        >
          <img src={undo} alt="pen" className="w-8" />
        </button>
        <button
          className="rounded bg-white p-1 cursor-pointer"
          onClick={clearCanvas}
        >
          <img src={clear} alt="pen" className="w-8" />
        </button>

        {/* colors div */}
        <div className="">
          <div className="w-full  flex items-center rounded-sm color">
            {colors.slice(0, colors.length / 2).map((color, i) => (
              <div
                className={`w-6 h-6 p-2 cursor-pointer ${selectedColor == color && "border-2"} if `}
                style={{
                  backgroundColor: color,
                }}
                key={i}
                onClick={() => {
                  setSelectedColor(color);
                  colorRef.current = color;
                }}
              />
            ))}
          </div>

          <div className="w-full  flex items-center rounded-sm">
            {colors.slice(colors.length / 2, colors.length).map((color, i) => (
              <div
                className={`w-6 h-6 p-2 cursor-pointer ${selectedColor === color && "border-2"}`}
                style={{
                  backgroundColor: color,
                }}
                onClick={() => {
                  setSelectedColor(color);
                  colorRef.current = color;
                }}
                key={i}
              />
            ))}
          </div>
        </div>

        {/* Bursh Div */}
        <div className=" flex items-center space-x-2">
          {[7, 10, 20].map((size, key) => (
            <button
              key={key}
              className={`rounded bg-white p-1 cursor-pointer
            w-9 h-9 flex justify-center items-center
             ${brushSize === size && "border-2"} `}
              onClick={() => {
                setBrushSize(size);
                brushSizeRef.current = size;
              }}
            >
              <div
                className=" rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: selectedColor,
                }}
              ></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
