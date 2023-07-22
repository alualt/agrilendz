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
Card
} from "@nextui-org/react";
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useState } from "react";
import axios from "axios";

const Stats = ({ title, body }) => {
    return (
        <Card blur="true" variant="" css={{ padding: 20, width:"230px" }}>
        <Card.Header><Text css={{width:"100%"}} h2 color="" className="vertical">{body}</Text></Card.Header>
        <Card.Body><Text h4 color="primary" className="vertical">{title}</Text></Card.Body>
        </Card>
    );
};

export default function Home(props) {
    const { data: session } = useSession()
    const [visible, setVisible] = React.useState(false);
    const [farmers,setFarmers]=useState([])
    const [first_load,setFirstLoad]=useState(true)
    const closeHandler = () => {
        if (!is_uploading) {
        setVisible(false);
        }
    };
    const [visible2, setVisible2] = React.useState(false);
    const closeHandler2 = () => {
        if (!is_uploading) {
        setVisible(false);
        }
    };
    const [is_uploading,setIs_Uploading]=useState(false)

    function refresh_farmers() {
        axios.get(props.apiurl+"/farmers").then((x)=>{
            console.log(x.data)
            setFarmers(x.data)
        })
    }
    if (first_load) {
        setFirstLoad(false)
        refresh_farmers()
    }
    return (
        <>
            <Head>
                <title></title>
            </Head>

            <Navbar isBordered isCompact variant="floating" css={{bgBlur: "#000000"}}>
                <Navbar.Brand>
                    <Text h3 css={{textGradient: "45deg, #17C964 -20%, $green800 50%"}}>AgriLendz</Text>
                </Navbar.Brand>
                <Navbar.Content activeColor="primary">
                <Navbar.Link isActive href="/">Home</Navbar.Link>
                </Navbar.Content>
            </Navbar>
            <Spacer y={4}></Spacer>
            <div className="wrapper">
            <div style={{width:"auto"}} className="wrapper">
            <Row>
            <Card css={{w:"350px",h:"667.5px"}}>
            <Spacer y={1.5}></Spacer>
            <div className="wrapper">
            <img src="farmer.svg" style={{width:"80%"}}></img>
            </div>
            <Text h2 className="vertical">Aarav Dayal</Text>
            <Spacer y={2}></Spacer>
            <div style={{marginLeft:"2vw",marginRight:"2vw",marginTop:"2vw"}}>
                <Row css={{width:"100%"}}>
                    <Text h4 css={{float:"left",width:"40%"}}>Unique ID :</Text>
                    <Text h4 css={{textAlign:"right",width:"60%"}}>1</Text>
                </Row>
                <Row css={{width:"100%"}}>
                    <Text h4 css={{float:"left",width:"40%"}}>Number :</Text>
                    <Text h4 css={{textAlign:"right",width:"60%"}}>+91 9506141111</Text>
                </Row>
                <Row css={{width:"100%"}}>
                    <Text h4 css={{float:"left",width:"30%"}}>Region :</Text>
                    <Text h4 css={{textAlign:"right",width:"70%"}}>Delhi</Text>
                </Row>
            </div>
            </Card>
            <Spacer></Spacer>
            <div style={{width:"auto"}}>
                <Row>
                <Spacer></Spacer>
                {Stats({"title":"Avg. Quality Index","body":15})}
                <Spacer></Spacer>
                {Stats({"title":"Average Order Size","body":1500})}
                <Spacer></Spacer>
                {Stats({"title":"Active Since (days)","body":1})}
                </Row>
                <Row>
                <Spacer></Spacer>
                </Row>
                <Row>
                <Spacer></Spacer>
                {Stats({"title":"Pending Loans","body":1})}
                <Spacer></Spacer>
                {Stats({"title":"Paid Loans","body":2})}
                <Spacer></Spacer>
                {Stats({"title":"Total Volume","body":"$100"})}
                </Row>
                <Spacer></Spacer>
                <Row>
                <Spacer></Spacer>
                {Stats({"title":"Total Orders","body":1})}
                <Spacer></Spacer>
                {Stats({"title":"Balance","body":2})}
                <Spacer></Spacer>
                {Stats({"title":"Overall Rating","body":"5 / 5"})}
                </Row>
                <Row>
                <Spacer></Spacer>
                </Row>
            </div>
            </Row>
            </div>
            </div>
        </> 
    )
}

export function getServerSideProps() {
    return {
        "props":{
            "apiurl":process.env.APIURL,
            "schema":process.env.SCHEMA
        }
    }
}