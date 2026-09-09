import { useMemo, useState } from "react";
import QRCode from "qrcode";
import { trackCustomEvent } from "../lib/firebase";
import {
  buildPromotionUrl,
  buildShareText,
  type PromotionChannel,
  type PromotionEvent
} from "../features/promotion/promotion";

type Feedback = { tone: "success" | "error"; text: string } | null;

function recordAction(event: PromotionEvent, channel: PromotionChannel) {
  try {
    trackCustomEvent("host_promotion_action", {
      tailgate_id: event.id,
      visibility_type: event.visibilityType,
      promotion_channel: channel
    });
  } catch (error) {
    console.warn("Host promotion analytics failed", error);
  }
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Some browsers expose Clipboard but deny it outside a trusted context.
    }
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Copy unavailable");
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

function dataUrlToFile(dataUrl: string, filename: string) {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);/)?.[1] ?? "image/png";
  const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  return new File([bytes], filename, { type: mime });
}

function drawWrappedTitle(context: CanvasRenderingContext2D, title: string) {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= 720 || !line) line = candidate;
    else {
      lines.push(line);
      line = word;
    }
  });
  if (line) lines.push(line);
  lines.slice(0, 2).forEach((value, index) => {
    context.fillText(index === 1 && lines.length > 2 ? `${value}…` : value, 420, 118 + index * 50);
  });
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

async function createBrandedQr(event: PromotionEvent, eventUrl: string) {
  const codeDataUrl = await QRCode.toDataURL(eventUrl, {
    width: 600,
    margin: 3,
    errorCorrectionLevel: "H",
    color: { dark: "#172844", light: "#ffffff" }
  });
  const codeImage = await loadImage(codeDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = 840;
  canvas.height = 1050;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  context.fillStyle = "#172844";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f2c94c";
  context.font = "700 34px Arial, sans-serif";
  context.textAlign = "center";
  context.fillText("TAILGATETIME", 420, 62);
  context.fillStyle = "#ffffff";
  context.font = "700 42px Arial, sans-serif";
  drawWrappedTitle(context, event.name);

  context.fillStyle = "#ffffff";
  context.beginPath();
  context.roundRect(90, 220, 660, 660, 28);
  context.fill();
  context.drawImage(codeImage, 120, 250, 600, 600);

  context.fillStyle = "#f2c94c";
  context.font = "700 32px Arial, sans-serif";
  context.fillText(
    event.visibilityType === "open_paid" ? "SCAN FOR TICKETS & DETAILS" : "SCAN TO VIEW EVENT",
    420,
    950
  );
  context.fillStyle = "#dbe7f5";
  context.font = "500 22px Arial, sans-serif";
  context.fillText("Open the camera on your phone and point it at the code", 420, 998);
  return canvas.toDataURL("image/png");
}

export default function HostPromotionToolkit({ event }: { event: PromotionEvent }) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const copyUrl = useMemo(() => buildPromotionUrl(event.id, "host_copy_link"), [event.id]);

  const handleCopyLink = async () => {
    try {
      await copyText(copyUrl);
      recordAction(event, "host_copy_link");
      setFeedback({ tone: "success", text: "Event link copied." });
    } catch {
      setFeedback({ tone: "error", text: "We couldn't copy the link. Try again." });
    }
  };

  const handleShare = async () => {
    const url = buildPromotionUrl(event.id, "host_native_share");
    try {
      if (navigator.share) {
        await navigator.share({ title: event.name, text: buildShareText(event), url });
        recordAction(event, "host_native_share");
        setFeedback({ tone: "success", text: "Share sheet opened." });
      } else {
        await copyText(url);
        recordAction(event, "host_native_share");
        setFeedback({ tone: "success", text: "Sharing isn't available here, so the link was copied." });
      }
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") {
        setFeedback({ tone: "error", text: "We couldn't open sharing. You can still copy the link." });
      }
    }
  };

  const handleGenerateQr = async () => {
    if (qrLoading) return;
    setQrLoading(true);
    try {
      const url = buildPromotionUrl(event.id, "host_qr");
      setQrDataUrl(await createBrandedQr(event, url));
      recordAction(event, "host_qr");
      setFeedback({ tone: "success", text: "QR code is ready." });
    } catch {
      setFeedback({ tone: "error", text: "We couldn't create the QR code. Try again." });
    } finally {
      setQrLoading(false);
    }
  };

  const shareQr = async () => {
    if (!qrDataUrl) return;
    const filename = `${event.id}-qr.png`;
    const file = dataUrlToFile(qrDataUrl, filename);
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: `${event.name} QR code`, files: [file] });
      } else {
        downloadDataUrl(qrDataUrl, filename);
        setFeedback({ tone: "success", text: "The QR code was downloaded to your device." });
      }
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") {
        setFeedback({ tone: "error", text: "We couldn't share the QR code. Try downloading it instead." });
      }
    }
  };

  return (
    <section className="promotion-toolkit" aria-labelledby="promotion-toolkit-title">
      <div className="promotion-toolkit-heading">
        <div>
          <p className="promotion-kicker">Host Promotion Toolkit</p>
          <h2 id="promotion-toolkit-title">Share Your Tailgate</h2>
          <p>Copy your public event link or create a QR code for guests to scan.</p>
        </div>
        <span className={`promotion-type promotion-type-${event.visibilityType === "open_paid" ? "paid" : "free"}`}>
          {event.visibilityType === "open_paid" ? "Open Paid" : "Open Free"}
        </span>
      </div>

      <div className="promotion-primary-actions">
        <button type="button" className="primary-button" onClick={handleShare}>Share Event</button>
        <button type="button" className="secondary-button" onClick={handleCopyLink}>Copy Link</button>
      </div>
      {feedback ? <p className={`promotion-feedback ${feedback.tone}`} role="status">{feedback.text}</p> : null}

      <div className="promotion-tool-grid">
        <article className="promotion-tool-card">
          <div><p className="promotion-tool-label">QR Code</p><h3>Make it scannable</h3><p>Let people scan to view your public tailgate page.</p></div>
          {qrDataUrl ? <img className="promotion-qr-preview" src={qrDataUrl} alt={`QR code for ${event.name}`} /> : <div className="promotion-tool-placeholder" aria-hidden="true">▦</div>}
          <div className="promotion-card-actions">
            <button type="button" className="secondary-button" disabled={qrLoading} onClick={handleGenerateQr}>{qrLoading ? "Creating…" : qrDataUrl ? "Refresh QR Code" : "View QR Code"}</button>
            {qrDataUrl ? <><button type="button" className="outline-button" onClick={() => downloadDataUrl(qrDataUrl, `${event.id}-qr.png`)}>Download</button><button type="button" className="outline-button" onClick={() => void shareQr()}>Share</button></> : null}
          </div>
        </article>
      </div>
    </section>
  );
}
