(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/landing/section-heading.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SectionHeading",
    ()=>SectionHeading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function SectionHeading({ id, eyebrow, title, intro, dark = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-3xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `label ${dark ? "text-amber" : "text-amber-deep"}`,
                children: eyebrow
            }, void 0, false, {
                fileName: "[project]/components/landing/section-heading.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                id: id,
                className: `mt-3 font-display text-4xl font-light leading-[1.08] tracking-tight text-balance sm:text-5xl ${dark ? "text-white" : "text-navy-900"}`,
                children: title
            }, void 0, false, {
                fileName: "[project]/components/landing/section-heading.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            intro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `mt-5 text-lg leading-relaxed ${dark ? "text-on-navy" : "text-muted"}`,
                children: intro
            }, void 0, false, {
                fileName: "[project]/components/landing/section-heading.tsx",
                lineNumber: 24,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/section-heading.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = SectionHeading;
var _c;
__turbopack_context__.k.register(_c, "SectionHeading");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/landing/syllabus-timeline.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SyllabusTimeline",
    ()=>SyllabusTimeline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flask-conical.mjs [app-client] (ecmascript) <export default as FlaskConical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package-check.mjs [app-client] (ecmascript) <export default as PackageCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cohortData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/cohortData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tag$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tag.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$section$2d$heading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/landing/section-heading.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function SyllabusTimeline() {
    _s();
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [openIds, setOpenIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        "s1"
    ]);
    const groupId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const visible = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cohortData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessions"].filter((s)=>filter === "all" || s.focus === filter);
    const allOpen = visible.length > 0 && visible.every((s)=>openIds.includes(s.id));
    const toggle = (id)=>setOpenIds((ids)=>ids.includes(id) ? ids.filter((x)=>x !== id) : [
                ...ids,
                id
            ]);
    const toggleAll = ()=>setOpenIds((ids)=>allOpen ? ids.filter((id)=>!visible.some((s)=>s.id === id)) : [
                ...new Set([
                    ...ids,
                    ...visible.map((s)=>s.id)
                ])
            ]);
    const options = [
        {
            value: "all",
            label: "All sessions",
            count: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cohortData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessions"].length
        },
        ...__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cohortData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["focusAreas"].map((f)=>({
                value: f,
                label: f,
                count: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cohortData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessions"].filter((s)=>s.focus === f).length
            }))
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "syllabus",
        "aria-labelledby": "syllabus-title",
        className: "bg-paper-deep py-20 sm:py-28",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$section$2d$heading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionHeading"], {
                    id: "syllabus-title",
                    eyebrow: "Oct 2026 → May 2027",
                    title: "Eight sessions. Seven working assets. One showcase.",
                    intro: "Each session pairs a hook, a strategy framework and a live build lab. Filter by focus area and open a session to see what you'll build."
                }, void 0, false, {
                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            role: "group",
                            "aria-labelledby": groupId,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    id: groupId,
                                    className: "label mb-3 text-muted",
                                    children: "Filter by focus"
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                    lineNumber: 43,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2",
                                    children: options.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            "aria-pressed": filter === o.value,
                                            onClick: ()=>setFilter(o.value),
                                            className: `min-h-11 rounded-sm border px-4 text-[0.9375rem] font-medium transition-colors ${filter === o.value ? "border-navy-900 bg-navy-900 text-white" : "border-edge bg-white text-ink hover:border-navy-900"}`,
                                            children: [
                                                o.label,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "label ml-1 opacity-80",
                                                    children: o.count
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                    lineNumber: 59,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, o.value, true, {
                                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                            lineNumber: 48,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    role: "status",
                                    className: "text-sm text-muted",
                                    children: [
                                        "Showing ",
                                        visible.length,
                                        " of ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$cohortData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessions"].length,
                                        " sessions"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: toggleAll,
                                    className: "min-h-11 text-sm font-semibold text-navy-900 underline underline-offset-4 hover:text-cyan-deep",
                                    children: allOpen ? "Collapse all" : "Expand all"
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                    className: "relative mt-10 space-y-5 before:absolute before:bottom-4 before:left-[1.4375rem] before:top-4 before:w-px before:bg-edge/60 sm:before:left-[1.9375rem]",
                    children: visible.map((session)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SessionCard, {
                            session: session,
                            open: openIds.includes(session.id),
                            onToggle: ()=>toggle(session.id)
                        }, session.id, false, {
                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                            lineNumber: 80,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/landing/syllabus-timeline.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/landing/syllabus-timeline.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_s(SyllabusTimeline, "OZu6qFiP/cg2dUdDH2d22YOvDSE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = SyllabusTimeline;
function SessionCard({ session, open, onToggle }) {
    _s1();
    const uid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const buttonId = `${uid}-button`;
    const panelId = `${uid}-panel`;
    const isFinal = session.deliverable === null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "relative grid grid-cols-[3rem_1fr] gap-3 sm:grid-cols-[4rem_1fr] sm:gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `z-10 mt-5 grid size-12 place-items-center border-2 font-display text-xl sm:size-16 sm:text-2xl ${open ? "border-navy-900 bg-navy-900 text-amber" : "border-navy-900 bg-paper-deep text-navy-900"}`,
                "aria-hidden": "true",
                children: session.number
            }, void 0, false, {
                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                className: `border bg-white transition-colors ${open ? "border-navy-900 border-l-[5px] border-l-amber" : "border-line hover:border-navy-900"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: buttonId,
                            type: "button",
                            "aria-expanded": open,
                            "aria-controls": panelId,
                            onClick: onToggle,
                            className: "flex w-full items-start gap-4 p-5 text-left sm:p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex flex-wrap items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "label text-ink",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "sr-only",
                                                            children: [
                                                                "Session ",
                                                                session.number,
                                                                ": "
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 19
                                                        }, this),
                                                        session.dateLabel
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 17
                                                }, this),
                                                session.date === null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tag$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tag"], {
                                                    tone: "amber",
                                                    children: "Date TBA"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 43
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tag$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tag"], {
                                                    tone: "cyan",
                                                    children: session.focus
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                    lineNumber: 129,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-2.5 block font-display text-2xl leading-tight text-navy-900 sm:text-[1.75rem]",
                                            children: session.theme
                                        }, void 0, false, {
                                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mt-2 flex items-center gap-2 text-[0.9375rem] text-muted",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageCheck$3e$__["PackageCheck"], {
                                                    className: "size-4 shrink-0 text-amber-deep",
                                                    "aria-hidden": "true"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        isFinal ? "Outcome: " : "Deliverable: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold text-ink",
                                                            children: session.deliverable?.title ?? "5-minute lightning presentation & graduation"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                            lineNumber: 138,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                            lineNumber: 134,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: `mt-1 size-6 shrink-0 text-navy-900 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`,
                                    "aria-hidden": "true"
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "expander",
                        "data-open": open,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            inert: !open,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: panelId,
                                role: "region",
                                "aria-labelledby": buttonId,
                                className: "border-t border-line p-5 sm:p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-8 lg:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "label flex items-center gap-2 text-amber-deep",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                        className: "size-3.5",
                                                                        "aria-hidden": "true"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                        lineNumber: 158,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    "The hook"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                lineNumber: 157,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-2 font-display text-xl text-navy-900",
                                                                children: [
                                                                    "“",
                                                                    session.hook.name,
                                                                    "”"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                lineNumber: 161,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 text-muted",
                                                                children: session.hook.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                lineNumber: 162,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                        lineNumber: 156,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "label flex items-center gap-2 text-cyan-deep",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__["FlaskConical"], {
                                                                        className: "size-3.5",
                                                                        "aria-hidden": "true"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                        lineNumber: 166,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    "Hands-on lab"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                lineNumber: 165,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-2 font-display text-xl text-navy-900",
                                                                children: session.lab.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                lineNumber: 169,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 text-muted",
                                                                children: session.lab.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                lineNumber: 170,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                lineNumber: 155,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "label text-ink",
                                                        children: "Core topics"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "mt-3 space-y-2.5",
                                                        children: session.concepts.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex gap-3 text-ink",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        "aria-hidden": "true",
                                                                        className: "mt-2.5 h-px w-4 shrink-0 bg-amber-deep"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                        lineNumber: 179,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: c
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                        lineNumber: 180,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, c, true, {
                                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                lineNumber: 178,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                lineNumber: 174,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this),
                                    session.deliverable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-7 border border-navy-900 bg-navy-900 p-5 text-white",
                                        "data-surface": "dark",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "label text-amber",
                                                children: "Tangible takeaway"
                                            }, void 0, false, {
                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                lineNumber: 189,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1.5 font-display text-xl",
                                                children: session.deliverable.title
                                            }, void 0, false, {
                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                lineNumber: 190,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-on-navy",
                                                children: session.deliverable.description
                                            }, void 0, false, {
                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                lineNumber: 191,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                        lineNumber: 188,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-7",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "label text-ink",
                                                children: "90-minute run of show"
                                            }, void 0, false, {
                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                lineNumber: 196,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                                className: "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
                                                children: session.agenda.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "border border-line bg-paper p-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "label text-muted",
                                                                children: [
                                                                    b.start,
                                                                    "–",
                                                                    b.end
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                lineNumber: 200,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-1 text-sm font-semibold leading-snug text-ink",
                                                                children: b.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                                lineNumber: 203,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, b.title, true, {
                                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                                lineNumber: 197,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/landing/syllabus-timeline.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/landing/syllabus-timeline.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/syllabus-timeline.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/syllabus-timeline.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s1(SessionCard, "achrtUaX/b4xMvRVM6ki6UkSEHs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c1 = SessionCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "SyllabusTimeline");
__turbopack_context__.k.register(_c1, "SessionCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/tag.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tag",
    ()=>Tag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const tones = {
    neutral: "border-ink/40 text-ink",
    amber: "border-amber-deep text-amber-deep",
    cyan: "border-cyan-deep text-cyan-deep",
    success: "border-success text-success",
    dark: "border-amber text-amber"
};
function Tag({ children, tone = "neutral" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `label inline-flex items-center gap-1 border px-2 py-1 ${tones[tone]}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/tag.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = Tag;
var _c;
__turbopack_context__.k.register(_c, "Tag");
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
"[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>ChevronDown
]);
/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "chevron-down",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m6 9 6 6 6-6",
                key: "qrunsl"
            }
        ]
    ]
};
__iconData.node;
const ChevronDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronDown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/flask-conical.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>FlaskConical
]);
/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "flask-conical",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
                key: "18mbvz"
            }
        ],
        [
            "path",
            {
                d: "M6.453 15h11.094",
                key: "3shlmq"
            }
        ],
        [
            "path",
            {
                d: "M8.5 2h7",
                key: "csnxdl"
            }
        ]
    ]
};
__iconData.node;
const FlaskConical = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/flask-conical.mjs [app-client] (ecmascript) <export default as FlaskConical>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FlaskConical",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flask-conical.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/package-check.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>PackageCheck
]);
/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "package-check",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M12 22V12",
                key: "d0xqtd"
            }
        ],
        [
            "path",
            {
                d: "m16 17 2 2 4-4",
                key: "uh5qu3"
            }
        ],
        [
            "path",
            {
                d: "M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753",
                key: "kpkbpo"
            }
        ],
        [
            "path",
            {
                d: "M3.29 7 12 12l8.71-5",
                key: "19ckod"
            }
        ],
        [
            "path",
            {
                d: "m7.5 4.27 8.997 5.148",
                key: "9yrvtv"
            }
        ]
    ]
};
__iconData.node;
const PackageCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/package-check.mjs [app-client] (ecmascript) <export default as PackageCheck>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PackageCheck",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package-check.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Sparkles
]);
/**
 * @license lucide-react v1.47.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconData = {
    name: "sparkles",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
                key: "1s2grr"
            }
        ],
        [
            "path",
            {
                d: "M20 2v4",
                key: "1rf3ol"
            }
        ],
        [
            "path",
            {
                d: "M22 4h-4",
                key: "gwowj6"
            }
        ],
        [
            "circle",
            {
                cx: "4",
                cy: "20",
                r: "2",
                key: "6kqj1y"
            }
        ]
    ],
    aliases: [
        "stars"
    ]
};
__iconData.node;
const Sparkles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sparkles",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_1kv9drv._.js.map