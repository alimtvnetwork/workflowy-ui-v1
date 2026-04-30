import { SlideLayout } from "../SlideLayout";

export function makeDivider(chapter: string, title: string, subtitle?: string) {
  return function DividerSlide() {
    return (
      <SlideLayout bare>
        <div className="m-auto text-center">
          <div className="text-2xl tracking-[0.4em] uppercase text-muted-foreground mb-8">
            {chapter}
          </div>
          <h1 className="text-[110px] leading-none font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-10 text-3xl text-muted-foreground max-w-[1400px] mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </SlideLayout>
    );
  };
}
