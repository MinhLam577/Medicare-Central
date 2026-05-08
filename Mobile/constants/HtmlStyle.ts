import { MixedStyleDeclaration } from "react-native-render-html";

export const htmlStyle = {
    "ql-align-center": {
        textAlign: "center",
    },
    "ql-font-Arial": {
        fontFamily: "Arial",
    },
    ".ql-editor strong": {
        fontWeight: "bold",
    },
    ".ql-editor h1": {
        fontSize: "2rem",
        fontFamily: "'Arial', sans-serif !important",
        fontWeight: "bold !important",
    },
    ".ql-editor h2": {
        fontSize: "1.5rem",
        fontWeight: "bold !important",
        fontFamily: "'Arial', sans-serif !important",
    },
    ".ql-editor h3": {
        fontSize: "1.17rem",
        fontWeight: "bold !important",
        fontFamily: "'Arial', sans-serif !important",
    },
    ".ql-editor h4": {
        fontSize: "1rem",
        fontWeight: "bold !important",
        fontFamily: "'Arial', sans-serif !important",
    },
    ".ql-editor h5": {
        fontSize: "0.83rem",
        fontWeight: "bold !important",
        fontFamily: "'Arial', sans-serif !important",
    },
    ".ql-editor h6": {
        fontSize: "0.67rem",
        fontWeight: "bold !important",
        fontFamily: "'Arial', sans-serif !important",
    },
    ".ql-editor p": {
        fontSize: "1rem",
        fontFamily: "'Arial', sans-serif",
    },
    ".ql-editor img": {
        display: "inline-block",
    },
    ".ql-editor a": {
        color: "#2567a5",
        textDecoration: "underline",
        fontSize: "1rem",
    },
    ".ql-editor .ql-font-Montserrat": {
        fontFamily: "'Montserrat' !important",
    },
    ".ql-editor .ql-font-Arial": {
        fontFamily: "'Arial', sans-serif !important",
    },
    ".ql-editor .ql-size-huge": {
        fontSize: "1.5rem !important",
    },
    ".ql-editor .ql-size-large": {
        fontSize: "1.25rem !important",
    },
    ".ql-editor .ql-size-small": {
        fontSize: "0.75rem !important",
    },
    ".ql-editor .ql-size-normal": {
        fontSize: "1rem !important",
    },
    ".ql-editor .ql-align-center": {
        textAlign: "center !important",
    },
    ".ql-editor .ql-align-justify": {
        textAlign: "justify !important",
    },
    ".ql-editor .ql-align-right": {
        textAlign: "right !important",
    },
    ".ql-editor .ql-indent-1:not(.ql-direction-rtl)": {
        paddingLeft: "3em",
    },
    ".ql-editor .ql-indent-2:not(.ql-direction-rtl)": {
        paddingLeft: "6em",
    },
    ".ql-editor .ql-indent-3:not(.ql-direction-rtl)": {
        paddingLeft: "9em",
    },
    ".ql-editor .ql-indent-4:not(.ql-direction-rtl)": {
        paddingLeft: "12em",
    },
    ".ql-editor .ql-indent-5:not(.ql-direction-rtl)": {
        paddingLeft: "15em",
    },
    ".ql-editor .ql-indent-6:not(.ql-direction-rtl)": {
        paddingLeft: "18em",
    },
    ".ql-editor .ql-indent-7:not(.ql-direction-rtl)": {
        paddingLeft: "21em",
    },
    ".ql-editor .ql-indent-8:not(.ql-direction-rtl)": {
        paddingLeft: "24em",
    },
    ".ql-editor .custom-blockquote": {
        width: "100%",
        margin: "0 auto 0 0 !important",
        padding: "0 1.875rem 0 1.25rem !important",
        color: "#555555",
    },
    ":root": {
        fontSize: "1rem",
        fontFamily: "Arial, sans-serif",
        color: "#000000",
        backgroundColor: "#ffffff",
        fontWeight: "normal",
        fontStyle: "normal",
    },
    ".ql-editor .custom-list-item, .ql-editor .custom-list-item li, .ql-editor .custom-list-item li::before": {
        fontSize: "var(--font-size)",
        fontFamily: "var(--font-family)",
        color: "var(--color)",
        backgroundColor: "var(--background-color)",
        fontWeight: "var(--font-weight)",
        fontStyle: "var(--font-style)",
    },
} as unknown as Readonly<Record<string, MixedStyleDeclaration>>;
