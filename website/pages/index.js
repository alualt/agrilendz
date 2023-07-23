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
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useState } from "react";
import axios from "axios";
import { login_page } from "../components/login"
import { unauthorized_access } from "../components/unauthorized_access";
import { useRouter } from "next/router";

export default function Home(props) {
    const { data: session } = useSession()
    const [registration_state,setRegistration_State]=useState({"agent":false,"wholesaler":false,"bank":false})
    const [visible, setVisible] = React.useState(false);
    const [farmers,setFarmers]=useState([])
    const [first_load,setFirstLoad]=useState(true)
    const closeHandler = () => {
        if (!is_uploading) {
            setVisible(false);
        } else {
            setVisible(true)
        }
    };
    const [visible2, setVisible2] = React.useState(false);
    const closeHandler2 = () => {
        if (!is_uploading) {
            setVisible2(false);
        } else {
            setVisible2(true);
        }
    };
    const [visible3, setVisible3] = React.useState(false);
    const closeHandler3 = () => {
        if (!is_uploading) {
            setVisible3(false);
        } else {
            setVisible3(true);
        }
    };
    const [visible4, setVisible4] = React.useState(false);
    const closeHandler4 = () => {
        if (!is_uploading) {
            setVisible4(false);
        } else {
            setVisible4(true);
        }
    };
    const [is_uploading,setIs_Uploading]=useState(false)
    const [logged_in,setLogged_In]=useState("loading")
    const [search,setSearch]=useState("")
    const router=useRouter()
    if (session) {} else{ return (
        <div className="div_center">
        <Card css={{p:"$5","w":"500px"}}>
            <Card.Header>
                <Text h2 className="vertical" css={{width:"100%"}}>Sign-In to proceed</Text>
            </Card.Header>
            <Card.Body>
            <Button onClick={()=>{
                signIn("google")
            }}>Sign-In with Google</Button>
            </Card.Body>
        </Card>
        </div>
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
        axios.get(props.host+"/api/login").then((x)=>{
            setLogged_In(x.data)
        })
    }
    if (logged_in=="loading") {
        return <div className="div_center" style={{top:"45%"}}>
                    <div>
                    <Text h1 css={{textGradient: "45deg, #17C964 -20%, $green800 50%"}}>AgriLendz</Text>
                    </div>
                    <Spacer></Spacer>
                    <div className="wrapper">
                    <Loading></Loading>
                    </div>
                </div>
    } else if (logged_in==false) {
        return login_page(registration_state,setRegistration_State,session,props.apiurl)
    }
    console.log(logged_in)
    if (!logged_in.agent) {
        return unauthorized_access()
    }
    return (
        <div className="hidden">
            <Head>
                <title></title>
            </Head>

            <Navbar isBordered isCompact variant="floating" css={{bgBlur: "#000000"}}>
                <Navbar.Brand>
                    <Text h3 css={{textGradient: "45deg, #17C964 -20%, $green800 50%"}}>AgriLendz</Text>
                </Navbar.Brand>
                <Navbar.Content activeColor="primary">
                <Navbar.Link isActive onClick={()=>{
                    router.push("/")
                    }}>Govt. Agents</Navbar.Link>
                    <Navbar.Link onClick={()=>{
                    router.push("/bank")
                    }}>Bank</Navbar.Link>
                    <Navbar.Link onClick={()=>{
                    router.push("/wholesaler")
                    }}>Wholesaler</Navbar.Link>
                    <Navbar.Link onClick={()=>{
                    signOut()
                    }}>Logout</Navbar.Link>
                </Navbar.Content>
            </Navbar>
            <Spacer y={5}></Spacer>
            <div className="wrapper">
                <div style={{width:"70vw"}}>
                <Row css={{width:"100%"}} className="nomargin">
                <Text h1 css={{float:"left",width:"50%"}}>Welcome {session.user.name.split(" ")[0]}</Text>

                <div style={{float:"right",width:"50%",marginTop:"1.25vh",  display: "flex","align-items": "right","justify-content": "right"}}>
                <Button onClick={()=>{
                    setVisible4(true)
                }}>Settle Loan</Button>
                <Spacer></Spacer>
                <Button onClick={()=>{
                    setVisible3(true)
                }}>Apply for Loan</Button>
                <Spacer></Spacer>
                <Button onClick={()=>{
                    setVisible2(true)
                }}>Add Quality Entry</Button>
                <Spacer></Spacer>
                <Button onClick={()=>{
                    setVisible(true)
                }}>Add Farmer</Button>
                </div>
                </Row>
                <Input placeholder="Search Farmer" onChange={(x)=>{
                    setSearch(x.target.value.replaceAll(" ","").toLowerCase())
                }} width={250+70}></Input>
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
                        if (!JSON.stringify(x).replaceAll(" ","").toLowerCase().includes(search)) {
                            return
                        }
                        return (
                            <Table.Row>
                                <Table.Cell>
                                    <Text color="primary" onClick={()=>{
                                        router.push("/farmer?id="+encodeURIComponent(x[1]))
                                    }}>{x[0]}</Text>
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
                                <Table.Cell contentRight={<Button></Button>}>
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
                <Button auto id="close_modal_1" flat color="error" onPress={() => setVisible(false)}>
                    Close
                </Button>
                <Loading id="loading_spinner_add_farmer" css={{display:"none"}} color="primary"></Loading>
                <Button auto id="add_farmer_button" onPress={async () => 
                {
                    setIs_Uploading(true)
                    document.getElementById("loading_spinner_add_farmer").style.display="block"
                    document.getElementById("add_farmer_button").style.display="none"
                    document.getElementById("close_modal_1").style.display="none"
                    console.log((await axios.get(props.apiurl+"/upload"+"?name="+encodeURIComponent(document.getElementById("submit_name").value)+"&id="+encodeURIComponent(document.getElementById("submit_id").value)+"&phonenumber="+encodeURIComponent(document.getElementById("submit_number").value)+"&region="+encodeURIComponent(document.getElementById("submit_region").value))).data)
                    setIs_Uploading(false)
                    setVisible(false)
                    refresh_farmers()
                    document.getElementById("loading_spinner_add_farmer").style.display="none"
                    document.getElementById("add_farmer_button").style.display="block"
                    document.getElementById("close_modal_1").style.display="block"
                }
                }>
                    Submit
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal
            scroll
            width="600px"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            open={visible2}
            onClose={closeHandler2}
            >
                <Modal.Header>
                <Text h1 id="modal-title">
                    Add Quality Entry
                </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input bordered placeholder="Farmer ID" id="submit_id"></Input>
                    <Input bordered placeholder="Name of produce" id="submit_produce"></Input>
                    <Input bordered placeholder="Weight / grain in mg" id="submit_weight"></Input>
                    <Input bordered placeholder="Size in mm" id="submit_size"></Input>
                    <Input bordered placeholder="Hardness" id="submit_hardness"></Input>
                    <Input bordered placeholder="Quantity in Kg" id="submit_quantity"></Input>
                </Modal.Body>
                <Modal.Footer>
                <Button auto flat color="error" id="close_modal_2" onPress={() => setVisible2(false)}>
                    Close
                </Button>
                <Loading color="primary" id="quality_submit_spinner_loader" css={{display:"none"}}></Loading>
                <Button auto id="quality_submit_button" onPress={async () => 
                {
                    setIs_Uploading(true)
                    document.getElementById("quality_submit_spinner_loader").style.display="block"
                    document.getElementById("quality_submit_button").style.display="none"
                    document.getElementById("close_modal_2").style.display="none"
                    console.log((await axios.get(props.apiurl+"/upload_quality?id="+document.getElementById("submit_id").value+"&weight="+encodeURIComponent(document.getElementById("submit_weight").value)+"&hardness="+encodeURIComponent(document.getElementById("submit_hardness").value)+"&size="+encodeURIComponent(document.getElementById("submit_size").value)+"&quantity="+encodeURIComponent(document.getElementById("submit_quantity").value)+"&produce="+encodeURIComponent(document.getElementById("submit_produce").value))).data)
                    document.getElementById("quality_submit_spinner_loader").style.display="none"
                    document.getElementById("quality_submit_button").style.display="block"
                    document.getElementById("close_modal_2").style.display="block"
                    setIs_Uploading(false)
                    setVisible4(false)
                }
                }>
                    Submit
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal
            scroll
            width="600px"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            open={visible3}
            onClose={closeHandler3}
            >
                <Modal.Header>
                <Text h1 id="modal-title">
                    Apply for Loan
                </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input bordered placeholder="Farmer ID" id="submit_id"></Input>
                    <Input bordered placeholder="Ask (must be in multiples of 10)" id="submit_ask"></Input>
                </Modal.Body>
                <Modal.Footer>
                <Button auto flat color="error" id="close_modal_3" onPress={() => setVisible3(false)}>
                    Close
                </Button>
                <Loading color="primary" id="loan_apply_spinner_loader" css={{display:"none"}}></Loading>
                <Button auto id="loan_apply_button" onPress={async () => 
                {
                    setIs_Uploading(true)
                    document.getElementById("loan_apply_spinner_loader").style.display="block"
                    document.getElementById("loan_apply_button").style.display="none"
                    document.getElementById("close_modal_3").style.display="none"
                    console.log((await axios.get(props.apiurl+"/apply_for_loan?id="+document.getElementById("submit_id").value+"&amount="+document.getElementById("submit_ask").value)).data)
                    document.getElementById("loan_apply_spinner_loader").style.display="none"
                    document.getElementById("loan_apply_button").style.display="block"
                    document.getElementById("close_modal_3").style.display="block"
                    setIs_Uploading(false)
                    setVisible3(false)
                }
                }>
                    Submit
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal
            scroll
            width="600px"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            open={visible4}
            onClose={closeHandler4}
            >
                <Modal.Header>
                <Text h1 id="modal-title">
                    Settle Loan
                </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input bordered placeholder="Loan ID" id="submit_loanid"></Input>
                </Modal.Body>
                <Modal.Footer>
                <Button auto flat color="error" id="close_modal_4" onPress={() => setVisible4(false)}>
                    Close
                </Button>
                <Loading color="primary" id="loan_settle_spinner_loader" css={{display:"none"}}></Loading>
                <Button auto id="loan_settle_button" onPress={async () => 
                {
                    setIs_Uploading(true)
                    document.getElementById("loan_settle_spinner_loader").style.display="block"
                    document.getElementById("loan_settle_button").style.display="none"
                    document.getElementById("close_modal_4").style.display="none"
                    console.log((await axios.get(props.apiurl+"/settle_loan?id="+document.getElementById("submit_loanid").value)).data)
                    document.getElementById("loan_settle_spinner_loader").style.display="none"
                    document.getElementById("loan_settle_button").style.display="block"
                    document.getElementById("close_modal_4").style.display="block"
                    setIs_Uploading(false)
                    setVisible3(false)
                }
                }>
                    Submit
                </Button>
                </Modal.Footer>
            </Modal>
        </div> 
    )
}

export function getServerSideProps(context) {
    return {
        "props":{
            "apiurl":process.env.APIURL,
            "schema":process.env.SCHEMA,
            "host":process.env.SCHEMA+context.req.headers.host,
        }
    }
}