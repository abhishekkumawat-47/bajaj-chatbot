import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[color:var(--color-background)] bg-[radial-gradient(#313045_2px,var(--color-background)_2px)] bg-[size:20px_20px]">
        <div className="flex flex-col gap-10 h-screen w-full items-center justify-center">
          <h1 className="text-5xl bonbon-regular font-bold text-glow">Bajaj Bot</h1>
          <div className="w-full max-w-4xl mx-auto px-4 py-3 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl shadow-lg drop-shadow-[0_0_10px_rgba(119,130,246,0.3)]">
            <textarea
              className="w-full bg-transparent text-[color:var(--color-text)] placeholder-[color:var(--color-text-muted)] resize-none outline-none border-none text-base leading-relaxed font-medium"
              placeholder="My dog name is vinod singh rathore..."
              rows={3}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}
