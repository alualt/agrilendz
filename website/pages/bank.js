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

const Stats = ({ title, body }) => {
  return (
    <Card blur="true" variant="" css={{ padding: 20 }}>
      <Card.Header><Text h2 color="">{body}</Text></Card.Header>
      <Card.Body><Text h4 color="primary">{title}</Text></Card.Body>
    </Card>
  );
};

export default function Home(props) {
    const [registration_state,setRegistration_State]=useState({"agent":false,"wholesaler":false,"bank":false})
    const [logged_in,setLogged_In]=useState("loading")
    const { data: session } = useSession()
    const [visible, setVisible] = React.useState(false);
    const [loans,setLoans]=useState([])
    const [stats,setStats]=useState({"pending":0,"lent":0})
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
        "price":0,
        "pending_loans":0
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
    function refresh_loans() {
        axios.get(props.apiurl+"/loans").then((x)=>{
            console.log(x.data)
            setLoans(x.data)
        })
        axios.get(props.apiurl+"/bank_stats").then((x)=>{
          console.log(x.data)
          setStats(x.data)
      })
    }
    if (first_load) {
        setFirstLoad(false)
        refresh_loans()
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
                <Navbar.Link isActive onClick={()=>{
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
                <Row css={{width:"150%"}} className="nomargin">
                <Text h1 css={{float:"left",width:"50%"}}>Welcome {session.user.name.split(" ")[0]}</Text>
                <Text h1 css={{float:"left",width:"50%"}}>Balance: ${logged_in.balance}</Text>
                </Row>
                <Input placeholder="Search Loan" onChange={(x)=>{
                    setSearch(x.target.value.replaceAll(" ","").toLowerCase())
                }} width={250+70}></Input>
                <Spacer y></Spacer>
                <Row>
                  <Stats title="Money Lent" body={"$"+`${stats.lent}`} />
                  <Spacer />
                  <Stats title="Loans Pending" body={"$"+`${stats.pending}`} />
                  <Spacer />
                  <Stats title="Money Left" body={"$"+`${logged_in.balance}`} />
                </Row>
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
                    <Table.Column>REGION</Table.Column>
                    <Table.Column>RATING</Table.Column>
                    <Table.Column>ASK</Table.Column>
                    <Table.Column>PENDING</Table.Column>
                    <Table.Column></Table.Column>
                </Table.Header>
                <Table.Body>
                    {loans.map((x)=>{
                        if (!JSON.stringify(x).replaceAll(" ","").toLowerCase().includes(search)) {
                            return
                        }
                        return (
                            <Table.Row>
                                <Table.Cell>
                                  <Text color="primary" onClick={()=>{
                                        router.push("/farmer?id="+x.farmer_id)
                                    }}>{x.name}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                  {x.region}
                                </Table.Cell>
                                <Table.Cell>
                                  {x.rating}
                                </Table.Cell>
                                <Table.Cell>
                                  ${x.amount}
                                </Table.Cell>
                                <Table.Cell>
                                  ${x.pending_loans}
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="wrapper">
                                    <Button auto css={{width:"10%"}} onClick={()=>{
                                        setSelectedTrade(x)
                                        setVisible(true)
                                    }}>
                                        Approve
                                    </Button>
                                    <Spacer></Spacer>
                                    <Loading color="error" id={`${x.id}_disapprove_loading`} css={{display:"none"}}></Loading>
                                    <Button auto id={`${x.id}_disapprove_button`} color="error" onClick={async ()=>{
                                        document.getElementById(`${x.id}_disapprove_button`).style.display="none"
                                        document.getElementById(`${x.id}_disapprove_loading`).style.display="block"
                                        await axios.get(props.apiurl+"/disapprove_loan?id="+encodeURIComponent(x.id))
                                        document.getElementById(`${x.id}_disapprove_button`).style.display="block"
                                        document.getElementById(`${x.id}_disapprove_loading`).style.display="none"
                                        refresh_loans()
                                    }}>
                                        Disapprove
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
                    Credit Summary
                </Text>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                    <Text h3 css={{width:"17.5%"}}>Ask:</Text>
                    <Text h3>${selected_trade.amount}</Text>
                    </Row>
                    <Row>
                    <Text h3 css={{width:"17.5%"}}>Interest:</Text>
                    <Text h3>10%</Text>
                    </Row>
                    <Row>
                    <Text h3 css={{width:"17.5%"}}>Profit:</Text>
                    <Text h3 color="primary">${selected_trade.amount/10}</Text>
                    </Row>
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
                    console.log((await axios.get(props.apiurl+"/approve_loan?email="+encodeURIComponent(session.user.email)+"&id="+selected_trade.id)).data)
                    document.getElementById("buy_spinner").style.display="none"
                    document.getElementById("buy_btn").style.display="block"
                    document.getElementById("close_btn").style.display="block"
                    setIs_Uploading(false)
                    setVisible(false)
                    refresh_loans()
                }
                }>
                    Approve Loan
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