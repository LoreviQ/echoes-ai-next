export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    NA = 'Not Applicable',
    CUSTOM = 'Custom'
}

export const parseGender = (input: string): { gender: Gender; customValue?: string } => {
    const normalized = input.trim().toLowerCase();

    if (normalized.includes('female')) {
        return { gender: Gender.FEMALE };
    }
    if (normalized.includes('male')) {
        return { gender: Gender.MALE };
    }
    if (normalized.includes('n/a') || normalized.includes('not applicable') || normalized.includes('not-applicable') || normalized === 'na') {
        return { gender: Gender.NA };
    }

    return { gender: Gender.CUSTOM, customValue: input.trim() };
};