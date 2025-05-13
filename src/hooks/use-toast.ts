
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

import {
  useToast as useToastPrimitive,
  toast as toastPrimitive
} from "@/components/ui/use-toast";

export const useToast = useToastPrimitive;
export const toast = toastPrimitive;

export type { Toast, ToastActionElement, ToastProps };
