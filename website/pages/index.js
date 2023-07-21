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
Loading
} from "@nextui-org/react";
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useState } from "react";
import axios from "axios";

export default function Home(props) {
    const { data: session } = useSession()
    const [visible, setVisible] = React.useState(false);
    const [farmers,setFarmers]=useState([])
    const [first_load,setFirstLoad]=useState(true)
    const handler = () => setVisible(true);
    const closeHandler = () => {
        setVisible(false);
    };
    const [is_uploading,setIs_Uploading]=useState(false)
    if (session) {} else{ return (
        <Button onClick={()=>{
            signIn("google")
        }}>Sign-In</Button>
    )}
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
            <Spacer y={5}></Spacer>
            <div className="wrapper">
                <div style={{width:"70vw"}}>
                <Row css={{width:"100%"}} className="nomargin">
                <Text h1 css={{float:"left",width:"50%"}}>Welcome {session.user.name.split(" ")[0]}</Text>

                <div style={{float:"right",width:"50%",marginTop:"1.25vh",  display: "flex","align-items": "right","justify-content": "right"}}>
                <Button>Add Quality Entry</Button>
                <Spacer></Spacer>
                <Button onClick={()=>{
                    setVisible(true)
                }}>Add Farmer</Button>
                </div>
                </Row>
                <Input placeholder="Search Farmer" width={250+70}></Input>
                <Spacer y></Spacer>
                <Table
                bordered
                shadow={true}
                lined
                headerLined
                aria-label="Example static bordered collection table"
                css={{
                    height: "auto",
                    minWidth: "100%",
                }}
                >
                <Table.Header>
                    <Table.Column>NAME</Table.Column>
                    <Table.Column>UNIQUE ID</Table.Column>
                    <Table.Column>PHONE NUMBER</Table.Column>
                    <Table.Column>REGION</Table.Column>
                    <Table.Column>STATUS</Table.Column>
                </Table.Header>
                <Table.Body>
                    {farmers.map((x)=>{
                        return (
                            <Table.Row>
                                <Table.Cell>
                                    {x[0]}
                                </Table.Cell>
                                <Table.Cell>
                                    {x[1]}
                                </Table.Cell>
                                <Table.Cell>
                                    {x[2]}
                                </Table.Cell>
                                <Table.Cell>
                                    {x[3]}
                                </Table.Cell>
                                <Table.Cell>
                                    {x[4]}
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
                </Table>
                </div>
            </div>
            <Modal
            scroll
            width="600px"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            open={visible}
            onClose={closeHandler}
            >
                <Modal.Header>
                <Text h1 id="modal-title">
                    Add Farmer
                </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input bordered placeholder="Name" id="submit_name"></Input>
                    <Input bordered placeholder="ID" id="submit_id"></Input>
                    <Input bordered placeholder="Phone Number" id="submit_number"></Input>
                    <Input bordered placeholder="Region" id="submit_region"></Input>
                </Modal.Body>
                <Modal.Footer>
                <Button auto flat color="error" onPress={() => setVisible(false)}>
                    Close
                </Button>
                {(is_uploading) ? <Loading color="primary"></Loading> : ""}
                <Button auto onPress={async () => 
                {
                    setIs_Uploading(true)
                    console.log((await axios.get(props.apiurl+"/upload"+"?name="+encodeURIComponent(document.getElementById("submit_name").value)+"&id="+encodeURIComponent(document.getElementById("submit_id").value)+"&phonenumber="+encodeURIComponent(document.getElementById("submit_number").value)+"&region="+encodeURIComponent(document.getElementById("submit_region").value))).data)
                    setIs_Uploading(false)
                    setVisible(false)
                    refresh_farmers()
                }
                }>
                    Submit
                </Button>
                </Modal.Footer>
            </Modal>
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