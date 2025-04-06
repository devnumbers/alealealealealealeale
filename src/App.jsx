import {useState, useEffect, useRef} from 'react';
import styles from './app.module.css';
import arrow from './assets/arrow.png';
import arrowMobile from './assets/arrowMobile.png';
import videio from './assets/IMG_4103.mp4';

function App() {

    const targetDateRef = useRef(new Date(2025, 3, 18).getTime()); // 18 April 2025
    const [timeLeft, setTimeLeft] = useState(() => {
        const now = new Date().getTime();
        const difference = targetDateRef.current - now;
        return Math.max(0, Math.floor(difference / 1000));
    });

    const [isMobile, setIsMobile] = useState(false);
    const [containerHeight, setContainerHeight] = useState(window.innerHeight);

    const containerRef = useRef(null);
    const [paddingTop, setPaddingTop] = useState(0);
    const [paddingBottom, setPaddingBottom] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(() => {
                const now = new Date().getTime();
                const difference = targetDateRef.current - now;
                return Math.max(0, Math.floor(difference / 1000));
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const checkScreenWidth = () => {
            setIsMobile(window.innerWidth < 768);
        };

        const updateHeight = () => {
            setContainerHeight(window.innerHeight);
        };

        checkScreenWidth();
        window.addEventListener('resize', checkScreenWidth);
        window.addEventListener('orientationchange', updateHeight);
        window.addEventListener('scroll', updateHeight);

        return () => {
            window.removeEventListener('resize', checkScreenWidth);
            window.removeEventListener('orientationchange', updateHeight);
            window.removeEventListener('scroll', updateHeight);
        };
    }, []);

    useEffect(() => {
        const updatePadding = () => {
            if (containerRef.current) {
                const computedStyle = window.getComputedStyle(containerRef.current);
                setPaddingTop(parseInt(computedStyle.getPropertyValue('padding-top')));
                setPaddingBottom(parseInt(computedStyle.getPropertyValue('padding-bottom')));
            }
        };
        updatePadding();
        window.addEventListener('resize', updatePadding);
        window.addEventListener('orientationchange', updatePadding);
        return () => {
            window.removeEventListener('resize', updatePadding);
            window.removeEventListener('orientationchange', updatePadding);
        };
    }, [containerRef]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours, minutes, seconds]
            .map(v => v.toString().padStart(2, '0'))
            .join(':');
    };

    return (
        <main className={styles.container} style={{height: `${containerHeight}px`}}>
            {isMobile && (
                <video controls={false} style={{
                    top: paddingTop + 'px',
                    height: (containerHeight - paddingTop - paddingBottom) + 'px'
                }} className={styles.backgroundVideo} autoPlay muted loop playsInline
                       preload="auto">
                    <source src={videio} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            )}
            <div className={styles.timer}>
                {formatTime(timeLeft)}
            </div>
            <div className={styles.blockText}>
                <div className={styles.arrow}>
                    <img
                        className={styles.arrowIcon}
                        src={isMobile ? arrowMobile : arrow}
                        alt="arrow"
                    />
                </div>
                <div className={styles.blockDesk}>
                    <div className={styles.text}>listen</div>
                    <div className={styles.text}>virid° — ale?</div>
                </div>
            </div>
        </main>
    );
}

export default App;

