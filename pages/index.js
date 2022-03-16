import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";

import useSWR from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/kpi", fetcher);

  useEffect(() => {
    if (!error && data) {
      console.log(data);
      setKpi(data["Konsumentprisindex (KPI)"]);
    }
  }, [data, error]);

  const [value, setValue] = useState(1000);
  const [kpi, setKpi] = useState({ value: 1000 });

  const onChange = (event) => {
    console.log(event);
    setValue(event.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>KPI</title>
        <meta name="description" content="Konsumentprisindex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Konsumentprisindex (KPI)-normaliserad kostnad
        </h1>
        <div className={styles.calc}>
          <input
            className={styles.input}
            type="text"
            name="amount"
            placeholder="1000"
            value={value}
            onChange={onChange}
          />
          {"kr "} = {(value / kpi.value).toFixed(3)} normaliserad kostnad
        </div>

        <p className={styles.description}>
          Källa:{" "}
          <a href="https://www.scb.se/hitta-statistik/statistik-efter-amne/priser-och-konsumtion/konsumentprisindex/konsumentprisindex-kpi/">
            SCB
          </a>
          {", KPI: "}
          {kpi.value}, {kpi.unit}, {kpi.metadata}
        </p>
      </main>
    </div>
  );
}
