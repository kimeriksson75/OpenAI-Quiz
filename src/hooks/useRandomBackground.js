import { useState, useEffect } from "react";

export default function useRandomBackground() {
    const [pattern, setPattern] = useState("");
    const [color, setColor] = useState("");
    const [bgColor, setBGColor] = useState("");
    const patterns = [
        "pattern-checks-sm",
        "pattern-checks-md",
        "pattern-checks-lg",
        "pattern-checks-xl",
        "pattern-grid-sm",
        "pattern-grid-md",
        "pattern-grid-lg",
        "pattern-grid-xl",
        "pattern-dots-sm",
        "pattern-dots-md",
        "pattern-dots-lg",
        "pattern-dots-xl",
        "pattern-cross-dots-sm",
        "pattern-cross-dots-md",
        "pattern-cross-dots-lg",
        "pattern-cross-dots-xl",
        "pattern-diagonal-lines-sm",
        "pattern-diagonal-lines-md",
        "pattern-diagonal-lines-lg",
        "pattern-diagonal-lines-xl",
        "pattern-horizontal-lines-sm",
        "pattern-horizontal-lines-md",
        "pattern-horizontal-lines-lg",
        "pattern-horizontal-lines-xl",
        "pattern-vertical-lines-sm",
        "pattern-vertical-lines-md",
        "pattern-vertical-lines-lg",
        "pattern-vertical-lines-xl",
        "pattern-diagonal-stripes-sm",
        "pattern-diagonal-stripes-md",
        "pattern-diagonal-stripes-lg",
        "pattern-diagonal-stripes-xl",
        "pattern-horizontal-stripes-sm",
        "pattern-horizontal-stripes-md",
        "pattern-horizontal-stripes-lg",
        "pattern-horizontal-stripes-xl",
        "pattern-vertical-stripes-sm",
        "pattern-vertical-stripes-md",
        "pattern-vertical-stripes-lg",
        "pattern-vertical-stripes-xl",
        "pattern-triangles-sm",
        "pattern-triangles-md",
        "pattern-triangles-lg",
        "pattern-triangles-xl",
        "pattern-zigzag-sm",
        "pattern-zigzag-md",
        "pattern-zigzag-lg",
        "pattern-zigzag-xl"
    ];
    const getRandomColor = () => {
        let letters = "0123456789ABCDEF";
        let color = "#";
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const changePattern = () => {
        setColor(getRandomColor());
        setBGColor(getRandomColor());
        setPattern(patterns[Math.floor(Math.random() * patterns.length)]);
    }

    useEffect(() => {
        changePattern();
    }, []);
    return { pattern, color, bgColor };
}

