import * as React from "react";
import { useState } from "react";
import MoonCanvas, { BrushType } from "./MoonCanvas";
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";
import EditIcon from "@mui/icons-material/Edit";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";


export default function App() {
    const [brush, setBrush] = useState<BrushType>("draw");

    // TODO try swapping getBrush to ref

    return (
        <CssVarsProvider>
            <Sheet>
                <MoonCanvas rows={16} columns={16} getBrush={() => brush}></MoonCanvas>
                <ToggleButtonGroup
                    value={brush}
                    onChange={(event, newValue) => setBrush(newValue)}
                >
                    <IconButton value="draw">
                        <EditIcon/>
                    </IconButton>
                    <IconButton value="erase">
                        <EditIcon/>
                    </IconButton>
                </ToggleButtonGroup>
            </Sheet>
        </CssVarsProvider>
    );
}
