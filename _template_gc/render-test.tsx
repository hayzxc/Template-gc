import React from "react";
import { renderToFile } from "@react-pdf/renderer";
import { CertificateDocument } from "../components/certificate/CertificateDocument";

const data = {
    certificateDate: new Date("2026-07-27"),
    commodity: [
        "1 X 40HD CONTAINER",
        "19 PACKAGES = 2,007 PCS = 31.5140 M3 OF",
        "KERUING (DIPTEROCARPUS ELONGATUS) KILN DRIED SOLID SHIPLAP",
        "AS PER PO #TP-11676-BC LOT-1",
        "",
        "GW : 23,635.50 KGS",
        "NW : 22,059.80 KGS",
    ].join("\n"),
    containerNumber: "MSKU 123456-7",
    carrierVessel: "MV OCEAN STAR V.012",
    fumigationArea: "Tanjung Priok Port, Jakarta",
    commencingAt: new Date("2026-07-25T08:00:00"),
    completedAt: new Date("2026-07-27T08:00:00"),
    gasLevelPpm: 3,
    fumigatorName: "John Doe",
    fumigatorSignatureUrl: "",
};

renderToFile(
    <CertificateDocument data={data} />,
    "d:/File Kerja/Template/_template_gc/render_test.pdf"
).then(() => console.log("render_test.pdf written"));
