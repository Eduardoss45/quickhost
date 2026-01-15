import { FormValues } from "../schema/form.schema";

export type UpdateFieldHandler = <K extends keyof FormValues>(key: K, value: FormValues[K]) => void;