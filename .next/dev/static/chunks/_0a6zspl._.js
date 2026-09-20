(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/onboarding/checklist.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnboardingChecklist",
    ()=>OnboardingChecklist
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cohortData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/cohortData.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const KEY = "sandbox:onboarding:v1";
const EVENT = "sandbox:onboarding-change";
function subscribe(callback) {
    window.addEventListener("storage", callback);
    window.addEventListener(EVENT, callback);
    return ()=>{
        window.removeEventListener("storage", callback);
        window.removeEventListener(EVENT, callback);
    };
}
/** Raw JSON string so useSyncExternalStore can compare snapshots by value. */ function getSnapshot() {
    try {
        return window.localStorage.getItem(KEY) ?? "[]";
    } catch  {
        return "[]"; // storage blocked (private mode): checklist still works for this page view
    }
}
const getServerSnapshot = ()=>"[]";
function parse(raw) {
    try {
        const value = JSON.parse(raw);
        return Array.isArray(value) ? value.filter((v)=>typeof v === "string") : [];
    } catch  {
        return [];
    }
}
const groups = [
    {
        key: "bring",
        title: "Bring to every session",
        note: "Laptops are required. No coding background needed."
    },
    {
        key: "accounts",
        title: "Set up before October 16",
        note: "Have these ready on your laptop before Day 1."
    }
];
function OnboardingChecklist() {
    _s();
    const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getSnapshot, getServerSnapshot);
    const checked = parse(raw);
    const toggle = (id)=>{
        const next = checked.includes(id) ? checked.filter((x)=>x !== id) : [
            ...checked,
            id
        ];
        try {
            window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch  {
        /* ignore: storage unavailable */ }
        window.dispatchEvent(new Event(EVENT));
    };
    const total = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cohortData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onboardingChecklist"].length;
    const done = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cohortData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onboardingChecklist"].filter((i)=>checked.includes(i.id)).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-4 border border-navy-900 bg-navy-900 p-5 text-white",
                "data-surface": "dark",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "label text-amber",
                                children: "Your progress"
                            }, void 0, false, {
                                fileName: "[project]/components/onboarding/checklist.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 font-display text-2xl",
                                role: "status",
                                children: [
                                    done,
                                    " of ",
                                    total,
                                    " ready"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/onboarding/checklist.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/onboarding/checklist.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("progress", {
                        className: "h-2 w-full flex-1 basis-56 overflow-hidden rounded-none bg-white/20 [&::-moz-progress-bar]:bg-amber [&::-webkit-progress-bar]:bg-white/20 [&::-webkit-progress-value]:bg-amber",
                        value: done,
                        max: total,
                        "aria-label": "Onboarding checklist progress"
                    }, void 0, false, {
                        fileName: "[project]/components/onboarding/checklist.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        className: "no-print text-white",
                        onClick: ()=>window.print(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                className: "size-4",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/components/onboarding/checklist.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this),
                            "Print"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/onboarding/checklist.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/onboarding/checklist.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8 grid gap-8 lg:grid-cols-2",
                children: groups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                        className: "min-w-0 border border-line bg-white p-5 sm:p-7",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                className: "px-2 font-display text-2xl text-navy-900",
                                children: group.title
                            }, void 0, false, {
                                fileName: "[project]/components/onboarding/checklist.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-4 text-sm text-muted",
                                children: group.note
                            }, void 0, false, {
                                fileName: "[project]/components/onboarding/checklist.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-3",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cohortData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onboardingChecklist"].filter((item)=>item.group === group.key).map((item)=>{
                                    const isChecked = checked.includes(item.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: `flex cursor-pointer gap-4 border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy-900 ${isChecked ? "border-success bg-success/5" : "border-line hover:border-navy-900"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    className: "peer sr-only",
                                                    checked: isChecked,
                                                    onChange: ()=>toggle(item.id)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/onboarding/checklist.tsx",
                                                    lineNumber: 100,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    "aria-hidden": "true",
                                                    className: `mt-0.5 grid size-6 shrink-0 place-items-center border-2 ${isChecked ? "border-success bg-success text-white" : "border-edge bg-white text-transparent"}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "size-4",
                                                        strokeWidth: 3
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/onboarding/checklist.tsx",
                                                        lineNumber: 112,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/onboarding/checklist.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "block font-semibold text-ink",
                                                            children: item.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/onboarding/checklist.tsx",
                                                            lineNumber: 115,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "mt-1 block text-[0.9375rem] leading-relaxed text-muted",
                                                            children: item.detail
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/onboarding/checklist.tsx",
                                                            lineNumber: 116,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/onboarding/checklist.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/onboarding/checklist.tsx",
                                            lineNumber: 95,
                                            columnNumber: 23
                                        }, this)
                                    }, item.id, false, {
                                        fileName: "[project]/components/onboarding/checklist.tsx",
                                        lineNumber: 94,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/onboarding/checklist.tsx",
                                lineNumber: 88,
                                columnNumber: 13
                            }, this)
                        ]
                    }, group.key, true, {
                        fileName: "[project]/components/onboarding/checklist.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/onboarding/checklist.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "no-print mt-5 text-sm text-muted",
                children: "Your checklist progress is saved in this browser only."
            }, void 0, false, {
                fileName: "[project]/components/onboarding/checklist.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/onboarding/checklist.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(OnboardingChecklist, "7gfPOUJ0i+MGujMWz5Qu5ZYoo44=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = OnboardingChecklist;
var _c;
__turbopack_context__.k.register(_c, "OnboardingChecklist");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/data/cohortData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Single source of truth for cohort content.
 * Sourced from "Executive AI Leadership Curriculum" (The AI Executive Sandbox version).
 * Edit here and the landing page, dashboard, admin roster and capstone tracker all update.
 */ __turbopack_context__.s([
    "capstoneSteps",
    ()=>capstoneSteps,
    "cohortStats",
    ()=>cohortStats,
    "deliverableSessions",
    ()=>deliverableSessions,
    "deliverableStatuses",
    ()=>deliverableStatuses,
    "focusAreas",
    ()=>focusAreas,
    "frictionFrequencies",
    ()=>frictionFrequencies,
    "instructor",
    ()=>instructor,
    "onboardingChecklist",
    ()=>onboardingChecklist,
    "resourceKinds",
    ()=>resourceKinds,
    "safeHarbor",
    ()=>safeHarbor,
    "sessionById",
    ()=>sessionById,
    "sessions",
    ()=>sessions,
    "site",
    ()=>site,
    "valueMatrix",
    ()=>valueMatrix
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const site = {
    name: "The AI Executive Sandbox",
    tagline: "Applied Leadership & Innovation",
    headline: "Applied AI for Leadership & Business Innovation",
    url: "https://keishasolomon.com",
    contactEmail: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
    format: "8-month cohort · 90-minute in-person sessions"
};
const instructor = {
    name: "Keisha Solomon",
    company: "EVOBRAND Concepts",
    role: "Lead Instructor",
    summary: "Keisha Solomon leads a practical, ethical and accessible approach to AI for local leaders, entrepreneurs and organizational teams: tools that save time and improve operations, taught through live builds instead of lectures."
};
const cohortStats = [
    {
        value: "8",
        label: "Monthly sessions"
    },
    {
        value: "90",
        label: "Minutes, all hands-on"
    },
    {
        value: "7",
        label: "Working assets built"
    },
    {
        value: "0",
        label: "Coding required"
    }
];
const focusAreas = [
    "Mindset & Governance",
    "Workflow & Automation",
    "Brand & Prototyping",
    "Capstone & Launch"
];
/** Standard run-of-show, sessions 1 to 7. */ const standardAgenda = [
    {
        start: "00:00",
        end: "00:10",
        minutes: 10,
        title: "The Brag Board",
        detail: "Wins and troubleshooting from last month's build."
    },
    {
        start: "00:10",
        end: "00:35",
        minutes: 25,
        title: "Interactive Concept & Executive Framework",
        detail: "The hook plus the month's strategy, live and unscripted."
    },
    {
        start: "00:35",
        end: "01:10",
        minutes: 35,
        title: "The Build Lab",
        detail: "Everyone builds the tool live on their laptop."
    },
    {
        start: "01:10",
        end: "01:25",
        minutes: 15,
        title: "Peer Review & Stress Testing",
        detail: "Pair up and try to break each other's work."
    },
    {
        start: "01:25",
        end: "01:30",
        minutes: 5,
        title: "Next Month Challenge & Adjourn",
        detail: "The milestone to hit before the next session."
    }
];
/** Final showcase, 90-minute window. */ const showcaseAgenda = [
    {
        start: "00:00",
        end: "00:10",
        minutes: 10,
        title: "Welcome & Opening Remarks",
        detail: "Program reflection and introductions."
    },
    {
        start: "00:10",
        end: "01:10",
        minutes: 60,
        title: "Capstone Lightning Demos",
        detail: "Each participant shows a working AI project: problem, solution, measurable impact."
    },
    {
        start: "01:10",
        end: "01:20",
        minutes: 10,
        title: "Future-Proofing & Strategic AI Roadmap",
        detail: "Sustaining experimentation and navigating next-generation tools."
    },
    {
        start: "01:20",
        end: "01:30",
        minutes: 10,
        title: "Peer Awards & Graduation",
        detail: "Cohort-voted recognitions, certificates and credential conferral."
    }
];
const sessions = [
    {
        id: "s1",
        number: 1,
        date: "2026-10-16",
        dateLabel: "October 16, 2026",
        shortDate: "Oct 16",
        theme: "Executive AI Mindset & Strategic Landscape",
        focus: "Mindset & Governance",
        hook: {
            name: "The Prompt Duel",
            description: "Raw, basic instructions go head to head with advanced, persona-driven prompts. The outputs are judged live on screen."
        },
        concepts: [
            "Generative AI vs. traditional automation: cutting through the hype",
            "The anatomy of a high-leverage prompt: context, role, constraints and feedback loops",
            "Cognitive offloading: the repetitive mental tasks that drain 30–40% of an executive's day",
            "Finding operational bottlenecks and high-impact use cases"
        ],
        lab: {
            name: "Build Your Executive Digital Twin",
            description: "Program a persistent workspace with your background, voice, communication style and business constraints, so you never start a conversation from scratch again."
        },
        deliverable: {
            title: "AI Readiness Audit",
            description: "A personal AI Readiness & Opportunity Audit for your business or role, plus a role-calibrated AI system ready for daily email drafting, meeting synthesis and decision analysis."
        },
        agenda: standardAgenda
    },
    {
        id: "s2",
        number: 2,
        date: "2026-11-20",
        dateLabel: "November 20, 2026",
        shortDate: "Nov 20",
        theme: "AI Red-Teaming, Governance, Ethics & Privacy",
        focus: "Mindset & Governance",
        hook: {
            name: "The Security Escape Room",
            description: "In pairs, review realistic mock employee prompts and hunt for data leaks, copyright traps and implicit bias."
        },
        concepts: [
            "Safe harbor rules: protecting customer data, proprietary formulas and internal documents in public models",
            "Ethical implementation and bias mitigation in client-facing and regulated settings",
            "Digital accessibility and fairness: keeping AI-assisted communication inclusive",
            "IP and confidentiality when using third-party models"
        ],
        lab: {
            name: "The Policy Sprint",
            description: "Draft a straightforward one-page Safe Harbor AI Guide for internal staff and contractors."
        },
        deliverable: {
            title: "Safe Harbor Usage Policy",
            description: "An executive-approved Organizational AI Usage Policy tailored to your sector: acceptable tools, data boundaries and escalation paths."
        },
        agenda: standardAgenda
    },
    {
        id: "s3",
        number: 3,
        date: "2026-12-18",
        dateLabel: "December 18, 2026",
        shortDate: "Dec 18",
        theme: "The 5-Hour Workweek Reclaim & Executive Workflows",
        focus: "Workflow & Automation",
        hook: {
            name: "The Tedium Audit",
            description: "Everyone writes down their single most annoying, repetitive task, and the room competes to solve or eliminate it with AI."
        },
        concepts: [
            "Inbox triage, calendar planning and meeting synthesis",
            "Document dissection: contract extraction, vendor invoice comparison, policy translation",
            "Managing AI output: verifying accuracy, catching hallucinations, fact-checking",
            "Maximizing personal productivity without breaking corporate tool limits"
        ],
        lab: {
            name: "Build an Executive Triage Workflow",
            description: "Set up a template that ingests messy agendas, notes or customer emails and returns prioritized action items with deadlines."
        },
        deliverable: {
            title: "Executive Triage Workspace",
            description: "A working Triage Assistant template that returns an estimated 3–5 hours per week."
        },
        agenda: standardAgenda
    },
    {
        id: "s4",
        number: 4,
        date: "2027-01-15",
        dateLabel: "January 15, 2027",
        shortDate: "Jan 15",
        theme: "No-Code Automation & Business Pipelines",
        focus: "Workflow & Automation",
        hook: {
            name: "The Zero-Touch Lead",
            description: "Watch a client intake form qualify a lead, update records and draft a custom response without a single manual click."
        },
        concepts: [
            "Trigger-based automation: connecting forms, spreadsheets and email with accessible no-code tools",
            "Layering AI onto legacy workplace tools without expensive overhauls",
            "Routine process optimization: invoicing, customer inquiries, lead qualification"
        ],
        lab: {
            name: "The Mini-Automation Pipeline",
            description: "Configure a live automated trigger, such as customer request routing or a follow-up sequence."
        },
        deliverable: {
            title: "Operational Trigger Pipeline",
            description: "An operational automated intake or routing workflow deployed for your business."
        },
        agenda: standardAgenda
    },
    {
        id: "s5",
        number: 5,
        date: "2027-02-19",
        dateLabel: "February 19, 2027",
        shortDate: "Feb 19",
        theme: "Brand Authority & Content Engines",
        focus: "Brand & Prototyping",
        hook: {
            name: "The Imposter Test",
            description: "Three versions of one article: human-written, generic AI, and voice-calibrated AI. The room votes on which is genuine."
        },
        concepts: [
            "Thought leadership vs. robotic fluff: infusing lived experience into AI-assisted writing",
            "Multi-modal repurposing: one voice memo becomes a 30-day multi-channel calendar",
            "Using image, voice and video synthesis safely and effectively"
        ],
        lab: {
            name: "Brand Voice Calibration",
            description: "Feed past speeches, newsletters or emails into your AI workspace to extract and save a distinctive brand style matrix."
        },
        deliverable: {
            title: "Brand Knowledge Base & Content Calendar",
            description: "A reusable Brand Voice Bible and a draft 30-day editorial campaign, ready to publish."
        },
        agenda: standardAgenda
    },
    {
        id: "s6",
        number: 6,
        date: null,
        dateLabel: "March 2027 (Date TBA)",
        shortDate: "Mar TBA",
        theme: "Rapid Prototyping & Web Strategy",
        focus: "Brand & Prototyping",
        hook: {
            name: "Concept to Mockup in 20 Minutes",
            description: "Take an idea from conversation to interactive prototype in real time."
        },
        concepts: [
            "Demystifying tech builds: AI-generated wireframes, customer portals and landing pages",
            "Customer touchpoints: chatbots, FAQ automation and interactive intake forms",
            "Scoping tech partners: evaluating developer estimates and avoiding overpaying for routine builds"
        ],
        lab: {
            name: "Interactive Asset Build",
            description: "Build a live prototype of a customer feedback portal, landing page or interactive event guide."
        },
        deliverable: {
            title: "Interactive Intake / Prototype Mockup",
            description: "A functional, shareable interactive prototype or digital asset link."
        },
        agenda: standardAgenda
    },
    {
        id: "s7",
        number: 7,
        date: "2027-04-16",
        dateLabel: "April 16, 2027",
        shortDate: "Apr 16",
        theme: "Capstone Incubator & Change Management",
        focus: "Capstone & Launch",
        hook: {
            name: "The Shark Tank Dry Run",
            description: "Peer-to-peer two-minute pitch rounds to pressure-test every capstone project before graduation."
        },
        concepts: [
            "Overcoming organizational inertia: guiding hesitant teams through adoption",
            "Measuring ROI: time saved, response times shortened, operational dollars preserved",
            "30-60-90 day deployment roadmaps after the cohort ends"
        ],
        lab: {
            name: "Capstone Polish",
            description: "Fine-tune prompt setups, automations and presentation decks with one-on-one troubleshooting."
        },
        deliverable: {
            title: "Stakeholder Capstone Package",
            description: "A completed capstone project and executive AI strategic plan, ready for stakeholder demonstration."
        },
        agenda: standardAgenda
    },
    {
        id: "s8",
        number: 8,
        date: "2027-05-11",
        dateLabel: "May 11, 2027",
        shortDate: "May 11",
        theme: "Final Showcase, Project Presentations & Graduation",
        focus: "Capstone & Launch",
        hook: {
            name: "Peer Awards",
            description: "Cohort-voted recognitions such as Biggest Time Saver, Most Creative Automation and Best Governance Champion."
        },
        concepts: [
            "Lightning demos: the operational problem, the solution you built, the measurable impact",
            "Peer feedback on scalability, governance and long-term sustainability",
            "Future-proofing roadmap for next-generation tools"
        ],
        lab: {
            name: "Lightning Presentations",
            description: "Five-minute live demonstrations of each participant's working AI project."
        },
        deliverable: null,
        agenda: showcaseAgenda
    }
];
const deliverableSessions = sessions.filter((s)=>s.deliverable !== null);
const sessionById = (id)=>sessions.find((s)=>s.id === id);
const valueMatrix = {
    pillars: [
        {
            title: "Active over passive",
            body: "No lecturing off slides for hours. Sessions are rapid-fire and experiential, tied to the friction you face at work."
        },
        {
            title: "Gamified builds",
            body: "Every session has a hook: a duel, an escape room, a pitch round. You learn by doing, and by trying to break each other's work."
        },
        {
            title: "Zero fluff, immediate ROI",
            body: "Every month ends with a finished, working asset you can deploy the very next morning."
        }
    ],
    rows: [
        {
            dimension: "Session format",
            passive: "Slides and demos you watch",
            sandbox: "Live builds on your own laptop"
        },
        {
            dimension: "Practice",
            passive: "Homework you may never do",
            sandbox: "Peer stress-testing inside the session"
        },
        {
            dimension: "Content",
            passive: "Generic tool tours",
            sandbox: "Your workplace friction log drives the labs"
        },
        {
            dimension: "Monthly outcome",
            passive: "Notes and a certificate",
            sandbox: "A working asset: policy, workflow, pipeline or prototype"
        },
        {
            dimension: "Risk",
            passive: "Real data pasted into public models",
            sandbox: "Sanitized data and safe harbor rules from day one"
        }
    ]
};
const onboardingChecklist = [
    {
        id: "laptop",
        group: "bring",
        title: "Your laptop and charger",
        detail: "Every session is an interactive build lab. Tablets and phones alone don't give you enough flexibility for the exercises."
    },
    {
        id: "friction-log",
        group: "bring",
        title: 'A "Workplace Friction" log',
        detail: "Track repetitive, time-consuming tasks such as inbox triage, recurring communications, agendas or data re-entry. The labs target these directly. You can keep it right in your participant dashboard."
    },
    {
        id: "ai-account",
        group: "accounts",
        title: "A primary AI account: ChatGPT and/or Claude",
        detail: "A free or Plus/Pro account works. A paid plan unlocks advanced reasoning models, project workspaces and custom agents, but isn't required for Day 1."
    },
    {
        id: "google-account",
        group: "accounts",
        title: "A Google account",
        detail: "Used for shared cohort resources, session prompt sheets and collaborative templates."
    },
    {
        id: "workplace-tools",
        group: "accounts",
        title: "Access to your everyday business tools",
        detail: "Word/Excel, Google Docs/Sheets or your email client, so you can plug what we build straight into your daily flow."
    }
];
const safeHarbor = {
    title: "Confidentiality & Safe Harbor Pledge",
    intro: "You will never be asked to put proprietary customer records, confidential health details or private financial accounts into unapproved public models during class.",
    commitments: [
        {
            title: "Confidentiality first",
            body: "No live exercise requires real proprietary data. If it isn't yours to share, it stays out of the model."
        },
        {
            title: "Sanitized data, always",
            body: "You'll learn to sanitize documents and build custom guardrails, so organizational compliance and privacy standards stay intact."
        },
        {
            title: "Your work stays yours",
            body: "Deliverables are shared only with the instructor. Everything you record on this platform is visible to you and Keisha alone."
        }
    ]
};
const capstoneSteps = [
    {
        id: "pick-problem",
        title: "Choose your capstone problem",
        detail: "Pick the highest-impact item from your Workplace Friction log and Readiness Audit. One problem, clearly stated.",
        bySessionId: "s1"
    },
    {
        id: "baseline",
        title: "Capture your baseline",
        detail: "Record how long it takes and what it costs today, so your ROI is measurable later.",
        bySessionId: "s2"
    },
    {
        id: "guardrails",
        title: "Apply your Safe Harbor guardrails",
        detail: "Define which data the capstone may touch and which it never will.",
        bySessionId: "s2"
    },
    {
        id: "workflow-v1",
        title: "Build a first working version",
        detail: "Use your triage workspace or prompt suite to solve the core of the problem end to end.",
        bySessionId: "s3"
    },
    {
        id: "automate",
        title: "Automate the hand-offs",
        detail: "Wire triggers, routing or follow-ups so the solution runs with minimal manual effort.",
        bySessionId: "s4"
    },
    {
        id: "voice-comms",
        title: "Draft your communication assets",
        detail: "Use your Brand Voice Bible to write the announcement, training note or client message.",
        bySessionId: "s5"
    },
    {
        id: "prototype",
        title: "Prototype the customer or team touchpoint",
        detail: "Mock up the intake page, portal or guide people will actually use.",
        bySessionId: "s6"
    },
    {
        id: "dry-run",
        title: "Survive the Shark Tank Dry Run",
        detail: "Deliver a two-minute pitch and capture peer feedback.",
        bySessionId: "s7"
    },
    {
        id: "roi-roadmap",
        title: "Measure ROI and write your 30-60-90 plan",
        detail: "Time saved, response times, dollars preserved, plus your post-cohort rollout roadmap.",
        bySessionId: "s7"
    },
    {
        id: "package",
        title: "Assemble the Stakeholder Capstone Package",
        detail: "Bundle the solution, guardrails, ROI evidence and roadmap for stakeholder review.",
        bySessionId: "s7"
    },
    {
        id: "lightning",
        title: "Rehearse your 5-minute lightning demo",
        detail: "Problem, solution, measurable impact. Time it, then time it again.",
        bySessionId: "s8"
    }
];
const deliverableStatuses = [
    {
        value: "not_started",
        label: "Not started"
    },
    {
        value: "in_progress",
        label: "In progress"
    },
    {
        value: "submitted",
        label: "Submitted"
    },
    {
        value: "reviewed",
        label: "Reviewed"
    }
];
const frictionFrequencies = [
    {
        value: "daily",
        label: "Daily"
    },
    {
        value: "weekly",
        label: "Weekly"
    },
    {
        value: "monthly",
        label: "Monthly"
    }
];
const resourceKinds = [
    {
        value: "prompt_sheet",
        label: "Prompt sheet"
    },
    {
        value: "slides",
        label: "Slide deck"
    },
    {
        value: "template",
        label: "Template"
    },
    {
        value: "guide",
        label: "Lab guide"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Check
]);
/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "check",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M20 6 9 17l-5-5",
                key: "1gmf2c"
            }
        ]
    ]
};
__iconData.node;
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Check",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Printer
]);
/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "printer",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
                key: "143wyd"
            }
        ],
        [
            "path",
            {
                d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",
                key: "1itne7"
            }
        ],
        [
            "rect",
            {
                x: "6",
                y: "14",
                width: "12",
                height: "8",
                rx: "1",
                key: "1ue0tg"
            }
        ]
    ]
};
__iconData.node;
const Printer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript) <export default as Printer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Printer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_0a6zspl._.js.map