import Head from "next/head";
import { Text, Card, Navbar, Table, Container, Spacer, Row, Progress } from '@nextui-org/react';
import React from 'react';

const Stats = ({ title, body }) => {
  return (
    <Card blur="true" variant="" css={{ padding: 20, bgBlur: "#0f111466" }}>
      <Card.Header><Text h2 color="">{body}</Text></Card.Header>
      <Card.Body><Text h4 color="primary">{title}</Text></Card.Body>
    </Card>
  );
};

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "yield",
    label: "YIELD",
  },
  {
    key: "sales",
    label: "SALES",
  },
  {
    key: "rating",
    label: "RATING"
  }
];

const rows = [
    {
      key: "1",
      name: "Tony Reichert",
      yield: "5000 kg",
      sales: "$10000",
      rating: 4.8,
    },
    {
      key: "2",
      name: "Zoey Lang",
      yield: "3000 kg",
      sales: "$7000",
      rating: 4.5,
    },
    {
      key: "3",
      name: "Jane Fisher",
      yield: "4000 kg",
      sales: "$8500",
      rating: 4.7,
    },
    {
      key: "4",
      name: "William Howard",
      yield: "2500 kg",
      sales: "$5500",
      rating: 4.2,
    },
    {
      key: "5",
      name: "Oliver Scott",
      yield: "4200 kg",
      sales: "$9000",
      rating: 4.6,
    },
    {
      key: "6",
      name: "Emily Chen",
      yield: "3200 kg",
      sales: "$6500",
      rating: 4.3,
    },
    {
      key: "7",
      name: "Lucas Reed",
      yield: "3800 kg",
      sales: "$7800",
      rating: 4.5,
    },
    {
      key: "8",
      name: "Sophia Turner",
      yield: "4800 kg",
      sales: "$9500",
      rating: 4.9,
    },
    {
      key: "9",
      name: "Jackson Lee",
      yield: "2900 kg",
      sales: "$6000",
      rating: 4.2,
    },
    {
      key: "10",
      name: "Ava Patel",
      yield: "3900 kg",
      sales: "$8200",
      rating: 4.4,
    },
    {
      key: "11",
      name: "Ethan Martin",
      yield: "3400 kg",
      sales: "$7200",
      rating: 4.3,
    },
    {
      key: "12",
      name: "Amelia Morris",
      yield: "4100 kg",
      sales: "$8800",
      rating: 4.6,
    },
    {
      key: "13",
      name: "Mason White",
      yield: "3100 kg",
      sales: "$6600",
      rating: 4.1,
    },
    {
      key: "14",
      name: "Harper Bennett",
      yield: "3700 kg",
      sales: "$7600",
      rating: 4.4,
    },
    {
      key: "15",
      name: "Evelyn Rivera",
      yield: "4300 kg",
      sales: "$9200",
      rating: 4.7,
    },
    {
      key: "16",
      name: "Sebastian Lewis",
      yield: "2600 kg",
      sales: "$5200",
      rating: 4.0,
    },
    {
      key: "17",
      name: "Sofia Adams",
      yield: "5100 kg",
      sales: "$10500",
      rating: 4.9,
    },
    {
      key: "18",
      name: "James Mitchell",
      yield: "2200 kg",
      sales: "$4800",
      rating: 3.8,
    },
    {
      key: "19",
      name: "Avery Young",
      yield: "3600 kg",
      sales: "$7400",
      rating: 4.3,
    },
    {
      key: "20",
      name: "Victoria Clark",
      yield: "4500 kg",
      sales: "$9400",
      rating: 4.8,
    }
  ];
  


export default function Bank() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Navbar isCompact isBordered variant="sticky">
        <Navbar.Brand><Text h3 css={{ textGradient: "45deg, $blue600 -20%, $green600 50%" }}>AgroLendz</Text></Navbar.Brand>
        <Navbar.Content activeColor="primary" variant="underline">
          <Navbar.Link href="/">Home</Navbar.Link>
          <Navbar.Link href="/about">About Us</Navbar.Link>
          <Navbar.Link href="/bank" isActive>Bank Dashboard</Navbar.Link>
        </Navbar.Content>
      </Navbar>

      <Spacer x={15} y={1}><Text h1>Dashboard</Text></Spacer>
      <Spacer y={2} />

      <Container gap={25}>
        <Spacer y={2} />

        <Row gap={1}>
          <Stats title="Money Lent" body="$96M" />
          <Spacer />
          <Stats title="Loans Pending" body="$69M" />
          <Spacer />
          <Stats title="Money Left" body="$696M" />
        </Row>

        <Spacer y={2} />

        <Table lined headerLined={false} shadow={false} css={{ height: 'auto', minWidth: '100%' }}>
          <Table.Header columns={columns}>{(column) => <Table.Column key={column.key}>{column.label}</Table.Column>}</Table.Header>
          <Table.Body items={rows}>
            {(item) => (
              <Table.Row key={item.key}>
                {(columnKey) => (
                  <Table.Cell>
                    {columnKey === 'rating' ? (
                      <Progress color={"primary"} value={item[columnKey]*20}/>
                    ) : (
                      <Text h4>{item[columnKey]}</Text>
                    )}
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Container>
    </>
  );
}
