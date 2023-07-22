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

export function login_page(current_state,setCurrent_State,session,apiurl) {
    return (
        <>
        <div className="div_center">
            <Card css={{p:"$5","w":"500px"}}>
                <Card.Header>
                    <div style={{"width":"100%"}}>
                    <Text h1 className="vertical" css={{"width":"100%"}}>Registration</Text>
                    <Text h4 color="$accents8" className="vertical" css={{"width":"100%"}}>{session.user.email}</Text>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row className="wrapper">
                        <Text h3 css={{width:"55%"}} id="submit_bank">Bank</Text>
                        <Spacer></Spacer>
                        <Switch onChange={
                            (x)=>{
                                var new_state=current_state;
                                new_state.bank=x.target.checked
                                setCurrent_State(new_state)
                                console.log(new_state)
                            }
                        }></Switch>
                    </Row>
                    <Row className="wrapper">
                        <Text h3 css={{width:"55%"}} id="submit_wholesaler">Wholesaler</Text>
                        <Spacer></Spacer>
                        <Switch onChange={
                            (x)=>{
                                var new_state=current_state;
                                new_state.wholesaler=x.target.checked
                                setCurrent_State(new_state)
                                console.log(new_state)
                            }
                        }></Switch>
                    </Row>
                    <Row className="wrapper">
                        <Text h3 css={{width:"55%"}} id="submit_agent">Agent</Text>
                        <Spacer></Spacer>
                        <Switch onChange={
                            (x)=>{
                                var new_state=current_state;
                                new_state.agent=x.target.checked
                                setCurrent_State(new_state)
                                console.log(new_state)
                            }
                        }></Switch>
                    </Row>
                    <Spacer></Spacer>
                    <div className="wrapper">
                        <Button id="register_btn" onClick={async ()=>{
                            document.getElementById("loading_spinner").style.display="block"
                            document.getElementById("register_btn").style.display="none"
                            await axios.get(apiurl+"/register?bank="+encodeURIComponent(current_state.bank)+"&agent="+encodeURIComponent(current_state.agent)+"&wholesaler="+encodeURIComponent(current_state.wholesaler)+"&email="+encodeURIComponent(session.user.email))
                            window.location=window.location
                        }}>Submit</Button>
                        <Loading id="loading_spinner" css={{display:"none"}}></Loading>
                    </div>
                </Card.Body>
            </Card>
        </div>
        </>
    )
}