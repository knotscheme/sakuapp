import type { Template } from "../types";
import { sorae } from "./sorae";
import { craft } from "./craft";
import { abyssia } from "./abyssia";

export const TEMPLATES: Template[] = [sorae, craft, abyssia];
export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
export const isDark = (t: Template) => t.id === "abyssia";
