import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DslCharts({ report }) {
  const bits = report?.dsl?.bits_array_ds || null;
  const hlogDs = report?.dsl?.hlog?.ds || null;
  const hlogUs = report?.dsl?.hlog?.us || null;

  const bitsData = useMemo(() => (bits ? bits.map((b, i) => ({ x: i, y: b })) : []), [bits]);
  const hlogDsData = useMemo(() => (hlogDs ? hlogDs.map((v, i) => ({ x: i, y: v })) : []), [hlogDs]);
  const hlogUsData = useMemo(() => (hlogUs ? hlogUs.map((v, i) => ({ x: i, y: v })) : []), [hlogUs]);

  return (
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>DSL Charts</h2>

      <div style={{ marginBottom: 18 }}>
        <h3>Bitloading (Bits Array DS)</h3>
        {bitsData.length ? <Chart data={bitsData} yLabel="Bits" /> : <div style={muted}>Keine Bits Array DS Daten gefunden.</div>}
      </div>

      <div style={{ marginBottom: 18 }}>
        <h3>HLOG Downstream</h3>
        {hlogDsData.length ? <Chart data={hlogDsData} yLabel="HLOG" /> : <div style={muted}>Keine HLOG DS Daten gefunden.</div>}
      </div>

      <div>
        <h3>HLOG Upstream</h3>
        {hlogUsData.length ? <Chart data={hlogUsData} yLabel="HLOG" /> : <div style={muted}>Keine HLOG US Daten gefunden.</div>}
      </div>
    </div>
  );
}

function Chart({ data, yLabel }) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" tick={{ fill: "#9aa4b2" }} />
          <YAxis tick={{ fill: "#9aa4b2" }} label={{ value: yLabel, angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Line type="monotone" dataKey="y" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const card = {
  border: "1px solid #222",
  borderRadius: 14,
  padding: 16,
  background: "#0b0f14",
  color: "#e6e6e6"
};

const muted = { color: "#9aa4b2" };
