type PortraitMode = "clean" | "glitch" | "snow";

export function Portrait({ mode }: { mode: PortraitMode }) {
    return (
        <div
            className={`portrait portrait--${mode}`}
            aria-hidden="true"
        >
            <img src="/me.jpg" alt="Portrait" />
            <div className="portrait__fx" />
        </div>
    );
}