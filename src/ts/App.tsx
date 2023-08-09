import * as React from "react";
import { useState } from "react";
import MoonCanvas, { BrushType } from "./MoonCanvas";
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import IconButton from "@mui/joy/IconButton";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";
import BrushIcon from "@mui/icons-material/Brush";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";


interface AppProps {
    title: string,
}


export default function App(props: AppProps) {
    const [brush, setBrush] = useState<BrushType>("draw");

    // TODO try swapping getBrush to ref

    return (
        <CssVarsProvider>
            <Sheet sx={{p: 2}}>
                <Typography sx={{ textAlign: "center" }} level="h1">{props.title}</Typography>
                <Typography sx={{ textAlign: "center" }} level="h4">MOONDRAW</Typography>
                <Card variant="soft" sx={{alignItems: "center", m: 3}}>
                    <MoonCanvas rows={16} columns={16} getBrush={() => brush}></MoonCanvas>
                    <ToggleButtonGroup
                        value={brush}
                        onChange={(event, newValue) => setBrush(newValue)}
                    >
                        <IconButton value="draw">
                            <BrushIcon />
                        </IconButton>
                        <IconButton value="erase">
                            <RemoveCircleIcon />
                        </IconButton>
                    </ToggleButtonGroup>
                </Card>
                <Typography sx={{ textAlign: "center" }} level="body-sm">Made with <Link href="https://react.dev/">React</Link> and <Link href="https://mui.com/joy-ui/getting-started/">Joy-UI</Link>. Current lunar phase provided by <Link href="https://www.npmjs.com/package/lunarphase-js">lunarphase-js</Link>.</Typography>
            </Sheet>
        </CssVarsProvider>
    );
}
