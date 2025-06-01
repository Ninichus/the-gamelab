"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent } from "./ui/tooltip";

const TooltipSlider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    tooltipAlwaysVisible?: boolean;
  }
>(
  (
    {
      className,
      tooltipAlwaysVisible = false,
      defaultValue,
      value,
      min = 0,
      max = 100,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<number[]>(
      () => (defaultValue as number[]) ?? (value as number[]) ?? [min]
    );

    const isControlled = value !== undefined;
    const currentValues = isControlled ? (value as number[]) : internalValue;

    const [tooltipVisible, setTooltipVisible] = React.useState<boolean[]>(() =>
      currentValues.map(() => tooltipAlwaysVisible)
    );

    const updateThumbVisibility = (index: number, visible: boolean) => {
      if (tooltipAlwaysVisible) return;
      setTooltipVisible((prev) =>
        prev.map((v, i) => (i === index ? visible : v))
      );
    };

    const handleValueChange = (newValues: number[]) => {
      if (!isControlled) {
        setInternalValue(newValues);
      }
      onValueChange?.(newValues);
    };

    return (
      <SliderPrimitive.Root
        ref={ref}
        value={currentValues}
        onValueChange={handleValueChange}
        defaultValue={defaultValue}
        min={min}
        max={max}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5">
          <SliderPrimitive.Range className="bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
        </SliderPrimitive.Track>

        <TooltipProvider>
          {currentValues.map((val, index) => (
            <Tooltip key={index} open={tooltipVisible[index]} delayDuration={0}>
              <TooltipTrigger asChild>
                <SliderPrimitive.Thumb
                  onPointerDown={() => updateThumbVisibility(index, true)}
                  onPointerUp={() => {
                    if (!tooltipAlwaysVisible) {
                      updateThumbVisibility(index, false);
                    }
                  }}
                  onFocus={() => updateThumbVisibility(index, true)}
                  onBlur={() => {
                    if (!tooltipAlwaysVisible) {
                      updateThumbVisibility(index, false);
                    }
                  }}
                  onMouseEnter={() => updateThumbVisibility(index, true)}
                  onMouseLeave={() => {
                    if (!tooltipAlwaysVisible)
                      updateThumbVisibility(index, false);
                  }}
                  className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                />
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  {val} {!!max && `/ ${max}`}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </SliderPrimitive.Root>
    );
  }
);
TooltipSlider.displayName = "TooltipSlider";

export { TooltipSlider };
