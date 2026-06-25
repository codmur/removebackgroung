import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Button,
  Card,
  Chip,
  Accordion,
} from "@heroui/react";
import { Stepper, Carousel } from "@heroui-pro/react";
import {
  UploadCloud,
  Wand2,
  Split,
  Download,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Check,
  Image as ImageIcon,
  Sparkles,
  Layers,
  History,
  BookOpen,
} from "lucide-react";
import * as m from "@/paraglide/messages";
import {
  Comparison,
  ComparisonItem,
  ComparisonHandle,
} from "@/components/ui/shadcn-io/comparison";
import type { EmblaCarouselType } from "embla-carousel";

// Removed useIsMobile hook to rely purely on Tailwind responsive styling

// Icon helper component leveraging the Stepper context status
function StepIconWrapper({ index, stepIcons }: { index: number; stepIcons: any[] }) {
  const { status } = Stepper.useStep();
  const StepIcon = stepIcons[index];

  if (status === "complete") {
    return <Check size={16} />;
  }

  return <StepIcon size={16} />;
}

export function GuideContent() {
  const steps = [
    { title: m.guide_steps_0_title(), description: m.guide_steps_0_description() },
    { title: m.guide_steps_1_title(), description: m.guide_steps_1_description() },
    { title: m.guide_steps_2_title(), description: m.guide_steps_2_description() },
    { title: m.guide_steps_3_title(), description: m.guide_steps_3_description() }
  ];

  const [step, setStep] = useState(0);
  const [api, setApi] = useState<EmblaCarouselType>();

  const stepIcons = [UploadCloud, Wand2, Split, Download];
  const CurrentStepIcon = stepIcons[step];

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

  const nextStep = () => {
    if (step < 3) {
      handleStepChange(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      handleStepChange(step - 1);
    }
  };

  // Mock download action for slide 4
  const triggerMockDownload = () => {
    const link = document.createElement("a");
    link.href = "/sneaker-no-bg.png";
    link.download = "bgr-transparent-sneaker.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full flex flex-col gap-8">
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-7xl h-[300px] bg-gradient-to-b from-accent/5 to-transparent blur-3xl opacity-80 pointer-events-none" />

      {/* Page Header */}
      <div className="flex flex-col gap-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-md text-xs font-semibold text-accent shadow-xs w-fit select-none">
          <BookOpen size={14} className="text-accent" />
          <span>{m.guide_badge()}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {m.guide_title()}
        </h1>
        <p className="text-muted text-sm md:text-base font-light leading-relaxed">
          {m.guide_subtitle()}
        </p>
      </div>

      {/* Main Interactive Guide Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
        {/* Left Column: Stepper Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Responsive Stepper (hidden on mobile, vertical on desktop) */}
          <Stepper
            currentStep={step}
            onStepChange={handleStepChange}
            orientation="vertical"
            className="w-full hidden lg:flex"
          >
            {steps.map((s: any, i: number) => (
              <Stepper.Step key={i} className="cursor-pointer select-none">
                <Stepper.Indicator>
                  <Stepper.Icon>
                    <StepIconWrapper index={i} stepIcons={stepIcons} />
                  </Stepper.Icon>
                </Stepper.Indicator>
                <Stepper.Content>
                  <Stepper.Title className="text-sm font-bold">
                    {s.title}
                  </Stepper.Title>
                  <Stepper.Description className="text-xs text-muted-foreground mt-0.5 hidden lg:block">
                    {s.description}
                  </Stepper.Description>
                </Stepper.Content>
                <Stepper.Separator />
              </Stepper.Step>
            ))}
          </Stepper>

          {/* Current Step Focus Details Card */}
          <Card className="border border-border/80 bg-card/60 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <CurrentStepIcon size={20} />
              </div>
              <h3 className="font-bold text-foreground text-base">
                {steps[step]?.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              {steps[step]?.description}
            </p>

            {/* Navigation buttons inside card */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/40">
              <Button
                size="sm"
                variant="ghost"
                isDisabled={step === 0}
                onPress={prevStep}
                className="flex items-center gap-1.5"
              >
                <ArrowLeft size={16} />
                <span className="lg:hidden">Back</span>
                <span className="hidden lg:inline">Previous</span>
              </Button>

              <span className="text-xs text-muted-foreground font-semibold">
                {step + 1} / 4
              </span>

              <Button
                size="sm"
                isDisabled={step === 3}
                onPress={nextStep}
                className="flex items-center gap-1.5 bg-accent text-accent-foreground font-semibold"
              >
                <span className="lg:hidden">Next</span>
                <span className="hidden lg:inline">Continue</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Visual Preview Gallery */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <Carousel
            setApi={setApi}
            opts={{ loop: false }}
            className="w-full max-w-md mx-auto"
          >
            <Carousel.Content>
              {/* Slide 0: Upload */}
              <Carousel.Item>
                <div className="p-1">
                  <Card className="aspect-square bg-card border border-border/80 flex flex-col justify-between p-6 select-none shadow-md rounded-3xl h-[360px] md:h-[400px]">
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-2xl bg-background/40 p-4 transition-all duration-300 hover:border-accent/50 group cursor-pointer">
                      <div className="p-4 bg-accent/10 text-accent rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                        <UploadCloud size={32} className="animate-bounce" />
                      </div>
                      <span className="text-sm font-semibold text-foreground text-center">
                        {steps[0].title}
                      </span>
                      <span className="text-xs text-muted-foreground text-center mt-1 max-w-[200px]">
                        Drag & Drop or Browse JPEG, PNG, WebP
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border border-border/40 rounded-xl p-2.5 bg-background/60">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={18} className="text-accent" />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                            shoe_photo.jpeg
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            1.4 MB • Ready
                          </span>
                        </div>
                      </div>
                      <Chip size="sm" color="success" variant="soft">
                        Ready
                      </Chip>
                    </div>
                  </Card>
                </div>
              </Carousel.Item>

              {/* Slide 1: AI Processing */}
              <Carousel.Item>
                <div className="p-1">
                  <Card className="aspect-square bg-card border border-border/80 flex flex-col justify-between p-6 select-none shadow-md rounded-3xl h-[360px] md:h-[400px]">
                    <div className="flex-1 relative rounded-2xl overflow-hidden bg-background/80 flex items-center justify-center border border-border/40">
                      {/* Original Image */}
                      <img
                        src="/sneaker-original.png"
                        alt="Processing Sneaker"
                        className="w-full h-full object-cover opacity-80"
                      />
                      {/* Scanner line animation */}
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_8px_rgba(var(--accent-color),0.8)] animate-scan" />

                      {/* Shimmer backdrop */}
                      <div className="absolute inset-0 bg-accent/5 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 border border-border/50 shadow-md backdrop-blur-md">
                          <Sparkles size={16} className="text-accent animate-spin-slow" />
                          <span className="text-xs font-semibold text-foreground tracking-wider animate-pulse">
                            AI ISOLATING...
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Processing time: ~2.4s
                      </span>
                      <Chip size="sm" variant="soft" color="accent">
                        AI Active
                      </Chip>
                    </div>
                  </Card>
                </div>
              </Carousel.Item>

              {/* Slide 2: Comparison */}
              <Carousel.Item>
                <div className="p-1">
                  <Card className="aspect-square bg-card border border-border/80 flex flex-col justify-between p-6 select-none shadow-md rounded-3xl h-[360px] md:h-[400px]">
                    <div className="flex-1 border border-border/60 rounded-2xl overflow-hidden shadow-xs relative min-h-0 bg-background">
                      <Comparison className="w-full h-full relative isolate">
                        <ComparisonItem position="left">
                          <img
                            src="/sneaker-no-bg.png"
                            alt="No background sneaker"
                            className="w-full h-full object-cover select-none pointer-events-none"
                          />
                        </ComparisonItem>
                        <ComparisonItem position="right">
                          <img
                            src="/sneaker-original.png"
                            alt="Original sneaker"
                            className="w-full h-full object-cover select-none pointer-events-none"
                          />
                        </ComparisonItem>
                        <ComparisonHandle />
                      </Comparison>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Drag slider to inspect cut-out quality</span>
                      <span className="font-semibold text-accent">Before & After</span>
                    </div>
                  </Card>
                </div>
              </Carousel.Item>

              {/* Slide 3: Download */}
              <Carousel.Item>
                <div className="p-1">
                  <Card className="aspect-square bg-card border border-border/80 flex flex-col justify-between p-6 select-none shadow-md rounded-3xl h-[360px] md:h-[400px]">
                    <div className="flex-1 flex items-center justify-center rounded-2xl bg-checkerboard border border-border/40 p-4 relative overflow-hidden">
                      <img
                        src="/sneaker-no-bg.png"
                        alt="Result transparent sneaker"
                        className="max-h-[180px] md:max-h-[220px] object-contain hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Chip
                          size="sm"
                          color="success"
                          variant="soft"
                        >
                          <Check size={12} />
                          <Chip.Label>PNG Transparent</Chip.Label>
                        </Chip>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <Button
                        className="w-full font-bold shadow-md bg-accent text-accent-foreground flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200"
                        onPress={triggerMockDownload}
                      >
                        <Download size={18} />
                        {m.guide_ctaButton()} (Demo Download)
                      </Button>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground px-1">
                        <span>Resolution: 1920 x 1085 px</span>
                        <span>HD Original Quality</span>
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

      {/* Pro Tips Section */}
      <section className="mt-8 border-t border-border/60 pt-10">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="text-warning fill-warning/10" size={22} />
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            {m.guide_tipsTitle()}
          </h2>
        </div>
        
        {/* Mobile View: Accordion (visible on screens < lg) */}
        <div className="lg:hidden w-full">
          <Accordion variant="surface" className="px-0">
            <Accordion.Item key="1" id="1">
              <Accordion.Heading>
                <Accordion.Trigger className="flex items-center gap-2">
                  <Sparkles size={18} className="text-accent" />
                  <span className="text-sm font-bold text-foreground">
                    {m.guide_tip1Strong().replace(":", "")}
                  </span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <p className="text-sm text-muted-foreground pb-2">{m.guide_tip1()}</p>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item key="2" id="2">
              <Accordion.Heading>
                <Accordion.Trigger className="flex items-center gap-2">
                  <Layers size={18} className="text-accent" />
                  <span className="text-sm font-bold text-foreground">
                    {m.guide_tip2Strong().replace(":", "")}
                  </span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <p className="text-sm text-muted-foreground pb-2">{m.guide_tip2()}</p>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item key="3" id="3">
              <Accordion.Heading>
                <Accordion.Trigger className="flex items-center gap-2">
                  <History size={18} className="text-accent" />
                  <span className="text-sm font-bold text-foreground">
                    {m.guide_tip3Strong().replace(":", "")}
                  </span>
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <p className="text-sm text-muted-foreground pb-2">{m.guide_tip3()}</p>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>

        {/* Desktop View: Grid (visible on screens >= lg) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 w-full">
          <Card className="border border-border/85 bg-card/40 p-5 rounded-2xl flex flex-col gap-3 shadow-xs hover:border-accent/40 hover:bg-card/60 transition-all duration-300">
            <div className="p-2.5 bg-accent/10 text-accent rounded-xl w-fit">
              <Sparkles size={20} />
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              <strong className="text-accent mr-1">{m.guide_tip1Strong()}</strong>
              {m.guide_tip1()}
            </p>
          </Card>
          <Card className="border border-border/85 bg-card/40 p-5 rounded-2xl flex flex-col gap-3 shadow-xs hover:border-accent/40 hover:bg-card/60 transition-all duration-300">
            <div className="p-2.5 bg-accent/10 text-accent rounded-xl w-fit">
              <Layers size={20} />
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              <strong className="text-accent mr-1">{m.guide_tip2Strong()}</strong>
              {m.guide_tip2()}
            </p>
          </Card>
          <Card className="border border-border/85 bg-card/40 p-5 rounded-2xl flex flex-col gap-3 shadow-xs hover:border-accent/40 hover:bg-card/60 transition-all duration-300">
            <div className="p-2.5 bg-accent/10 text-accent rounded-xl w-fit">
              <History size={20} />
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              <strong className="text-accent mr-1">{m.guide_tip3Strong()}</strong>
              {m.guide_tip3()}
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <Card className="mt-6 relative overflow-hidden bg-gradient-to-br from-accent to-accent/80 border-none rounded-3xl p-8 text-accent-foreground shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Decorative background visual elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col gap-2 text-center md:text-left">
          <h3 className="text-2xl font-extrabold tracking-tight leading-tight">
            {m.guide_ctaTitle()}
          </h3>
          <p className="text-sm text-accent-foreground/90 max-w-md font-light leading-relaxed">
            {""}
          </p>
        </div>

        <Button
          size="lg"
          className="relative shrink-0 font-bold bg-background text-foreground hover:scale-105 shadow-md transition-all duration-200 cursor-pointer"
          render={({ ref, ...props }) => <Link {...(props as any)} to="/projects" />}
        >
          {m.guide_ctaButton()}
        </Button>
      </Card>
    </div>
  );
}
