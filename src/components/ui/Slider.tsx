import React from 'react';

interface SliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    label?: string;
    showValue?: boolean;
}

export function Slider({
    value,
    onChange,
    min = 0,
    max = 100,
    disabled = false,
    showValue = true
}: SliderProps) {
    return (
        <div className="w-full flex flex-col">
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                disabled={disabled}
            />
            {showValue && (
                <div className="text-center text-sm text-zinc-400 mt-1">
                    {value}
                </div>
            )}
        </div>
    );
} 