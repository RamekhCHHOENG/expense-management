import {
    FieldContextKey,
    useFieldError,
    useIsFieldDirty,
    useIsFieldTouched,
    useIsFieldValid,
} from "vee-validate";
import { inject } from "vue";
import { FORM_ITEM_INJECTION_KEY } from "./injectionKeys";

export function useFormField() {
    const fieldContext = inject(FieldContextKey, null);
    const fieldItemContext = inject(FORM_ITEM_INJECTION_KEY, "");

    // If no field context, return default values
    if (!fieldContext) {
        return {
            id: "",
            name: "",
            formItemId: "",
            formDescriptionId: "",
            formMessageId: "",
            valid: ref(true),
            isDirty: ref(false),
            isTouched: ref(false),
            error: ref(null),
        };
    }

    const { name } = fieldContext;
    const id = fieldItemContext;

    const fieldState = {
        valid: useIsFieldValid(name),
        isDirty: useIsFieldDirty(name),
        isTouched: useIsFieldTouched(name),
        error: useFieldError(name),
    };

    return {
        id,
        name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
}
