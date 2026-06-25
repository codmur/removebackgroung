import React, { createContext, useContext, useState, useEffect } from "react";
import { Card, Tooltip } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";

// ─── TEXT SHIMMER ────────────────────────────────────────────────────────────
export function TextShimmer({
  as: Component = "span",
  className,
  style,
  children,
  ...props
}: {
  as?: any;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <Component
      className={`inline-block animate-shimmer bg-linear-to-r from-[var(--base-color,currentColor)] via-[var(--shimmer-color,currentColor)] to-[var(--base-color,currentColor)] bg-[length:200%_auto] bg-clip-text text-transparent ${className || ""}`}
      style={{
        animation: "shimmer 2.5s linear infinite",
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

// ─── KPI ─────────────────────────────────────────────────────────────────────
export function KPI({ children, className, ...props }: any) {
  return (
    <Card className={`p-4 bg-card border border-border/80 rounded-2xl flex flex-col gap-3 shadow-xs hover:-translate-y-1 hover:shadow-md hover:border-accent/30 transition-all duration-300 cursor-pointer ${className || ""}`} {...props}>
      {children}
    </Card>
  );
}

KPI.Header = function KPIHeader({ children, className, ...props }: any) {
  return (
    <div className={`flex items-center justify-between w-full ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

KPI.Icon = function KPIIcon({ children, status, className, ...props }: any) {
  const statusColors = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-danger/15 text-danger",
    primary: "bg-primary/15 text-primary",
  };
  const colorClass = (statusColors as any)[status || "primary"] || statusColors.primary;
  return (
    <div className={`p-2 rounded-lg ${colorClass} ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

KPI.Title = function KPITitle({ children, className, ...props }: any) {
  return (
    <span className={`text-xs font-semibold text-muted-foreground ${className || ""}`} {...props}>
      {children}
    </span>
  );
};

KPI.Content = function KPIContent({ children, className, ...props }: any) {
  return (
    <div className={`flex items-baseline justify-between w-full ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

KPI.Value = function KPIValue({ children, value, style, notation, maximumFractionDigits, className, ...props }: any) {
  let displayValue = "";
  if (value !== undefined) {
    try {
      const formatter = new Intl.NumberFormat(undefined, {
        style: style || undefined,
        notation: notation || undefined,
        maximumFractionDigits: maximumFractionDigits !== undefined ? maximumFractionDigits : 2,
      });
      displayValue = formatter.format(value);
    } catch {
      displayValue = String(value);
    }
  }
  return (
    <span className={`text-2xl font-extrabold tracking-tight text-foreground ${className || ""}`} {...props}>
      {displayValue || children}
    </span>
  );
};

KPI.Trend = function KPITrend({ children, trend, status, className, ...props }: any) {
  const isPositive = status === "success" || trend === "up";
  const colorClass = isPositive ? "text-success" : "text-danger";
  return (
    <span className={`text-xs font-bold ${colorClass} ${className || ""}`} {...props}>
      {children}
    </span>
  );
};

KPI.Chart = function KPIChart({ data, color, className, ...props }: any) {
  if (!data || data.length === 0) return null;
  
  // Normalize data points (support both objects and flat number arrays)
  const numericData = data.map((d: any) => typeof d === "object" ? (d.value !== undefined ? d.value : 0) : Number(d));
  
  const max = Math.max(...numericData);
  const min = Math.min(...numericData);
  const range = max - min || 1;
  const width = 120;
  const height = 30;
  
  const pointsArray = numericData.map((val: number, i: number) => {
    const x = (i / (numericData.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return { x, y };
  });

  const linePoints = pointsArray.map((p: any) => `${p.x},${p.y}`).join(" ");
  const fillPoints = `0,${height} ${linePoints} ${width},${height}`;
  
  const strokeColor = color || "var(--accent)";
  const gradientId = React.useId().replace(/:/g, "");

  return (
    <div className={`w-full mt-1 shrink-0 ${className || ""}`} {...props}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10 overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon
          points={fillPoints}
          fill={`url(#${gradientId})`}
        />
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={linePoints}
        />
      </svg>
    </div>
  );
};

// ─── STEPPER ─────────────────────────────────────────────────────────────────
const StepperContext = createContext<any>(null);
const StepContext = createContext<any>(null);

export function Stepper({ children, currentStep = 0, onStepChange, orientation = "vertical", className }: any) {
  return (
    <StepperContext.Provider value={{ currentStep, onStepChange, orientation }}>
      <div className={`flex ${orientation === "horizontal" ? "flex-row items-center justify-between" : "flex-col gap-0"} ${className || ""}`}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child, { index } as any);
        })}
      </div>
    </StepperContext.Provider>
  );
}

Stepper.useStep = function useStep() {
  const context = useContext(StepContext);
  if (!context) {
    return { status: "incomplete" };
  }
  return context;
};

Stepper.Step = function StepperStep({ children, index, className, ...props }: any) {
  const { currentStep, orientation, onStepChange } = useContext(StepperContext) || { currentStep: 0, orientation: "vertical" };
  const isCompleted = index < currentStep;
  const isActive = index === currentStep;
  const status = isCompleted ? "complete" : isActive ? "active" : "incomplete";

  return (
    <div
      onClick={() => onStepChange?.(index)}
      className={`flex ${orientation === "horizontal" ? "flex-1 items-center" : "flex-row gap-4 min-h-[70px]"} relative group cursor-pointer ${className || ""}`}
      {...props}
    >
      <StepContext.Provider value={{ index, status }}>
        {children}
      </StepContext.Provider>
    </div>
  );
};

Stepper.Indicator = function StepperIndicator({ children, className, ...props }: any) {
  const { status } = useContext(StepContext) || { status: "incomplete" };
  const baseStyle = "flex items-center justify-center size-8 rounded-full border text-xs font-bold transition-all duration-300 z-10 shrink-0 select-none";
  const statusStyles = {
    complete: "bg-success border-success text-success-foreground",
    active: "bg-accent border-accent text-accent-foreground shadow-xs ring-4 ring-accent/15 scale-105",
    incomplete: "bg-card border-border text-muted-foreground",
  };
  return (
    <div className={`${baseStyle} ${statusStyles[status as keyof typeof statusStyles]} ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

Stepper.Icon = function StepperIcon({ children }: any) {
  return <>{children}</>;
};

Stepper.Content = function StepperContent({ children, className, ...props }: any) {
  const { orientation } = useContext(StepperContext) || { orientation: "vertical" };
  return (
    <div className={`flex flex-col text-left ${orientation === "horizontal" ? "ml-3" : "mt-0.5 pb-6"} ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

Stepper.Title = function StepperTitle({ children, className, ...props }: any) {
  const { status } = useContext(StepContext) || { status: "incomplete" };
  return (
    <span className={`text-sm font-bold leading-none transition-colors duration-200 ${status === "active" ? "text-foreground" : "text-muted-foreground"} ${className || ""}`} {...props}>
      {children}
    </span>
  );
};

Stepper.Description = function StepperDescription({ children, className, ...props }: any) {
  return (
    <span className={`text-xs text-muted-foreground/85 mt-1.5 leading-relaxed ${className || ""}`} {...props}>
      {children}
    </span>
  );
};

Stepper.Separator = function StepperSeparator({ className, ...props }: any) {
  const { orientation } = useContext(StepperContext) || { orientation: "vertical" };
  const { status } = useContext(StepContext) || { status: "incomplete" };
  const isCompleted = status === "complete";

  if (orientation === "horizontal") {
    return (
      <div className={`flex-1 h-0.5 mx-4 bg-border transition-colors duration-300 ${isCompleted ? "bg-success" : ""} ${className || ""}`} {...props} />
    );
  }
  return (
    <div
      className={`absolute left-4 top-8 bottom-0 w-0.5 bg-border transition-colors duration-300 -translate-x-1/2 group-last:hidden ${
        isCompleted ? "bg-success" : ""
      } ${className || ""}`}
      {...props}
    />
  );
};

// ─── CAROUSEL ────────────────────────────────────────────────────────────────
const CarouselContext = createContext<any>(null);

export function Carousel({ children, opts, className, setApi }: any) {
  const [emblaRef, emblaApi] = useEmblaCarousel(opts);
  
  useEffect(() => {
    if (emblaApi && setApi) {
      setApi(emblaApi);
    }
  }, [emblaApi, setApi]);

  return (
    <CarouselContext.Provider value={emblaApi}>
      <div ref={emblaRef} className={`overflow-hidden relative ${className || ""}`}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

Carousel.Content = function CarouselContent({ children, className }: any) {
  return (
    <div className={`flex ${className || ""}`}>
      {children}
    </div>
  );
};

Carousel.Item = function CarouselItem({ children, className }: any) {
  return (
    <div className={`min-w-0 shrink-0 grow-0 basis-full ${className || ""}`}>
      {children}
    </div>
  );
};

Carousel.Dots = function CarouselDots({ className }: any) {
  const api = useContext(CarouselContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className={`flex justify-center ${className || ""}`}>
      {scrollSnaps.length > 0 && (
        <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground tracking-wider bg-muted/30 border border-border/60 px-2.5 py-0.5 rounded-full shadow-xs">
          {selectedIndex + 1} / {scrollSnaps.length}
        </span>
      )}
    </div>
  );
};

// ─── ITEM CARD ───────────────────────────────────────────────────────────────
export function ItemCard({ children, className, variant, ...props }: any) {
  const isOutline = variant === "outline";
  return (
    <Card className={`p-6 border bg-card rounded-2xl flex flex-col gap-4 shadow-xs ${
      isOutline ? "border-border" : "border-transparent bg-muted/30"
    } ${className || ""}`} {...props}>
      {children}
    </Card>
  );
}

ItemCard.Icon = function ItemCardIcon({ children, className, ...props }: any) {
  return (
    <div className={`p-3 rounded-xl w-fit flex items-center justify-center shrink-0 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

ItemCard.Content = function ItemCardContent({ children, className, ...props }: any) {
  return (
    <div className={`flex flex-col gap-1 w-full text-left ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

ItemCard.Title = function ItemCardTitle({ children, className, ...props }: any) {
  return (
    <h3 className={`text-base font-bold text-foreground tracking-tight ${className || ""}`} {...props}>
      {children}
    </h3>
  );
};

ItemCard.Description = function ItemCardDescription({ children, className, ...props }: any) {
  return (
    <p className={`text-xs text-muted-foreground leading-relaxed ${className || ""}`} {...props}>
      {children}
    </p>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const SidebarContext = createContext<any>(null);
const MenuItemContext = createContext<any>(null);
const SidebarTypeContext = createContext<"desktop" | "mobile">("desktop");

export function SidebarProvider({ children }: any) {
  const [state, setState] = useState<"expanded" | "collapsed">("expanded");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggle = () => setState(prev => prev === "expanded" ? "collapsed" : "expanded");

  return (
    <SidebarContext.Provider value={{ state, setState, toggle, isMobileOpen, setIsMobileOpen }}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children, className, ...props }: any) {
  const { state } = useContext(SidebarContext) || { state: "expanded" };
  return (
    <SidebarTypeContext.Provider value="desktop">
      <aside
        data-state={state}
        className={`hidden md:flex flex-col border-r border-border bg-background transition-all duration-300 shrink-0 overflow-hidden ${
          state === "expanded" ? "w-64" : "w-16"
        } ${className || ""}`}
        {...props}
      >
        {children}
      </aside>
    </SidebarTypeContext.Provider>
  );
}

Sidebar.Provider = SidebarProvider;

Sidebar.Header = function SidebarHeader({ children, className, ...props }: any) {
  return (
    <div className={`p-4 flex items-center border-b border-border/40 shrink-0 gap-2 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

Sidebar.Content = function SidebarContent({ children, className, ...props }: any) {
  return (
    <div className={`flex-1 overflow-y-auto overflow-x-hidden ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

Sidebar.Group = function SidebarGroup({ children, className, ...props }: any) {
  return (
    <div className={`p-3 flex flex-col gap-1 w-full ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

const MenuContext = createContext<any>(null);

Sidebar.Menu = function SidebarMenu({ children, defaultExpandedKeys, className, ...props }: any) {
  return (
    <MenuContext.Provider value={{ defaultExpandedKeys }}>
      <ul className={`flex flex-col gap-1 w-full p-0 list-none m-0 ${className || ""}`} {...props}>
        {children}
      </ul>
    </MenuContext.Provider>
  );
};

Sidebar.MenuItem = function SidebarMenuItem({ children, href, id, isCurrent, textValue, tooltipProps, className, ...props }: any) {
  const { state } = useContext(SidebarContext) || { state: "expanded" };
  const menuContext = useContext(MenuContext);
  const defaultExpanded = menuContext?.defaultExpandedKeys
    ? menuContext.defaultExpandedKeys.includes(id)
    : true;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const hasSubmenu = React.Children.toArray(children).some(
    (c: any) => c.type === Sidebar.Submenu
  );

  const toggleSubmenu = () => setIsExpanded(!isExpanded);

  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { to: href } : {};

  // Separate submenu from other children so it doesn't render inside the flex wrapper
  const childrenArray = React.Children.toArray(children);
  const submenuChild = childrenArray.find((c: any) => c.type === Sidebar.Submenu);
  const otherChildren = childrenArray.filter((c: any) => c.type !== Sidebar.Submenu);

  const sidebar = useContext(SidebarContext);
  const sidebarType = useContext(SidebarTypeContext);

  const triggerContent = (
    <Wrapper
      {...wrapperProps}
      onClick={(e: any) => {
        if (hasSubmenu && !href) {
          e.preventDefault();
          toggleSubmenu();
        } else {
          sidebar?.setIsMobileOpen(false);
        }
      }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer select-none transition-all duration-200 w-full group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0 ${
        isCurrent
          ? "bg-accent/10 text-accent font-bold"
          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      }`}
    >
      {otherChildren}
    </Wrapper>
  );

  const showTooltip = sidebarType === "desktop" && state === "collapsed";

  return (
    <li className={`relative flex flex-col w-full list-none ${className || ""}`} {...props}>
      <MenuItemContext.Provider value={{ isCurrent, hasSubmenu, isExpanded, toggleSubmenu }}>
        {showTooltip ? (
          <Tooltip delay={100} closeDelay={0}>
            <Tooltip.Trigger>
              {triggerContent}
            </Tooltip.Trigger>
            <Tooltip.Content placement="right">
              {textValue || tooltipProps?.content}
            </Tooltip.Content>
          </Tooltip>
        ) : (
          triggerContent
        )}
        {submenuChild}
      </MenuItemContext.Provider>
    </li>
  );
};

Sidebar.MenuIcon = function SidebarMenuIcon({ children, className, ...props }: any) {
  return (
    <div className={`flex items-center justify-center shrink-0 size-5 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

Sidebar.MenuLabel = function SidebarMenuLabel({ children, className, ...props }: any) {
  const sidebarType = useContext(SidebarTypeContext);
  return (
    <span className={`text-sm font-semibold truncate ${sidebarType === "desktop" ? "group-data-[state=collapsed]:hidden" : ""} ${className || ""}`} {...props}>
      {children}
    </span>
  );
};

Sidebar.MenuTrigger = function SidebarMenuTrigger({ className, ...props }: any) {
  const sidebarType = useContext(SidebarTypeContext);
  const { isExpanded, toggleSubmenu } = useContext(MenuItemContext) || { isExpanded: false, toggleSubmenu: () => {} };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSubmenu();
      }}
      className={`ml-auto p-1 text-muted-foreground hover:text-foreground rounded-lg transition-transform duration-200 ${
        sidebarType === "desktop" ? "group-data-[state=collapsed]:hidden" : ""
      } ${
        isExpanded ? "rotate-90" : ""
      } ${className || ""}`}
      {...props}
    >
      <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

Sidebar.Submenu = function SidebarSubmenu({ children, className, ...props }: any) {
  const sidebarType = useContext(SidebarTypeContext);
  const { isExpanded } = useContext(MenuItemContext) || { isExpanded: false };
  if (!isExpanded) return null;

  return (
    <ul className={`pl-8 mt-1 flex flex-col gap-1 w-full list-none m-0 ${
      sidebarType === "desktop" ? "group-data-[state=collapsed]:hidden" : ""
    } ${className || ""}`} {...props}>
      {children}
    </ul>
  );
};

Sidebar.Footer = function SidebarFooter({ children, className, ...props }: any) {
  return (
    <div className={`p-4 border-t border-border/40 shrink-0 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

Sidebar.Rail = function SidebarRail() {
  return null;
};

Sidebar.Mobile = function SidebarMobile({ children }: any) {
  const { isMobileOpen, setIsMobileOpen } = useContext(SidebarContext) || { isMobileOpen: false, setIsMobileOpen: () => {} };
  if (!isMobileOpen) return null;

  return (
    <SidebarTypeContext.Provider value="mobile">
      <div className="md:hidden fixed inset-0 z-50 flex">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsMobileOpen(false)} />
        <aside className="bg-background text-foreground relative flex flex-col w-64 border-r border-border h-full shadow-xl animate-in slide-in-from-left duration-200">
          {children}
        </aside>
      </div>
    </SidebarTypeContext.Provider>
  );
};

Sidebar.Main = function SidebarMain({ children, className, ...props }: any) {
  return (
    <div className={`flex-1 flex flex-col min-w-0 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

Sidebar.Trigger = function SidebarTrigger({ className, ...props }: any) {
  const { toggle, setIsMobileOpen } = useContext(SidebarContext) || { toggle: () => {}, setIsMobileOpen: () => {} };
  return (
    <button
      onClick={() => {
        toggle();
        setIsMobileOpen((prev: boolean) => !prev);
      }}
      className={`p-2 rounded-xl border border-border bg-card/60 hover:bg-card hover:text-accent hover:border-accent/40 text-muted-foreground cursor-pointer transition-all duration-200 ${className || ""}`}
      {...props}
    >
      <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

Sidebar.useSidebar = function useSidebar() {
  return useContext(SidebarContext);
};

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
export function Navbar({ children, className, ...props }: any) {
  return (
    <nav className={`w-full py-3 px-4 ${className || ""}`} {...props}>
      {children}
    </nav>
  );
}

Navbar.Header = function NavbarHeader({ children, className, ...props }: any) {
  return (
    <div className={`flex items-center justify-between w-full ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

// ─── SEGMENT ─────────────────────────────────────────────────────────────────
const SegmentContext = createContext<any>(null);

export function Segment({ children, selectedKey, onSelectionChange, size, className, ...props }: any) {
  return (
    <SegmentContext.Provider value={{ selectedKey, onSelectionChange }}>
      <div className={`flex items-center p-1 rounded-xl bg-default/30 border border-border/50 backdrop-blur-xs w-fit ${className || ""}`} {...props}>
        {children}
      </div>
    </SegmentContext.Provider>
  );
}

Segment.Item = function SegmentItem({ children, id, className, ...props }: any) {
  const { selectedKey, onSelectionChange } = useContext(SegmentContext) || { selectedKey: "", onSelectionChange: () => {} };
  const isActive = selectedKey === id;
  return (
    <button
      type="button"
      onClick={() => onSelectionChange?.(id)}
      className={`relative px-4 py-1.5 rounded-lg text-sm font-semibold select-none cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
        isActive
          ? "bg-surface text-foreground shadow-sm font-bold border border-border/20"
          : "text-muted-foreground hover:text-foreground hover:bg-default/10"
      } ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

Segment.Separator = function SegmentSeparator() {
  return null;
};

// ─── DROPZONE ────────────────────────────────────────────────────────────────
const DropZoneContext = createContext<any>(null);

export function DropZone({ children, className, ...props }: any) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const triggerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <DropZoneContext.Provider value={{ fileInputRef, triggerClick }}>
      <div className={`w-full ${className || ""}`} {...props}>
        {children}
      </div>
    </DropZoneContext.Provider>
  );
}

DropZone.Area = function DropZoneArea({ children, onDrop, className, ...props }: any) {
  const { triggerClick } = useContext(DropZoneContext) || { triggerClick: () => {} };
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDropInternal = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    const items = e.dataTransfer.items;
    
    onDrop?.({
      items,
      files,
      preventDefault: () => {}
    });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropInternal}
      onClick={triggerClick}
      className={`${className || ""} ${isDragActive ? "border-accent bg-accent/5" : ""}`}
      {...props}
    >
      {children}
    </div>
  );
};

DropZone.Icon = function DropZoneIcon({ children, className, ...props }: any) {
  return (
    <div className={`${className || ""}`} {...props}>
      {children}
    </div>
  );
};

DropZone.Label = function DropZoneLabel({ children, className, ...props }: any) {
  return (
    <span className={`${className || ""}`} {...props}>
      {children}
    </span>
  );
};

DropZone.Description = function DropZoneDescription({ children, className, ...props }: any) {
  return (
    <span className={`${className || ""}`} {...props}>
      {children}
    </span>
  );
};

DropZone.Trigger = function DropZoneTrigger({ className, ...props }: any) {
  return <div className={`pointer-events-none ${className || ""}`} {...props} />;
};

DropZone.Input = function DropZoneInput({ accept, onSelect, ...props }: any) {
  const { fileInputRef } = useContext(DropZoneContext) || {};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onSelect) {
      onSelect(e.target.files);
    }
  };
  return (
    <input
      type="file"
      ref={fileInputRef}
      accept={accept}
      onChange={handleChange}
      className="hidden"
      {...props}
    />
  );
};
