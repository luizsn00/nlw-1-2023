import * as Checkbox from "@radix-ui/react-checkbox"
import clsx from "clsx";
import { Check } from "phosphor-react";

interface CheckboxCompProps extends Checkbox.CheckboxProps {
  title: string
  throughToCheck?: boolean
  onCheckedChange(): void
  checked?: boolean
}

export function CheckboxComp({ title, onCheckedChange, throughToCheck = false, checked = false, ...rest }: CheckboxCompProps) {
  return (
    <Checkbox.Root className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
      onCheckedChange={onCheckedChange}
      checked={checked}
      {...rest}
    >
      <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
        <Checkbox.Indicator>
          <Check size={20} className="text-white" />
        </Checkbox.Indicator>
      </div>

      <span className={clsx("text-white font-semibold-text-xl leading-tight", {
        'group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400': throughToCheck,
      })}
      >
        {title}
      </span>
    </Checkbox.Root>
  );
}
