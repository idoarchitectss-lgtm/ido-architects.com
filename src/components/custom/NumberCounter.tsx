import React, { useEffect, useState } from "react";

interface CounterProps {
    from?: number;
    to: number;
    duration?: number; // Thời gian chạy số (ms)
}

const Counter: React.FC<CounterProps> = ({ from = 0, to, duration = 2000 }) => {
    const [value, setValue] = useState<number>(from);

    useEffect(() => {
        const startTime = performance.now();
        const step = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Tỷ lệ tiến độ (từ 0 đến 1)
            const currentValue = from + (to - from) * progress; // Giá trị hiện tại
            setValue(Math.round(currentValue)); // Cập nhật giá trị (làm tròn)

            if (progress < 1) {
                requestAnimationFrame(step); // Tiếp tục cập nhật
            }
        };

        requestAnimationFrame(step); // Bắt đầu animation
    }, [from, to, duration]);

    return (
        <div className="text-5xl">
            {value}
        </div>
    );
};


interface NumberCounterProps {
    from: number;
    to: number;
    title: string;
}
const NumberCounter: React.FC<NumberCounterProps> = ({
    from,
    to,
    title
}) => {
    return (
        <div
            className='cursor-pointer hover:shadow-secondary/20 hover:shadow-md hover:border-2 duration-500 bg-neutral-100 text-secondary  text-xl font-[700] p-8 flex flex-col gap-3 items-center justify-center text-center shadow-xl'>
            <p className='uppercase text-primary '>{title}</p>
            <Counter  from={from} to={to} duration={3000} />
        </div>
    )
}

export default NumberCounter;