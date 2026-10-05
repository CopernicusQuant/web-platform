import { cn } from "@/lib/utils";

type SectionProps = {} & React.ComponentPropsWithoutRef<"div">;

function Section({ children, className, ...props }: SectionProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
}

type HeaderProps = {
  title: string;
} & React.ComponentPropsWithoutRef<"div">;

function Header({ title, children, className, ...props }: HeaderProps) {
  return (
    <div
      className={cn("w-full flex justify-between items-center mb-2", className)}
      {...props}
    >
      <h2 className="font-medium">{title}</h2>
      <div className="flex items-center gap-6">{children}</div>
    </div>
  );
}

type BodyProps = {} & React.ComponentPropsWithRef<"div">;
function Content({ children, className, ref, ...props }: BodyProps) {
  return (
    <div
      className={cn(
        "border border-gray-300 rounded-md w-full bg-white px-6 py-2",
        className,
      )}
      {...props}
    >
      <div ref={ref} className="w-full h-full">
        {children}
      </div>
    </div>
  );
}

type SelectionsProps = {} & React.ComponentProps<"div">;

function Selections({ children, className, ...props }: SelectionsProps) {
  return (
    <div
      className={cn(
        "flex items-center border rounded-md text-sm border-gray-300 [&>button]:border-r [&>*:last-child]:border-0 overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type ButtonProps = {
  active: boolean;
} & React.ComponentProps<"button">;

function Button({ active, children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "flex justify-center items-center min-w-8 h-6 cursor-pointer border-gray-300 text-xs tracking-tight",
        active
          ? "text-white bg-black [&>svg]:stroke-white"
          : "bg-white [&>svg]:stroke-black",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Section, Header, Content, Selections, Button };
