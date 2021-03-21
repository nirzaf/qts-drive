export const ignoredErrors = [
    'Uncaught (in promise): [object Object]',
    'Uncaught (in promise): [object Undefined]',
    '[object Object]',
    '{"isTrusted"\n true}',
    'Uncaught (in promise): ChunkLoadError: Loading chunk',

    // NON-INFORMATIVE HTTP ERRORS (404, 403 etc)
    'Http failure response for',
    'Http failure during parsing for',

    // TEMP SENTRY ISSUE (THROWN WHEN SERVER 500 ERROR OCCURS)
    'Non-Error exception captured with keys: messages, originalError, status, type…',

    // TINYMCE
    "Uncaught (in promise): TypeError: Cannot read property 'setAttribute' of undefined",
    "Uncaught (in promise): TypeError: Cannot read property 'getRng' of undefined",

    // TEMP html2canvas
    "Cannot assign to read only property 'className' of object '[object SVGSVGElement]'",

    // TEMP ANIMATIONS
    'The animation trigger "transform" has failed to build due to the following errors',
    "NotSupportedError: Failed to execute 'animate' on 'Element': Partial keyframes are not supported.",
    "Cannot call method 'split' of undefined",
    "Cannot call method 'trim' of undefined",
    'undefined is not a function',

    // TEMP "CLOSEST" DOM POLYFILL
    "has no method 'closest'",
    "Object doesn't support property or method 'closest'",

    // NOT SUPPORTED BROWSERS
    "Object doesn't support property or method 'setPrototypeOf'",
    'requestAnimationFrame is not defined',
    "Object [object DOMWindow] has no method 'cancelAnimationFrame'",
    "'block' member of ScrollIntoViewOptions 'center' is not a valid value for enumeration ScrollLogicalPosition.",

    // PLYR
    'Setting the playback rate is not enabled for this video.',
];
