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

const Stats = ({ title, body,secret_msg,isPressable,onClick }) => {
    return (
        <Card blur="true" variant="" css={{ padding: 20, width:"230px" }} isPressable={isPressable} onClick={onClick}>
        <Card.Header><Text css={{width:"100%"}} h2 color="" className="vertical">{body}</Text></Card.Header>
        <Card.Body><Text h4 color="primary" className="vertical">{title}</Text>
        <Text color="$accents8" className="vertical" css={{height:"1vh"}}>{secret_msg}</Text>
        </Card.Body>
        </Card>
    );
};

export default function Home(props) {
    const [registration_state,setRegistration_State]=useState({"agent":false,"wholesaler":false,"bank":false})
    const [logged_in,setLogged_In]=useState("loading")
    const { data: session } = useSession()
    const [visible, setVisible] = React.useState(false);
    const [farmer_details,setFarmers_Details]=useState(
        {
            "name":"-",
            "farmer_id":0,
            "number":"+0",
            "region":"-",
            "index":"-",
            "aqi":"0",
            "order_sizes":0,
            "order_volumes":0,
            "total_orders":0,
            "balance":0,
            "ratings":0,
            "trades":[],
            "pending_loans":[],
            "paid_loans":0
        }
    )
    const [first_load,setFirstLoad]=useState(true)
    const closeHandler = () => {
        if (!is_uploading) {
        setVisible(false);
        }
    };
    const [is_uploading,setIs_Uploading]=useState(false)
    const router=useRouter();
    const [rating, setRating] = useState(0)
    const handleRating = (rate) => {
        setRating(rate)
    }
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
    var id=router.query.id
    function refresh_farmer_details() {
        if (id==undefined) {
            id=1
        }
        axios.get(props.apiurl+"/farmer?id="+encodeURIComponent(id)).then((x)=>{
            console.log(x.data)
            setFarmers_Details(x.data)
        })
    }
    if (first_load) {
        setFirstLoad(false)
        refresh_farmer_details()
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
    function sum(arr) {
        var result = 0, n = arr.length || 0;
        while(n--) {
            result += +arr[n];
        }
        return result;
    }
    console.log(farmer_details)
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
                    <Navbar.Link onClick={()=>{
                    router.push("/wholesaler")
                    }}>Wholesaler</Navbar.Link>
                    <Navbar.Link onClick={()=>{
                    signOut()
                    }}>Logout</Navbar.Link>
                </Navbar.Content>
            </Navbar>
            <Spacer y={4}></Spacer>
            <div className="wrapper">
            <div style={{width:"auto"}} className="wrapper">
            <Row>
            <Card css={{w:"350px",h:"700px"}}>
            <Spacer y={1.5}></Spacer>
            <div className="wrapper">
            <img src="farmer.svg" style={{width:"80%"}}></img>
            </div>
            <Text h2 className="vertical">{farmer_details.name}</Text>
            <Spacer y={2.25}></Spacer>
            <div style={{marginLeft:"2vw",marginRight:"2vw",marginTop:"2vw"}}>
                <Row css={{width:"100%"}}>
                    <Text h4 css={{float:"left",width:"40%"}}>Unique ID :</Text>
                    <Text h4 css={{textAlign:"right",width:"60%"}}>{farmer_details.farmer_id}</Text>
                </Row>
                <Row css={{width:"100%"}}>
                    <Text h4 css={{float:"left",width:"40%"}}>Number :</Text>
                    <Text h4 css={{textAlign:"right",width:"60%"}}>{farmer_details.number}</Text>
                </Row>
                <Row css={{width:"100%"}}>
                    <Text h4 css={{float:"left",width:"30%"}}>Region :</Text>
                    <Text h4 css={{textAlign:"right",width:"70%"}}>{farmer_details.region}</Text>
                </Row>
            </div>
            </Card>
            <Spacer></Spacer>
            <div style={{width:"auto"}}>
                <Row>
                <Spacer></Spacer>
                {Stats({"title":"Avg. Quality Index","body":farmer_details.aqi})}
                <Spacer></Spacer>
                {Stats({"title":"Average Order Size","body":farmer_details.order_sizes})}
                <Spacer></Spacer>
                {Stats({"title":"Unpaid Loan","body":sum(farmer_details.pending_loans)})}
                </Row>
                <Row>
                <Spacer></Spacer>
                </Row>
                <Row>
                <Spacer></Spacer>
                {Stats({"title":"Pending Loans","body":farmer_details.pending_loans.length})}
                <Spacer></Spacer>
                {Stats({"title":"Paid Loans","body":farmer_details.paid_loans})}
                <Spacer></Spacer>
                {Stats({"title":"Total Volume","body":"$"+`${farmer_details.order_volumes}`})}
                </Row>
                <Spacer></Spacer>
                <Row>
                <Spacer></Spacer>
                {Stats({"title":"Total Orders","body":farmer_details.total_orders})}
                <Spacer></Spacer>
                {Stats({"title":"Balance","body":farmer_details.balance})}
                <Spacer></Spacer>
                {Stats({"title":"Overall Rating","body":`${farmer_details.ratings} / 5`,"secret_msg":"Click to rate","isPressable":true,"onClick":()=>{
                    setVisible(true)
                }})}
                </Row>
                <Row>
                <Spacer></Spacer>
                </Row>
                <Row css={{width:"100%"}}>
                    <Spacer></Spacer>
                    <div style={{width:"100%"}}>
                    <Text h2>Trades</Text>
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
                        <Table.Column>PRODUCE</Table.Column>
                        <Table.Column>PRICE</Table.Column>
                        <Table.Column>QUANTITY</Table.Column>
                        <Table.Column>QUALITY INDEX</Table.Column>
                        <Table.Column>STATUS</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {farmer_details.trades.map((x)=>{
                            var farmer_id=x[0]
                            var trade_id=x[6]
                            return (
                                <Table.Row>
                                    <Table.Cell>
                                        <Text>{x.produce}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{x.price}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{x.quantity} Kg</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{x.quality_index} / 5</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text>{(x.open) ? <Text color="primary">Active</Text> : <Text color="warning">Closed</Text>}</Text>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                    </Table>
                    </div>
                </Row>
            </div>
            </Row>
            </div>
            </div>
            <Spacer></Spacer>
            <Modal
            scroll
            width="600px"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            open={visible}
            onClose={closeHandler}
            >
                <Modal.Header>
                <div>
                <Text h1 id="modal-title">
                    Rate Farmer
                </Text>
                <Text h4 color="$accents8">
                    @{farmer_details.name}
                </Text>
                </div>
                </Modal.Header>
                <Modal.Body className="wrapper">
                <Input bordered id="submit_rating" placeholder="Rating out of 5" width="75%"></Input>
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
                    console.log((await axios.get(props.apiurl+"/rate"+"?id="+id+"&rating="+Number(document.getElementById("submit_rating").value).toString())).data)
                    setIs_Uploading(false)
                    setVisible(false)
                    refresh_farmer_details()
                    document.getElementById("loading_spinner_add_farmer").style.display="none"
                    document.getElementById("add_farmer_button").style.display="block"
                    document.getElementById("close_modal_1").style.display="block"
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