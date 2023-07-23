import "../styles/globals.css";
import { NextUIProvider, Row, Loading, Spacer } from "@nextui-org/react";
import Head from "next/head";
import { createTheme } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import NextNProgress from 'nextjs-progressbar';
import { useEffect, useState } from "react";

const theme = createTheme({
	type: "dark", // it could be "light" or "dark"
	theme: {
		colors: {
			// brand colors
			background: '#000',
			text: '#fff',
			// you can also create your own color
			myDarkColor: '#ff4ecd',
			"primary":"#01c205",
			"error":"red"
			// ...  more colors
		},
		space: {},
		fonts: {}
	}
})

function App({ Component, pageProps: { session, ...pageProps } }) {
	const [loading, setloading] = useState(true);
	useEffect(()=>{
		setloading(false)
	})
	if (!loading) {
	return (
		<>
		<NextNProgress color="#01c205" />
		<NextUIProvider theme={theme}>
		<SessionProvider session={session}>
			<Component {...pageProps} />
		</SessionProvider>
		</NextUIProvider>
		</>
	);
	}
	return (
		<>
		<Head>
		</Head>
		<div className="div_center" style={{top:"45%"}}>
			<Loading css={{scale:2.5}}></Loading>
		</div>
		</>
)
}

export default App;