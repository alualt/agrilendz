import Head from "next/head";
import { 
Text, 
Link, 
Navbar, 
Spacer, 
Divider, 
Button, 
Row,
Input,
Table,
Modal,
Loading,
Card,
Switch
} from "@nextui-org/react";
import axios from "axios";

export function unauthorized_access() {
    return (
        <>
        <div className="div_center">
            <Text h1 color="error">Error: Unauthorized Access</Text>
        </div>
        </>
    )
}