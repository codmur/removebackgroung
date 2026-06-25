import { useState, useEffect } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { Link } from "@tanstack/react-router";
import { Button, Card, Chip } from "@heroui/react";
import { KPI, Stepper, Carousel, ItemCard, TextShimmer } from "@heroui-pro/react";
import {
  Comparison,
  ComparisonHandle,
  ComparisonItem,
} from "@/components/ui/shadcn-io/comparison";
import {
  Wand2,
  Zap,
  ImageIcon,
  Sparkles,
  UploadCloud,
  Download,
  ArrowRight,
  Shield,
  Check,
  Move,
  SplitSquareHorizontal,
  Layers,
  Clock,
  Star,
} from "lucide-react";
import * as m from "@/paraglide/messages";
import React from "react";

// ─── How-it-works step icons ───────────────────────────────────────────────
const HOW_STEPS = [
  {
    icon: <UploadCloud size={20} />,
    title: "Sube tu imagen",
    description:
      "Arrastra y suelta o selecciona cualquier foto en JPEG, PNG o WebP. Hasta 4K de resolución soportada.",
  },
  {
    icon: <Wand2 size={20} />,
    title: "La IA actúa",
    description:
      "Nuestros modelos de visión artificial aíslan el sujeto con precisión de píxel en menos de 5 segundos.",
  },
  {
    icon: <SplitSquareHorizontal size={20} />,
    title: "Previsualiza",
    description:
      "Usa el control deslizante Before & After para inspeccionar la calidad del recorte antes de descargar.",
  },
  {
    icon: <Download size={20} />,
    title: "Descarga en HD",
    description:
      "Obtén tu PNG transparente en alta resolución, listo para diseño, e-commerce o redes sociales.",
  },
];

// ─── Feature data ───────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Wand2 size={18} />,
    title: "IA de última generación",
    description:
      "Modelos entrenados con millones de imágenes para recortes perfectos incluso en cabello fino y bordes complejos.",
  },
  {
    icon: <Zap size={18} />,
    title: "Resultado en segundos",
    description:
      "Infraestructura optimizada que procesa tu imagen en menos de 5 segundos sin perder calidad.",
  },
  {
    icon: <ImageIcon size={18} />,
    title: "Resolución original",
    description:
      "El PNG exportado mantiene la resolución y calidad de la imagen original. Sin degradación.",
  },
  {
    icon: <Shield size={18} />,
    title: "Privacidad garantizada",
    description:
      "Tus imágenes nunca se almacenan en nuestros servidores más allá del tiempo necesario de proceso.",
  },
  {
    icon: <Layers size={18} />,
    title: "Historial de proyectos",
    description:
      "Accede a todas tus imágenes procesadas desde el panel de proyectos. Tu trabajo siempre disponible.",
  },
  {
    icon: <Star size={18} />,
    title: "Gratis para empezar",
    description:
      "Comienza a usar BGR sin tarjeta de crédito. Elimina fondos ahora mismo sin coste.",
  },
];

// ─── KPI sparkline data ─────────────────────────────────────────────────────
const sparkProcessed = [30, 35, 42, 38, 45, 48, 55, 52, 60, 65, 62, 72];
const sparkTime = [6.2, 5.8, 5.5, 5.0, 4.8, 4.6, 4.5, 4.4, 4.3, 4.2, 4.2, 4.2];
const sparkSatisfaction = [96, 97, 97, 98, 97, 98, 98, 99, 98, 99, 99, 99];
const sparkResolution = [2048, 2048, 2048, 3072, 3072, 3072, 4096, 4096, 4096, 4096, 4096, 4096];

// ─── StepIcon helper ────────────────────────────────────────────────────────
function StepIcon({ index, icons }: { index: number; icons: React.ReactNode[] }) {
  const { status } = Stepper.useStep();
  if (status === "complete") return <Check size={16} />;
  return <>{icons[index]}</>;
}

export function LandingContent() {

  const [step, setStep] = useState(0);
  const [api, setApi] = useState<EmblaCarouselType>();

  // Two-way binding: update stepper index when carousel slides
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setStep(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Handle step selection from stepper
  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    if (api) {
      api.scrollTo(newStep);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/6 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/5 w-[350px] h-[350px] bg-accent/4 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-1/4 right-1/5 w-[280px] h-[280px] bg-accent/4 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Left Column: Content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Logo and Badge */}
          <div className="flex flex-row items-center gap-3 mb-6">
 
            <Chip
              size="sm"
              variant="soft"
              className="bg-accent/10 text-accent border border-accent/25 px-3"
            >
              <Sparkles size={12}/>
              <Chip.Label>{m.home_badge()}</Chip.Label>
            </Chip>
          </div>

          {/* Headline — uses TextShimmer for the accent part */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            {m.home_heroTitle1()}
            <br />
            <TextShimmer
              as="span"
              className="text-4xl sm:text-6xl font-extrabold"
              style={{
                "--base-color": "var(--accent)",
                "--shimmer-color": "oklch(from var(--accent) calc(l + 0.25) c h)",
              } as React.CSSProperties}
            >
              {m.home_heroTitle2()}
            </TextShimmer>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl font-light leading-relaxed mb-8">
            {m.home_heroSubtitle()}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-row items-center gap-2 sm:gap-4 mb-10 w-full sm:w-auto justify-center lg:justify-start">
            <Button
              size="lg"
              className="flex-1 sm:flex-initial font-bold bg-accent text-accent-foreground hover:scale-105 transition-all duration-300 shadow-lg h-10 sm:h-12 px-2.5 sm:px-8 text-xs sm:text-base cursor-pointer min-w-0 flex items-center justify-center"
              render={({ ref, ...props }) => <Link {...(props as any)} to="/projects" />}
            >
              <UploadCloud size={16} className="mr-1.5 sm:mr-2 shrink-0" />
              <span className="truncate">{m.home_ctaPrimary()}</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 sm:flex-initial font-medium hover:border-accent/50 transition-all duration-200 h-10 sm:h-12 px-2.5 sm:px-8 text-xs sm:text-base cursor-pointer min-w-0 flex items-center justify-center"
              render={({ ref, ...props }) => <a {...(props as any)} href="#demo" />}
            >
              <span className="truncate">{m.home_ctaDemo()}</span>
              <ArrowRight size={14} className="ml-1.5 sm:ml-2 shrink-0" />
            </Button>
          </div>

          {/* Social proof pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            {[
              { icon: <Star size={12} className="fill-warning text-warning" />, text: "4.9 / 5 valoración" },
              { icon: <Shield size={12} className="text-success" />, text: "100% privado" },
              { icon: <Clock size={12} className="text-accent" />, text: "Menos de 5 seg." },
            ].map(({ icon, text }) => (
              <Chip
                key={text}
                size="sm"
                variant="soft"
                className="text-xs bg-card/60 border border-border/50 text-muted-foreground"
              >
                {icon}
                <Chip.Label>{text}</Chip.Label>
              </Chip>
            ))}
          </div>
        </div>

        {/* Right Column: Original Interactive Background Removal Simulation */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[400px] aspect-square rounded-3xl border border-border/80 bg-card p-4 shadow-2xl overflow-hidden group">
            {/* Checkerboard background wrapper for the transparent preview */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-checkerboard border border-border/40">
              
              {/* No-BG Image (underneath) */}
              <img
                src="/sneaker-no-bg.png"
                alt="BGR Sneaker cut"
                className="absolute inset-0 w-full h-full object-contain p-4 select-none pointer-events-none"
              />

              {/* Original Image Container (sliding layer on top) */}
              <div 
                className="absolute inset-x-0 top-0 w-full overflow-hidden transition-all duration-[3000ms] ease-in-out animate-scan-reveal-v"
              >
                <img
                  src="/sneaker-original.png"
                  alt="Original sneaker"
                  className="absolute top-0 left-0 w-full h-[366px] object-contain p-4 select-none pointer-events-none"
                />
              </div>

              {/* Scanner Line indicator */}
              <div className="absolute inset-x-0 h-[2px] bg-accent/80 shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-scan-reveal-line-v pointer-events-none" />

              {/* Floating badges */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs border border-white/10 px-2 py-0.5 rounded-md text-[10px] font-medium text-white shadow-xs">
                Resultado IA
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs border border-white/10 px-2 py-0.5 rounded-md text-[10px] font-medium text-white shadow-xs">
                Zapato Original
              </div>
            </div>
            
         
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          KPI STATS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-14 border-t border-border bg-card/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI>
            <KPI.Header>
              <KPI.Icon status="success">
                <ImageIcon size={16} />
              </KPI.Icon>
              <KPI.Title>Imágenes procesadas</KPI.Title>
            </KPI.Header>
            <KPI.Content>
              <KPI.Value value={50000} notation="compact" maximumFractionDigits={0} />
              <KPI.Trend trend="up">+12%</KPI.Trend>
            </KPI.Content>
            <KPI.Chart color="var(--success)" data={sparkProcessed} />
          </KPI>

          <KPI>
            <KPI.Header>
              <KPI.Icon status="warning">
                <Clock size={16} />
              </KPI.Icon>
              <KPI.Title>Tiempo promedio</KPI.Title>
            </KPI.Header>
            <KPI.Content>
              <KPI.Value value={4.2}>
                <span className="text-base font-medium text-muted ml-1">seg</span>
              </KPI.Value>
              <KPI.Trend trend="down" status="success">-32%</KPI.Trend>
            </KPI.Content>
            <KPI.Chart color="var(--accent)" data={sparkTime} />
          </KPI>

          <KPI>
            <KPI.Header>
              <KPI.Icon status="success">
                <Star size={16} />
              </KPI.Icon>
              <KPI.Title>Satisfacción</KPI.Title>
            </KPI.Header>
            <KPI.Content>
              <KPI.Value value={0.99} style="percent" maximumFractionDigits={0} />
              <KPI.Trend trend="up">+2%</KPI.Trend>
            </KPI.Content>
            <KPI.Chart color="var(--success)" data={sparkSatisfaction} />
          </KPI>

          <KPI>
            <KPI.Header>
              <KPI.Icon status="primary">
                <Zap size={16} />
              </KPI.Icon>
              <KPI.Title>Resolución máx.</KPI.Title>
            </KPI.Header>
            <KPI.Content>
              <KPI.Value value={4096} notation="compact" maximumFractionDigits={0}>
                <span className="text-base font-medium text-muted ml-1">px</span>
              </KPI.Value>
              <KPI.Trend trend="up">+100%</KPI.Trend>
            </KPI.Content>
            <KPI.Chart color="var(--accent)" data={sparkResolution} />
          </KPI>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          DEMO / COMPARISON SLIDER
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="demo" className="px-6 py-20 md:py-28 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center space-y-3 max-w-2xl">
            <Chip
              size="sm"
              variant="soft"
              className="bg-accent/10 text-accent border-accent/20 mb-2"
            >
              <Move size={12} />
              <Chip.Label>Demo interactivo</Chip.Label>
            </Chip>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{m.home_demoTitle()}</h2>
            <p className="text-muted font-light text-base leading-relaxed">{m.home_demoSubtitle()}</p>
          </div>

          <div className="w-full max-w-3xl">
            <Card className="border border-border/80 bg-card overflow-hidden rounded-3xl shadow-2xl">
              <div className="flex justify-between px-5 pt-4 pb-2">
                <Chip size="sm" color="success" variant="soft">
                  <Check size={12} />
                  <Chip.Label>Sin fondo</Chip.Label>
                </Chip>
                <Chip size="sm" variant="soft" className="bg-default/40">Original</Chip>
              </div>
              <Comparison className="aspect-video bg-checkerboard relative">
                <ComparisonItem position="left">
                  <img
                    src="/sneaker-no-bg.png"
                    alt="Fondo eliminado"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </ComparisonItem>
                <ComparisonItem position="right">
                  <img
                    src="/sneaker-original.png"
                    alt="Imagen original"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </ComparisonItem>
                <ComparisonHandle />
              </Comparison>
              <div className="flex items-center justify-between px-5 py-3 border-t border-border/40 text-xs text-muted-foreground">
                <span>← Arrastra el control →</span>
                <span className="font-semibold text-accent">Before &amp; After</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — Stepper + Carousel sincronizados (igual que Guide)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-20 md:py-28 border-t border-border bg-card/5">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <Chip size="sm" variant="soft" className="bg-accent/10 text-accent border-accent/20 mb-2">
              4 pasos simples
            </Chip>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Cómo funciona</h2>
            <p className="text-muted font-light max-w-lg mx-auto">
              Elimina fondos con precisión profesional en cuestión de segundos.
            </p>
          </div>

          {/* Stepper + Carousel grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: vertical stepper on all screen sizes (hidden on mobile, vertical on desktop) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Stepper
                currentStep={step}
                onStepChange={handleStepChange}
                orientation="vertical"
                color="danger"
                className="w-full hidden lg:flex"
              >
                {HOW_STEPS.map((s, i) => (
                  <Stepper.Step key={i} className="cursor-pointer select-none">
                    <Stepper.Indicator>
                      <Stepper.Icon>
                        <StepIcon index={i} icons={HOW_STEPS.map((x) => x.icon)} />
                      </Stepper.Icon>
                    </Stepper.Indicator>
                    <Stepper.Content>
                      <Stepper.Title className="text-sm font-bold">{s.title}</Stepper.Title>
                      <Stepper.Description className="text-xs text-muted-foreground mt-0.5 hidden lg:block">
                        {s.description}
                      </Stepper.Description>
                    </Stepper.Content>
                    <Stepper.Separator />
                  </Stepper.Step>
                ))}
              </Stepper>
            </div>

            {/* Right: carousel of visual slides */}
            <div className="lg:col-span-7">
              <Carousel
                setApi={setApi}
                opts={{ loop: false }}
                className="w-full max-w-md mx-auto"
              >
                <Carousel.Content>
                  {/* Slide 0: Upload */}
                  <Carousel.Item>
                    <div className="p-1">
                      <Card className="h-[340px] md:h-[380px] border border-border/80 bg-card rounded-3xl flex flex-col justify-between p-6 shadow-md">
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-2xl bg-background/40 p-4 hover:border-accent/50 group cursor-pointer transition-all duration-300">
                          <div className="p-4 bg-accent/10 text-accent rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                            <UploadCloud size={32} className="animate-bounce" />
                          </div>
                          <span className="text-sm font-semibold text-foreground text-center">Sube tu imagen</span>
                          <span className="text-xs text-muted-foreground text-center mt-1 max-w-[200px]">
                            Arrastra &amp; Suelta o navega — JPEG, PNG, WebP
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between border border-border/40 rounded-xl p-2.5 bg-background/60">
                          <div className="flex items-center gap-2">
                            <ImageIcon size={18} className="text-accent" />
                            <div>
                              <span className="text-xs font-semibold text-foreground block">shoe_photo.jpeg</span>
                              <span className="text-[10px] text-muted-foreground">1.4 MB</span>
                            </div>
                          </div>
                          <Chip size="sm" color="success" variant="soft">Ready</Chip>
                        </div>
                      </Card>
                    </div>
                  </Carousel.Item>

                  {/* Slide 1: AI Processing */}
                  <Carousel.Item>
                    <div className="p-1">
                      <Card className="h-[340px] md:h-[380px] border border-border/80 bg-card rounded-3xl flex flex-col justify-between p-6 shadow-md">
                        <div className="flex-1 relative rounded-2xl overflow-hidden bg-background/80 flex items-center justify-center border border-border/40">
                          <img src="/sneaker-original.png" alt="Processing" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_8px_rgba(var(--accent-color),0.8)] animate-scan" />
                          <div className="absolute inset-0 bg-accent/5 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 border border-border/50 shadow-md">
                              <Sparkles size={16} className="text-accent animate-spin" style={{ animationDuration: "3s" }} />
                              <span className="text-xs font-semibold tracking-wider animate-pulse">IA PROCESANDO...</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Tiempo estimado: ~4.2s</span>
                          <Chip size="sm" variant="soft" className="bg-accent/10 text-accent">IA Activa</Chip>
                        </div>
                      </Card>
                    </div>
                  </Carousel.Item>

                  {/* Slide 2: Comparison */}
                  <Carousel.Item>
                    <div className="p-1">
                      <Card className="h-[340px] md:h-[380px] border border-border/80 bg-card rounded-3xl flex flex-col justify-between p-6 shadow-md">
                        <div className="flex-1 border border-border/60 rounded-2xl overflow-hidden relative min-h-0">
                          <Comparison className="w-full h-full relative isolate">
                            <ComparisonItem position="left">
                              <img src="/sneaker-no-bg.png" alt="Sin fondo" className="w-full h-full object-cover select-none pointer-events-none" />
                            </ComparisonItem>
                            <ComparisonItem position="right">
                              <img src="/sneaker-original.png" alt="Original" className="w-full h-full object-cover select-none pointer-events-none" />
                            </ComparisonItem>
                            <ComparisonHandle />
                          </Comparison>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Arrastra para comparar</span>
                          <span className="font-semibold text-accent">Before &amp; After</span>
                        </div>
                      </Card>
                    </div>
                  </Carousel.Item>

                  {/* Slide 3: Download */}
                  <Carousel.Item>
                    <div className="p-1">
                      <Card className="h-[340px] md:h-[380px] border border-border/80 bg-card rounded-3xl flex flex-col justify-between p-6 shadow-md">
                        <div className="flex-1 flex items-center justify-center rounded-2xl bg-checkerboard border border-border/40 relative overflow-hidden">
                          <img src="/sneaker-no-bg.png" alt="Resultado" className="max-h-[200px] object-contain hover:scale-105 transition-transform duration-300" />
                          <div className="absolute top-2 right-2">
                            <Chip size="sm" color="success" variant="soft">
                              <Check size={12} />
                              <Chip.Label>PNG Transparente</Chip.Label>
                            </Chip>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                          <Button
                            className="w-full font-bold bg-accent text-accent-foreground hover:scale-[1.02] transition-transform duration-200"
                            onPress={() => {
                              const a = document.createElement("a");
                              a.href = "/sneaker-no-bg.png";
                              a.download = "bgr-result.png";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                          >
                            <Download size={16} className="mr-2" />
                            Descargar resultado
                          </Button>
                          <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                            <span>Resolución: 1920 × 1085 px</span>
                            <span>Calidad original</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Carousel.Item>
                </Carousel.Content>
                <Carousel.Dots className="mt-4" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES — ItemCard grid
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="px-6 py-20 md:py-28 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col gap-14">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{m.home_featuresTitle()}</h2>
            <p className="text-muted font-light max-w-lg mx-auto">{m.home_featuresSubtitle()}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <ItemCard
                key={f.title}
                variant="outline"
                className="hover:border-accent/50 hover:bg-card/60 transition-all duration-300 hover:-translate-y-0.5"
              >
                <ItemCard.Icon className="bg-accent/10 text-accent rounded-xl">
                  {f.icon}
                </ItemCard.Icon>
                <ItemCard.Content>
                  <ItemCard.Title className="text-sm font-bold">{f.title}</ItemCard.Title>
                  <ItemCard.Description className="text-xs leading-relaxed">
                    {f.description}
                  </ItemCard.Description>
                </ItemCard.Content>
              </ItemCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-br from-accent via-accent/90 to-accent/70 border-none rounded-3xl p-10 md:p-14 text-accent-foreground shadow-2xl shadow-accent/20">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col gap-4 text-center md:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-bold w-fit mx-auto md:mx-0">
                  <Sparkles size={12} />
                  100% Gratis para empezar
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  ¿Listo para eliminar fondos?
                </h2>
                <p className="text-sm text-accent-foreground/80 font-light leading-relaxed">
                  Únete a miles de diseñadores, fotógrafos y creadores que ya usan BGR
                  para obtener recortes perfectos en segundos.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 shrink-0">
                <Button
                  size="lg"
                  className="font-bold bg-background text-foreground hover:scale-105 shadow-xl transition-all duration-200 px-10"
                  render={({ ref, ...props }) => <Link {...(props as any)} to="/projects" />}
                >
                  <UploadCloud size={18} className="mr-2" />
                  {m.home_ctaPrimary()}
                </Button>
                <span className="text-[11px] text-accent-foreground/60">Sin tarjeta de crédito</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="mt-auto py-8 border-t border-border bg-card/30 text-center text-xs text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} BGR BgRemover.{" "}
          <span className="text-muted-foreground/60">{m.home_footer()}</span>
        </p>
      </footer>
    </div>
  );
}
