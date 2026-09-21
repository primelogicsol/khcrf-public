import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Digital Loom – Book Interior UI Preview
 * Single-file React + TypeScript component
 *
 * Features
 * - True two-page spread (left+right) with page-flip animation
 * - Sidebar navigation (Preface, Intro, Contents, Chapter Open, Chapter Spread, Bibliography, Back Page)
 * - Zoom controls, full-screen mode
 * - Responsive: single page on small screens, spread on md+
 * - Print support (Ctrl/Cmd+P) via clean print stylesheet
 *
 * Requirements
 * - TailwindCSS enabled
 * - framer-motion installed
 */

type PageId =
  | "preface"
  | "intro"
  | "contents"
  | "chapter_open"
  | "chapter_body"
  | "bibliography"
  | "back";

type Spread = {
  id: PageId;
  label: string;
  left: React.ReactNode;
  right: React.ReactNode;
  pageNoLeft: string;
  pageNoRight: string;
};

type Props = {
  title?: string;
  author?: string;
  seriesLabel?: string;
  imprint?: string;
  year?: string;
  accentHex?: string;
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const DotRule = ({ accent }: { accent: string }) => (
  <div className="flex items-center gap-3 my-4">
    <div className="h-px flex-1 bg-black/10" />
    <div className="h-2 w-2 rounded-full" style={{ background: accent }} />
    <div className="h-px flex-1 bg-black/10" />
  </div>
);

const Footer = ({ left, pageNo }: { left: string; pageNo: string }) => (
  <div className="mt-auto pt-6 text-[11px] tracking-wide text-black/45 flex items-center justify-between">
    <span className="uppercase">{left}</span>
    <span className="tabular-nums">{pageNo}</span>
  </div>
);

const DropCap = ({
  letter,
  children,
}: {
  letter: string;
  children: React.ReactNode;
}) => (
  <p className="text-[14.5px] leading-7 text-black/85 text-justify">
    <span className="float-left mr-2 mt-2 text-[56px] leading-[48px] font-semibold text-black/80">
      {letter}
    </span>
    {children}
  </p>
);

const KeyTakeaways = ({ accent }: { accent: string }) => (
  <div className="rounded-xl border border-black/10 bg-white shadow-sm p-5">
    <div className="text-[11px] tracking-[0.18em] uppercase text-black/60 flex items-center justify-between">
      <span>Key Takeaways</span>
      <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
    </div>
    <div className="mt-3 space-y-3 text-[13px] leading-6 text-black/80">
      {[
        "Informal transactions weaken transparency and price fairness across craft supply chains.",
        "Value leakage rises when grading and provenance checks are weak or undocumented.",
        "A registry-led digital layer improves trust only when workflows are enforceable.",
      ].map((t) => (
        <div key={t} className="flex gap-2">
          <span className="mt-1 h-4 w-4 rounded-full border border-black/15 flex items-center justify-center text-[10px]">
            ✓
          </span>
          <span>{t}</span>
        </div>
      ))}
    </div>
  </div>
);

const MiniDiagram = ({ accent }: { accent: string }) => (
  <div className="rounded-xl border border-black/10 bg-white shadow-sm p-5">
    <div className="text-[11px] tracking-[0.18em] uppercase text-black/60">
      Value Fragmentation in the Supply Chain
    </div>

    <div className="mt-4 grid grid-cols-5 gap-2 items-center">
      {[
        { n: "Artisan", hi: true },
        { n: "Local Buyer" },
        { n: "Aggregator" },
        { n: "Exporter" },
        { n: "Retail" },
      ].map((x, i) => (
        <div key={x.n} className="relative">
          <div
            className="rounded-lg border border-black/10 bg-black/[0.02] px-2 py-2 text-[11px] text-center text-black/70"
            style={x.hi ? { borderColor: accent } : undefined}
          >
            {x.n}
          </div>
          {i < 4 && (
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-px w-4 bg-black/20" />
          )}
        </div>
      ))}
    </div>

    <div className="mt-4 text-[12.5px] leading-6 text-black/75">
      Leakage is highest where price discovery, quality grades, and provenance
      checks are weak or undocumented.
    </div>
  </div>
);

const PageFrame = ({
  accent,
  footerLeft,
  pageNo,
  children,
  side,
}: {
  accent: string;
  footerLeft: string;
  pageNo: string;
  children: React.ReactNode;
  side: "left" | "right";
}) => {
  return (
    <div className="relative min-h-[640px] bg-[#f5f1ea] px-10 py-10">
      {/* spine + inner shadow */}
      {side === "left" ? (
        <>
          <div className="absolute left-0 top-0 h-full w-[52px] bg-[#0f1a2a]" />
          <div
            className="absolute left-0 top-0 h-full w-[8px]"
            style={{ background: accent, opacity: 0.9 }}
          />
          <div className="absolute right-0 top-0 h-full w-[18px] bg-black/[0.03]" />
        </>
      ) : (
        <>
          <div className="absolute left-0 top-0 h-full w-[18px] bg-black/[0.03]" />
          <div className="absolute right-0 top-0 h-full w-[10px] bg-black/[0.02]" />
        </>
      )}

      <div className={side === "left" ? "pl-6" : "pl-6 pr-2"}>
        {children}
        <div className="mt-10">
          <Footer left={footerLeft} pageNo={pageNo} />
        </div>
      </div>
    </div>
  );
};

function SpreadShell({
  left,
  right,
  isSingle,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  isSingle: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[#f5f1ea] shadow-[0_16px_60px_rgba(0,0,0,0.18)] overflow-hidden border border-black/10">
      <div
        className={
          isSingle ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2"
        }
      >
        <div>{left}</div>
        {!isSingle && (
          <div className="border-t md:border-t-0 md:border-l border-black/10">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}

function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsMdUp(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return isMdUp;
}

export default function DigitalLoomBookPreview(props: Props) {
  const accent = props.accentHex ?? "#f36b21";
  const title = props.title ?? "The Digital Loom";
  const author = props.author ?? "Govind Mishra";
  const seriesLabel = props.seriesLabel ?? "BEST PRACTICE";
  const imprint = props.imprint ?? "KHCRF E-Publications";
  const year = props.year ?? "2025";

  const footerLeft = `${seriesLabel} JOURNAL · ${year}`;

  const spreads: Spread[] = useMemo(() => {
    const ContentsRow = ({ t, p }: { t: string; p: string }) => (
      <div className="flex items-baseline gap-3">
        <span className="min-w-0 flex-1">
          <span className="inline-block max-w-full truncate">{t}</span>
        </span>
        <span className="flex-1 border-b border-dotted border-black/30 translate-y-[-2px]" />
        <span className="tabular-nums text-black/60">{p}</span>
      </div>
    );

    return [
      {
        id: "preface",
        label: "Preface",
        pageNoLeft: "i",
        pageNoRight: "ii",
        left: (
          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55 flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: accent, opacity: 0.9 }}
              />
              {seriesLabel}
            </div>
            <h1 className="mt-6 text-[34px] leading-[40px] font-semibold text-black/80">
              Preface
            </h1>
            <DotRule accent={accent} />
            <div className="mt-6 space-y-6 text-[14.5px] leading-7 text-black/80 text-justify">
              <p>
                This publication is written for institutions, researchers, and
                practitioners who work with craft systems and want the policy
                and operational picture without ornament.
              </p>
              <p>
                Kashmir’s handicraft economy is often described through culture
                and heritage. Those frames matter, but they do not explain why
                value leaks, why verification fails, or why formal finance
                struggles to reach the workshop.
              </p>
              <p>
                The chapters that follow treat digitization as governance. Not
                as a feature. Not as a slogan. As a method for improving trust,
                traceability, accountability, and long-term institutional
                memory.
              </p>
            </div>
          </div>
        ),
        right: (
          <div className="pt-10">
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
              Note
            </div>
            <h2 className="mt-4 text-[28px] leading-[34px] font-semibold text-black/80">
              A working document for clarity, not consensus.
            </h2>
            <div className="mt-6 h-px w-full bg-black/10" />
            <div className="mt-8 space-y-6 text-[14.5px] leading-7 text-black/80 text-justify">
              <p>
                Where possible, the analysis favors institutional language:
                registries, controls, audit trails, incentives, and enforceable
                workflows.
              </p>
              <p>
                The intention is practical use: to support policy formulation,
                program design, and system implementation across craft clusters.
              </p>
            </div>
            <div className="mt-10 rounded-xl border border-black/10 bg-white/60 p-5">
              <div className="text-[11px] tracking-[0.18em] uppercase text-black/55">
                Publication
              </div>
              <div className="mt-2 text-[13px] text-black/80">
                <div className="flex justify-between">
                  <span>Title</span>
                  <span className="font-medium">{title}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Author</span>
                  <span className="font-medium">{author}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Imprint</span>
                  <span className="font-medium">{imprint}</span>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "intro",
        label: "Introduction",
        pageNoLeft: "1",
        pageNoRight: "2",
        left: (
          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55 flex items-center gap-2">
              <span
                className="inline-block h-[2px] w-8"
                style={{ background: accent }}
              />
              Chapter 1
            </div>
            <h1 className="mt-6 text-[34px] leading-[40px] font-semibold text-black/85">
              Introduction: <br />
              Weaving Governance into Craft Systems
            </h1>
            <div className="mt-5 text-[13px] text-black/65">
              How value leaks before it reaches the artisan.
            </div>
            <div className="mt-8 space-y-6">
              <DropCap letter="T">
                he craft economy is not only a cultural asset. It is also a
                system of procurement, quality assurance, pricing, verification,
                and distribution. When these controls are weak, the market still
                functions, but it functions unfairly.
              </DropCap>
              <p className="text-[14.5px] leading-7 text-black/80 text-justify">
                Digitization is often framed as convenience. In practice, its
                most important outcome is governance: clearer registries, better
                records, accountable workflows, and reduced ambiguity in
                provenance and grading.
              </p>
              <p className="text-[14.5px] leading-7 text-black/80 text-justify">
                This book focuses on governance and finance because these are
                the invisible layers that decide who benefits from the craft
                economy and who remains locked out.
              </p>
            </div>
          </div>
        ),
        right: (
          <div className="pt-6">
            <div className="rounded-xl border border-black/10 bg-white/60 p-6">
              <div className="text-[11px] tracking-[0.18em] uppercase text-black/55">
                Method Note
              </div>
              <div className="mt-3 text-[14px] leading-7 text-black/80">
                The approach combines policy review, institutional process
                mapping, and system-level design patterns used in public
                registries and compliance workflows.
              </div>
            </div>
            <div className="mt-8 space-y-6 text-[14.5px] leading-7 text-black/80 text-justify">
              <p>
                The aim is not to romanticize technology. It is to show how
                verifiable records and enforceable governance improve market
                trust without depending on informal reputation alone.
              </p>
              <p>
                The chapters are written to be read independently. Each chapter
                ends with key takeaways for quick policy and implementation use.
              </p>
            </div>
            <div className="mt-10">
              <DotRule accent={accent} />
              <div className="mt-5 text-[13px] text-black/65">
                Next: contents, then the system map of the craft economy.
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "contents",
        label: "Contents",
        pageNoLeft: "7",
        pageNoRight: "8",
        left: (
          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
              {seriesLabel}
            </div>
            <h1 className="mt-6 text-[34px] leading-[40px] font-semibold text-black/85">
              Contents
            </h1>
            <DotRule accent={accent} />
            <div className="mt-10 space-y-4 text-[14.5px] leading-7 text-black/80">
              <ContentsRow t="Preface" p="i" />
              <ContentsRow t="Introduction" p="1" />
              <ContentsRow
                t="Chapter 1 · The Craft Economy as a System"
                p="9"
              />
              <ContentsRow
                t="Chapter 2 · Governance Failures and Policy Gaps"
                p="21"
              />
              <ContentsRow
                t="Chapter 3 · Financial Exclusion and Informal Markets"
                p="39"
              />
              <ContentsRow
                t="Chapter 4 · Blockchain, Traceability, and Trust"
                p="57"
              />
              <ContentsRow
                t="Chapter 5 · Institutional Models for Kashmir"
                p="79"
              />
              <ContentsRow t="Chapter 6 · Implementation Framework" p="103" />
              <ContentsRow t="Bibliography" p="127" />
              <ContentsRow t="Back Page" p="131" />
            </div>
          </div>
        ),
        right: (
          <div className="pt-10">
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
              Reading Guide
            </div>
            <h2 className="mt-4 text-[24px] leading-[30px] font-semibold text-black/85">
              Use chapters as modules.
            </h2>
            <div className="mt-6 space-y-5 text-[14.5px] leading-7 text-black/80 text-justify">
              <p>
                Chapter 1 frames the craft economy as a system. Chapters 2 and 3
                isolate governance and finance failures. Chapters 4 and 6 focus
                on implementation logic and controls.
              </p>
              <p>
                If you are a policymaker, begin with Chapters 2 and 6. If you
                are a technical practitioner, begin with Chapters 1 and 4.
              </p>
            </div>
            <div className="mt-10 rounded-xl border border-black/10 bg-white/60 p-5">
              <div className="text-[11px] tracking-[0.18em] uppercase text-black/55">
                Quick Index
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-[13px] text-black/75">
                <div>Governance controls</div>
                <div className="text-right tabular-nums">Ch. 2, 6</div>
                <div>Financial inclusion</div>
                <div className="text-right tabular-nums">Ch. 3</div>
                <div>Traceability model</div>
                <div className="text-right tabular-nums">Ch. 4</div>
                <div>Institutional design</div>
                <div className="text-right tabular-nums">Ch. 5</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "chapter_open",
        label: "Chapter Open",
        pageNoLeft: "9",
        pageNoRight: "10",
        left: (
          <div className="pt-6">
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55 flex items-center gap-2">
              <span
                className="inline-block h-[2px] w-8"
                style={{ background: accent }}
              />
              Chapter 1
            </div>
            <div className="mt-10 text-[78px] leading-[72px] font-semibold text-black/20">
              01
            </div>
            <h1 className="mt-6 text-[36px] leading-[42px] font-semibold text-black/85">
              The Craft Economy <br /> as a System
            </h1>
            <div className="mt-6 text-[14px] leading-7 text-black/70 max-w-[28rem]">
              A systems view reveals where trust breaks, where value leaks, and
              where verification must become enforceable.
            </div>
            <div className="mt-10 rounded-xl border border-black/10 bg-white/60 p-5 max-w-[30rem]">
              <div className="text-[11px] tracking-[0.18em] uppercase text-black/55">
                Chapter Thesis
              </div>
              <div className="mt-2 text-[14.5px] leading-7 text-black/80">
                A craft economy becomes fair only when its records are
                consistent, its incentives are aligned, and its market claims
                are verifiable.
              </div>
            </div>
          </div>
        ),
        right: (
          <div className="pt-12">
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
              Outline
            </div>
            <div className="mt-6 space-y-4 text-[14.5px] leading-7 text-black/80">
              {[
                "Actors and roles in the craft supply chain",
                "Information gaps and weak verification points",
                "How informal systems shape pricing",
                "What a governance-first digital layer looks like",
              ].map((t) => (
                <div key={t} className="flex gap-3">
                  <span
                    className="mt-2 h-2 w-2 rounded-full"
                    style={{ background: accent }}
                  />
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 h-px w-full bg-black/10" />
            <div className="mt-10 text-[14.5px] leading-7 text-black/80 text-justify">
              This chapter sets the foundation for later chapters on policy
              gaps, financial exclusion, and traceability design. Read it as a
              system map, not as narrative.
            </div>
          </div>
        ),
      },
      {
        id: "chapter_body",
        label: "Chapter Spread",
        pageNoLeft: "39",
        pageNoRight: "40",
        left: (
          <div className="pt-2">
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55 flex items-center gap-2">
              <span
                className="inline-block h-[2px] w-8"
                style={{ background: accent }}
              />
              Chapter 3
            </div>
            <h1 className="mt-6 text-[34px] leading-[40px] font-semibold text-black/85">
              Financial Exclusion <br /> and Informal Markets
            </h1>
            <div className="mt-4 text-[13px] text-black/65">
              How value leaks before it reaches the artisan.
            </div>
            <div className="mt-8 space-y-6">
              <DropCap letter="T">
                he exclusion problem is rarely a single barrier. It is
                cumulative: missing records, irregular demand, weak credit
                signals, and informal enforcement that replaces contracts.
              </DropCap>
              <p className="text-[14.5px] leading-7 text-black/80 text-justify">
                When finance cannot price risk, it either overprices it or
                withdraws entirely. This pushes production cycles into informal
                borrowing and advances, where the artisan’s bargaining power
                collapses.
              </p>
              <p className="text-[14.5px] leading-7 text-black/80 text-justify">
                The most practical intervention is not “more apps.” It is
                verifiable documentation: identity, production records, quality
                grading, and traceable transaction history.
              </p>
            </div>
          </div>
        ),
        right: (
          <div className="pt-6 space-y-6">
            <KeyTakeaways accent={accent} />
            <MiniDiagram accent={accent} />
          </div>
        ),
      },
      {
        id: "bibliography",
        label: "Bibliography",
        pageNoLeft: "127",
        pageNoRight: "128",
        left: (
          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
              {seriesLabel}
            </div>
            <h1 className="mt-6 text-[34px] leading-[40px] font-semibold text-black/85">
              Bibliography
            </h1>
            <DotRule accent={accent} />

            <div className="mt-10">
              <div className="text-[11px] tracking-[0.18em] uppercase text-black/55">
                Policy Documents
              </div>
              <div className="mt-4 space-y-3 text-[13.5px] leading-6 text-black/80">
                <div className="pl-4 -indent-4">
                  Government of India. 1999.{" "}
                  <i>
                    Geographical Indications of Goods (Registration and
                    Protection) Act
                  </i>
                  .
                </div>
                <div className="pl-4 -indent-4">
                  WIPO. 2017. <i>Geographical Indications: An Introduction</i>.
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="text-[11px] tracking-[0.18em] uppercase text-black/55">
                Academic Literature
              </div>
              <div className="mt-4 space-y-3 text-[13.5px] leading-6 text-black/80">
                <div className="pl-4 -indent-4">
                  Author, A. 2020. <i>Trust Systems and Market Governance</i>.
                  University Press.
                </div>
                <div className="pl-4 -indent-4">
                  Author, B. 2022. <i>Informal Finance and Value Chains</i>.
                  Journal of Development Systems.
                </div>
              </div>
            </div>
          </div>
        ),
        right: (
          <div className="pt-10">
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
              Notes
            </div>
            <div className="mt-6 space-y-6 text-[14.5px] leading-7 text-black/80 text-justify">
              <p>
                Citations are grouped by type to support policy review,
                implementation planning, and governance design. Add verified
                institutional reports where available.
              </p>
              <p>
                For print, keep URLs minimal and prefer stable institutional
                documents. For digital editions, links may be listed in a
                separate appendix.
              </p>
            </div>
            <div className="mt-10 rounded-xl border border-black/10 bg-white/60 p-5">
              <div className="text-[11px] tracking-[0.18em] uppercase text-black/55">
                Format
              </div>
              <div className="mt-2 text-[13.5px] leading-6 text-black/80">
                Use one style consistently (APA / Chicago). Keep hanging indent
                and stable ordering.
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "back",
        label: "Back Page",
        pageNoLeft: "131",
        pageNoRight: "132",
        left: (
          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
              {seriesLabel}
            </div>
            <h1 className="mt-6 text-[34px] leading-[40px] font-semibold text-black/85">
              Back Page
            </h1>
            <DotRule accent={accent} />
            <div className="mt-16 text-center px-6">
              <div className="text-[22px] leading-9 text-black/75">
                Systems endure longer <br />
                than intentions.
              </div>
              <div className="mt-6 text-[16px] leading-8 text-black/70">
                This book is an attempt <br />
                to build one.
              </div>
            </div>
          </div>
        ),
        right: (
          <div className="pt-24 text-center">
            <div className="text-[12px] tracking-[0.22em] uppercase text-black/55">
              {imprint}
            </div>
            <div className="mt-6 text-[14px] text-black/75">
              ISBN: 4651 | {year} | P<div className="mt-2">www.khcrf.org</div>
            </div>
            <div className="mt-16 mx-auto h-px w-2/3 bg-black/10" />
            <div className="mt-10 text-[13.5px] leading-7 text-black/70 max-w-[26rem] mx-auto">
              Governance, finance, and verification are the hidden
              infrastructure of craft. This publication supports institutions
              seeking enforceable clarity.
            </div>
            <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-[12px] text-black/70">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: accent }}
              />
              Digital Edition · Print-Ready Layout
            </div>
          </div>
        ),
      },
    ];
  }, [accent, author, imprint, seriesLabel, title, year]);

  const isMdUp = useIsMdUp();
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const spread = spreads[idx];

  const canPrev = idx > 0;
  const canNext = idx < spreads.length - 1;

  const go = (n: number) => setIdx(clamp(n, 0, spreads.length - 1));
  const next = () => canNext && go(idx + 1);
  const prev = () => canPrev && go(idx - 1);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "=") {
        e.preventDefault();
        setZoom((z) => clamp(Number((z + 0.1).toFixed(2)), 0.8, 1.6));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        setZoom((z) => clamp(Number((z - 0.1).toFixed(2)), 0.8, 1.6));
      }
      if (e.key.toLowerCase() === "f") setFullscreen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, canNext, canPrev]);

  // Fullscreen behavior
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    if (fullscreen) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      if (document.fullscreenElement)
        document.exitFullscreen?.().catch(() => {});
    }
  }, [fullscreen]);

  // Sync state if user exits fullscreen via ESC
  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const spreadKey = `${spread.id}-${idx}`;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0b0f18] text-white">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #print-area { transform: none !important; }
          .print-sheet { box-shadow: none !important; border: 1px solid rgba(0,0,0,0.15) !important; }
        }
      `}</style>

      <div className="no-print max-w-[1280px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-[12px] tracking-[0.22em] uppercase text-white/60">
              {seriesLabel}
            </div>
            <div className="mt-2 text-[28px] leading-8 font-semibold">
              {title}
            </div>
            <div className="mt-1 text-white/60 text-[13px]">
              Interior UI Preview · {author}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={prev}
              disabled={!canPrev}
              className={`px-3 py-2 rounded-full text-[13px] border transition ${
                canPrev
                  ? "bg-white/5 text-white/80 border-white/15 hover:bg-white/10"
                  : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
              }`}
            >
              ← Prev
            </button>
            <button
              onClick={next}
              disabled={!canNext}
              className={`px-3 py-2 rounded-full text-[13px] border transition ${
                canNext
                  ? "bg-white/5 text-white/80 border-white/15 hover:bg-white/10"
                  : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
              }`}
            >
              Next →
            </button>

            <div className="h-7 w-px bg-white/15 mx-1" />

            <button
              onClick={() =>
                setZoom((z) => clamp(Number((z - 0.1).toFixed(2)), 0.8, 1.6))
              }
              className="px-3 py-2 rounded-full text-[13px] border bg-white/5 text-white/80 border-white/15 hover:bg-white/10"
            >
              −
            </button>
            <div className="px-3 py-2 rounded-full text-[13px] border bg-white/5 text-white/70 border-white/15 tabular-nums">
              {Math.round(zoom * 100)}%
            </div>
            <button
              onClick={() =>
                setZoom((z) => clamp(Number((z + 0.1).toFixed(2)), 0.8, 1.6))
              }
              className="px-3 py-2 rounded-full text-[13px] border bg-white/5 text-white/80 border-white/15 hover:bg-white/10"
            >
              +
            </button>

            <div className="h-7 w-px bg-white/15 mx-1" />

            <button
              onClick={() => setFullscreen((v) => !v)}
              className="px-3 py-2 rounded-full text-[13px] border bg-white/5 text-white/80 border-white/15 hover:bg-white/10"
              title="Toggle fullscreen (F)"
            >
              {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-full text-[13px] border bg-white/5 text-white/80 border-white/15 hover:bg-white/10"
              title="Print (Ctrl/Cmd+P)"
            >
              Print
            </button>

            <div className="flex items-center gap-2 ml-1">
              <span className="text-white/60 text-[12px]">Accent</span>
              <span
                className="h-3 w-3 rounded-full border border-white/20"
                style={{ background: accent }}
              />
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          {/* Sidebar */}
          <div className="no-print rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-[12px] tracking-[0.18em] uppercase text-white/60">
              Pages
            </div>
            <div className="mt-3 space-y-2">
              {spreads.map((s, i) => {
                const active = i === idx;
                return (
                  <button
                    key={s.id}
                    onClick={() => go(i)}
                    className={`w-full text-left px-3 py-3 rounded-xl border transition ${
                      active
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{s.label}</div>
                      <div className="text-[12px] tabular-nums opacity-70">
                        {s.pageNoLeft}
                        {isMdUp ? `–${s.pageNoRight}` : ""}
                      </div>
                    </div>
                    <div
                      className={`mt-1 text-[12px] ${active ? "text-black/70" : "text-white/50"}`}
                    >
                      {s.id === "chapter_body"
                        ? "Body + key takeaways"
                        : s.id === "contents"
                          ? "Dotted leaders"
                          : s.id === "bibliography"
                            ? "Hanging indent"
                            : s.id === "back"
                              ? "Minimal statement"
                              : "Standard layout"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[12px] text-white/60 leading-6">
              Shortcuts: <span className="text-white/80">←</span>/
              <span className="text-white/80">→</span> to flip,
              <span className="text-white/80"> F</span> fullscreen,{" "}
              <span className="text-white/80">Ctrl/Cmd +</span> /{" "}
              <span className="text-white/80">-</span> zoom.
            </div>
          </div>

          {/* Book */}
          <div className="flex flex-col items-center">
            <div
              id="print-area"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
              }}
            >
              <div className="w-full max-w-[1020px]">
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={spreadKey}
                      initial={{ opacity: 0, rotateY: -10, x: 10 }}
                      animate={{ opacity: 1, rotateY: 0, x: 0 }}
                      exit={{ opacity: 0, rotateY: 10, x: -10 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="print-sheet"
                    >
                      <SpreadShell
                        isSingle={!isMdUp}
                        left={
                          <PageFrame
                            accent={accent}
                            footerLeft={footerLeft}
                            pageNo={spread.pageNoLeft}
                            side="left"
                          >
                            {spread.left}
                          </PageFrame>
                        }
                        right={
                          <PageFrame
                            accent={accent}
                            footerLeft={footerLeft}
                            pageNo={spread.pageNoRight}
                            side="right"
                          >
                            {spread.right}
                          </PageFrame>
                        }
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* subtle desk shadow */}
                  <div className="mx-auto mt-6 h-4 w-[78%] rounded-full bg-black/30 blur-[16px]" />
                </div>
              </div>
            </div>

            {/* Bottom meta */}
            <div className="no-print w-full max-w-[1020px] mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="text-white/60 text-[13px] leading-6">
                Spread: <span className="text-white/80">{spread.label}</span> ·
                Pages {spread.pageNoLeft}
                {isMdUp ? `–${spread.pageNoRight}` : ""}
              </div>
              <div className="text-white/40 text-[12px]">
                Imprint: {imprint}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only fallback (keeps page centered) */}
      <div className="hidden print:block p-6">
        <div className="text-black text-sm">
          {title} · {author}
        </div>
      </div>
    </div>
  );
}
