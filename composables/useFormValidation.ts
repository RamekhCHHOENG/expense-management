interface ValidationRules {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    match?: Ref<string>;
}

export const useFormValidation = () => {
    const validateField = (value: string, rules: ValidationRules): string[] => {
        const errors: string[] = [];

        if (rules.required && !value) {
            errors.push('This field is required');
        }

        if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push('Please enter a valid email address');
        }

        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`Must be at least ${rules.minLength} characters`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`Must be no more than ${rules.maxLength} characters`);
        }

        if (rules.pattern && value && !rules.pattern.test(value)) {
            errors.push('Please enter a valid value');
        }

        if (rules.match && value !== rules.match.value) {
            errors.push('Values do not match');
        }

        return errors;
    };

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (!/[!@#$%^&*]/.test(password)) {
            errors.push('Password must contain at least one special character (!@#$%^&*)');
        }

        return errors;
    };

    return {
        validateField,
        validatePassword
    };
}; 