import {useLayoutEffect, useRef, useState} from "react";
import "../App.css";

function SplashPage() {
    const stageRef = useRef(null);
    const logoStarRef = useRef(null);
    const heroStarRef = useRef(null);

    const [positionReady, setPositionReady] = useState(false);

    useLayoutEffect(() => {
        const stage = stageRef.current;
        const logoStar = logoStarRef.current;
        const heroStar = heroStarRef.current;

        if (!stage || !logoStar || !heroStar) {
            return;
        }

        function measureStarPosition() {
            const stageRect = stage.getBoundingClientRect();
            const targetRect = logoStar.getBoundingClientRect();

            // Centre of the large star's starting stage
            const startX = stageRect.left + stageRect.width / 2;
            const startY = stageRect.top + stageRect.height / 2;

            // Actual centre of the small star beside WORKLY
            const targetX = targetRect.left + targetRect.width / 2;
            const targetY = targetRect.top + targetRect.height / 2;

            // Measure the untransformed size of the large star
            const heroWidth = heroStar.offsetWidth;

            if (
                heroWidth <= 0 ||
                targetRect.width <= 0 ||
                targetRect.height <= 0
            ) {
                return;
            }

            // Calculate the exact horizontal and vertical movement
            stage.style.setProperty(
                "--star-dx",
                `${targetX - startX}px`
            );

            stage.style.setProperty(
                "--star-dy",
                `${targetY - startY}px`
            );

            // Make the large star shrink to the small star's actual size
            stage.style.setProperty(
                "--star-final-scale",
                `${targetRect.width / heroWidth}`
            );

            // Start the animation only after measuring the target
            setPositionReady(true);
        }

        measureStarPosition();

        // Recalculate if the layout changes
        const observer = new ResizeObserver(measureStarPosition);

        observer.observe(stage);
        observer.observe(logoStar);

        window.addEventListener("resize", measureStarPosition);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measureStarPosition);
        };
    }, []);

    return (
        <main
            className={`splash-screen${positionReady ? " is-ready" : ""}`}
        >
            <section
                className="splash-content"
                ref={stageRef}
                aria-label="Workly"
            >
                <div className="logo-lockup">
                    <h1 className="wordmark">WORKLY</h1>

                    <span
                        className="logo-star"
                        ref={logoStarRef}
                        aria-hidden="true"
                    />
                </div>

                <p className="tagline">
                    Freelance services, made simpler.
                </p>

                <span
                    className="hero-star"
                    ref={heroStarRef}
                    aria-hidden="true"
                />
            </section>
        </main>
    );
}

export default SplashPage;