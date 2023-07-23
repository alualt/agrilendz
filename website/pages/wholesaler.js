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
import { login_page } from "../components/login"
import { useRouter } from "next/router";
import { unauthorized_access } from "../components/unauthorized_access";

export default function Home(props) {
    const [registration_state,setRegistration_State]=useState({"agent":false,"wholesaler":false,"bank":false})
    const [logged_in,setLogged_In]=useState("loading")
    const { data: session } = useSession()
    const [visible, setVisible] = React.useState(false);
    const [trades,setTrades]=useState([])
    const [first_load,setFirstLoad]=useState(true)
    const closeHandler = () => {
        if (!is_uploading) {
        setVisible(false);
        }
    };
    const [is_uploading,setIs_Uploading]=useState(false)
    const [search,setSearch]=useState("")
    const [selected_trade,setSelectedTrade]=useState({
        "id":0,
        "farmer_id":"1",
        "weight":0,
        "hardness":0,
        "size":0,
        "open":true,
        "quantity":0,
        "quality_index":0,
        "produce":"-",
        "price":0
    })
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
    function refresh_trades() {
        axios.get(props.apiurl+"/trades").then((x)=>{
            console.log(x.data)
            setTrades(x.data)
        })
    }
    if (first_load) {
        setFirstLoad(false)
        refresh_trades()
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
    if (!logged_in.wholesaler) {
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
                <Navbar.Link onClick={()=>{
                    router.push("/")
                    }}>Govt. Agents</Navbar.Link>
                    <Navbar.Link onClick={()=>{
                    router.push("/bank")
                    }}>Bank</Navbar.Link>
                    <Navbar.Link isActive onClick={()=>{
                    router.push("/wholesaler")
                    }}>Wholesaler</Navbar.Link>
                </Navbar.Content>
            </Navbar>
            <Spacer y={5}></Spacer>
            <div className="wrapper">
                <div style={{width:"70vw"}}>
                <Row css={{width:"150%"}} className="nomargin">
                <Text h1 css={{float:"left",width:"50%"}}>Welcome {session.user.name.split(" ")[0]}</Text>
                <Text h1 css={{float:"left",width:"50%"}}>Balance: ${logged_in.balance}</Text>
                </Row>
                <Input placeholder="Search Deal" onChange={(x)=>{
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
                    <Table.Column>PRODUCE</Table.Column>
                    <Table.Column>QUANTITY</Table.Column>
                    <Table.Column>QUALITY INDEX</Table.Column>
                    <Table.Column>REGION</Table.Column>
                    <Table.Column></Table.Column>
                </Table.Header>
                <Table.Body>
                    {trades.map((x)=>{
                        if (!JSON.stringify(x).replaceAll(" ","").toLowerCase().includes(search)) {
                            return
                        }
                        var farmer_id=x[0]
                        var trade_id=x[6]
                        return (
                            <Table.Row>
                                <Table.Cell>
                                    <Text color="primary" onClick={()=>{
                                        router.push("/farmer?id="+x.farmer_id)
                                    }}>{x.farmer_name}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text>{x.produce}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text>{x.quantity} Kg</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text>{x.quality_index} / 5</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text>{x.region}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="wrapper">
                                    <Button auto onClick={()=>{
                                        setSelectedTrade(x)
                                        setVisible(true)
                                    }}>
                                        <img src="tick.svg"></img>
                                    </Button>
                                    </div>
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
                    Order Summary
                </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text h3>Produce: {selected_trade.produce}</Text>
                    <Text h3>Weight: {selected_trade.weight} mg per unit</Text>
                    <Text h3>Hardness: {selected_trade.hardness} / 5</Text>
                    <Text h3>Size: {selected_trade.size} mm</Text>
                    <Text h3>Quantity: {selected_trade.quantity} Kg</Text>
                    <Text h3>Quality Index: {selected_trade.quality_index} / 5</Text>
                    <Text h3>Price: ${selected_trade.price} per unit</Text>
                    <Text h3>Total Cost: ${selected_trade.price*selected_trade.quantity} per unit</Text>
                </Modal.Body>
                <Modal.Footer>
                <Button auto flat color="error" id="close_btn" onPress={() => setVisible(false)}>
                    Close
                </Button>
                <Loading color="primary" css={{display:"none"}} id="buy_spinner"></Loading>
                <Button id="buy_btn" auto onPress={async () => 
                {
                    setIs_Uploading(true)
                    document.getElementById("buy_spinner").style.display="block"
                    document.getElementById("buy_btn").style.display="none"
                    document.getElementById("close_btn").style.display="none"
                    console.log((await axios.get(props.apiurl+"/buy?email="+encodeURIComponent(session.user.email)+"&id="+selected_trade.id)).data)
                    document.getElementById("buy_spinner").style.display="none"
                    document.getElementById("buy_btn").style.display="block"
                    document.getElementById("close_btn").style.display="block"
                    setIs_Uploading(false)
                    setVisible(false)
                    refresh_trades()
                }
                }>
                    Place Order
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