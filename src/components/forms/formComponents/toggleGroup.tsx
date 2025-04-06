type ToggleButtonGroupProps<T extends string> = {
    field: string;
    label: string;
    description?: string;
    options: T[];
    value: T;
    dispatch: React.Dispatch<any>;
    formatOption?: (option: T) => string;
};

export function ToggleButtonGroup<T extends string>({
    field,
    label,
    description,
    options,
    value,
    dispatch,
    formatOption = (option) => option.charAt(0).toUpperCase() + option.slice(1)
}: ToggleButtonGroupProps<T>) {
    return (
        <div className="flex">
            <div className="pl-2 w-[25%] flex flex-col justify-center">
                <label
                    className="text-sm font-medium text-zinc-200 cursor-help"
                    title={description}
                >
                    {label}
                </label>
            </div>
            <div className="flex gap-2 w-[75%]">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`flex-1 px-4 py-2 rounded-md text-center transition-colors ${value === option
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }`}
                        onClick={() => dispatch({
                            type: 'SET_FIELD',
                            field: field,
                            value: option
                        })}
                    >
                        {formatOption(option)}
                    </button>
                ))}
            </div>
        </div>
    );
}